import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  const { verifyOtp, resendOtp, pendingEmail } = useAuth();
  const navigate = useNavigate();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1].focus();
      }
      // Clear current input
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pasteOtp = pasteData.replace(/\D/g, '').slice(0, 6).split('');
    
    if (pasteOtp.length === 6) {
      setOtp(pasteOtp);
      // Focus last input
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter complete 6-digit OTP' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    console.log('Submitting OTP:', otpValue, 'for email:', pendingEmail); // Debug

    const result = await verifyOtp(pendingEmail, otpValue);

    console.log('OTP verification result:', result); // Debug

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      // Focus first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    setMessage({ type: '', text: '' });

    console.log('Resending OTP to:', pendingEmail); // Debug

    const result = await resendOtp(pendingEmail);

    console.log('Resend OTP result:', result); // Debug

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setCountdown(60); // Reset countdown
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setResendLoading(false);
  };

  if (!pendingEmail) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.logo}>ChatApp</h1>
            <p className={styles.subtitle}>No pending verification</p>
          </div>
          <div className={styles.footer}>
            <button 
              onClick={() => navigate('/signup')}
              className={styles.submitButton}
            >
              Go to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>ChatApp</h1>
          <p className={styles.subtitle}>Verify your email address</p>
          <p className={styles.emailHint}>
            Enter the 6-digit OTP sent to <strong>{pendingEmail}</strong>
          </p>
        </div>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.otpContainer}>
            <label className={styles.label}>Enter OTP</label>
            <div className={styles.otpInputs}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={styles.otpInput}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? (
              <>
                <span className={styles.loading}></span>
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className={styles.resendSection}>
          <p>Didn't receive the OTP?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || countdown > 0}
            className={styles.resendButton}
          >
            {resendLoading ? (
              <span className={styles.loading}></span>
            ) : countdown > 0 ? (
              `Resend OTP in ${countdown}s`
            ) : (
              'Resend OTP'
            )}
          </button>
        </div>

        <div className={styles.footer}>
          <p>
            Wrong email?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className={styles.linkButton}
            >
              Go back to sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
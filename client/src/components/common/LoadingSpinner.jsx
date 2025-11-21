import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', centered = false }) => {
  return (
    <div className={`${styles.spinnerContainer} ${centered ? styles.centered : ''}`}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
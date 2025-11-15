import React, { useState } from "react";
import "./ProfilePage.css";
import Avatar from "../../components/Avatar/Avatar";
import {useAuth} from "../../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-avatar-box">
        <Avatar src={user?.avatar} name={user?.name} size={80} />
      </div>

      <div className="profile-form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button>Save Changes</button>
      </div>
    </div>
  );
};

export default ProfilePage;

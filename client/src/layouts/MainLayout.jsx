import React from "react";
import "./MainLayout.css";

const MainLayout = ({ sidebar, chat }) => {
  return (
    <div className="main-layout">
      <div className="sidebar-area">
        {sidebar}
      </div>

      <div className="chat-area">
        {chat}
      </div>
    </div>
  );
};

export default MainLayout;

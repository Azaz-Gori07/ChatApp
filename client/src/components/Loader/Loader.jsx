import React from "react";
import "./Loader.css";

const Loader = ({ size = 30, color = "#4a90e2" }) => {
  return (
    <div
      className="loader-spinner"
      style={{
        width: size,
        height: size,
        borderColor: `${color}33`,
        borderTopColor: color,
      }}
    ></div>
  );
};

export default Loader;

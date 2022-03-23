import React from "react";
import "../assets/css/Success.css";
function Success() {
  return (
    <div className="container d-flex justify-content-center align-items-center flex-column customContainer">
      <h1 className="headingSuccess">APPOINTMENT SUCCESSFULLY BOOKED</h1>
      <img
        className="successGif"
        src="https://i.pinimg.com/originals/84/79/05/84790508ebebcb5dd4c6339eced45a8b.gif"
      />
    </div>
  );
}

export default Success;

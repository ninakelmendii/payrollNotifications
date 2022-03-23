import React from "react";
import { Container } from "react-bootstrap";
import AppointmentForm from "../components/AppointmentForm";
import "../assets/css/Home.css";

function Home() {
  return (
    <div>
      <Container className="position-relative">
        <h1 className="heading">BOOK YOUR BARBER</h1>
        <h6 className="p">
          Great Hair Doesn't Happen By Chance.It Happens By Appointment! So Dont
          Wait And Book Your Appointment Now!
        </h6>
        <div>
          <img className="border-5 border-dark p-2 " src={require("../assets/images/image.jpg")} alt="ag" />
        </div>
        <AppointmentForm />
      </Container>
    </div>
  );
}

export default Home;

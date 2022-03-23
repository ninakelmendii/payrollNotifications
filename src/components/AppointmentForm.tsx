import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router";
import "../assets/css/form1.css";
import { Service } from "../types/Service.type";
import { Appointment } from "../types/Appointment.type";
import { Barber } from "../types/Barber.type";
import { BookingInformation } from "../types/BookingInformation.type";
import { Form, Button } from "react-bootstrap";

function AppointmentForm() {
  let navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [validated, setValidated] = useState(false);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedService, setSelectedService] = useState<string>();
  const [selectedBarber, setSelectedBarber] = useState<string>();
  const [bookingInformation, setBookingInformation] =
    useState<BookingInformation>({} as BookingInformation);
  const [bookingTimeFrames, setBookingTimeFrames] = useState<Array<any>>([]);
  const [generatedTimeFrame, setGeneratedTimeFrame] = useState<Array<any>>([]);
  const [letUserReserve, setLetUserReserve] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASEURL}/services`).then((response) => {
      setServices(response.data);
    });
    axios.get(`${process.env.REACT_APP_BASEURL}/barbers`).then((response) => {
      setBarbers(response.data);
    });
    axios
      .get(`${process.env.REACT_APP_BASEURL}/appointments`)
      .then((response) => {
        setAppointments(response.data);
      });
  }, []);
  useEffect(() => {
    let temporaryService = services.find(
      (service) => JSON.stringify(service.id) === selectedService
    );
    setBookingInformation((prevState: any) => ({
      ...prevState,
      price: temporaryService?.price,
    }));
  }, [selectedService]);

  useEffect(() => {
    let temporaryArray: string[] = [];
    let filteredBookings = [];

    if (bookingInformation?.date) {
      filteredBookings = appointments.filter(
        (appointment) =>
          moment(appointment.startDate).format("DD.MM.YYYY") ===
          moment(bookingInformation.date).format("DD.MM.YYYY")
      );
    } else {
      filteredBookings = appointments;
    }

    filteredBookings.forEach((appointment) => {
      let foundedService = services.find(
        (service) => JSON.stringify(service.id) === selectedService
      );
      let startTime = moment(appointment.startDate).format("HH:mm");
      let endTime = moment(appointment.startDate)
        .add(
          foundedService?.durationMinutes
            ? foundedService.durationMinutes
            : "0",
          "minutes"
        )
        .format("HH:mm");
      temporaryArray.push(`${startTime} to ${endTime}`);
    });
    setBookingTimeFrames(temporaryArray as []);
  }, [appointments, bookingInformation?.date, selectedService]);

  useEffect(() => {
    if (bookingInformation?.time) {
      let temporaryService = services.find(
        (service) => JSON.stringify(service.id) === selectedService
      );
      let temporaryTimeFrameStartDate = moment()
        .set("hours", Number(bookingInformation?.time?.split(":")[0]))
        .set("minutes", Number(bookingInformation?.time?.split(":")[1]))
        .format("HH:mm");
      let temporaryTimeFrameEndDate = moment(
        moment()
          .set("hours", Number(bookingInformation?.time?.split(":")[0]))
          .set("minutes", Number(bookingInformation?.time?.split(":")[1]))
      )
        .add(`${temporaryService?.durationMinutes}`, "minutes")
        .format("HH:mm");
      setGeneratedTimeFrame([
        temporaryTimeFrameStartDate,
        temporaryTimeFrameEndDate,
      ]);
    }
  }, [bookingInformation?.time, selectedService]);

  useEffect(() => {
    let conditionFormResponse: boolean[] = [];
    if (bookingTimeFrames.length !== 0) {
      bookingTimeFrames?.forEach((timeFrame) => {
        let timeFrameArr = timeFrame.split(" to ");
        conditionFormResponse = checkBookingConditions(
          timeFrameArr[0],
          timeFrameArr[1],
          generatedTimeFrame[0],
          generatedTimeFrame[1]
        );
      });

      if (conditionFormResponse[0] && conditionFormResponse[1]) {
        setLetUserReserve(true);
      } else {
        setLetUserReserve(false);
      }
    } else {
      setLetUserReserve(true);
    }
  }, [bookingTimeFrames, generatedTimeFrame]);

  function checkBookingConditions(
    appoinmentTimeFrameStartTime: { split: (arg0: string) => String },
    appointmentTimeFrameEndTime: string,
    selectedStartTime: string,
    selectedEndTime: string
  ): boolean[] {
    if (
      appoinmentTimeFrameStartTime &&
      appointmentTimeFrameEndTime &&
      selectedStartTime &&
      selectedEndTime
    ) {
      let tempStartDateSplit = appoinmentTimeFrameStartTime?.split(
        ":"
      ) as String;
      let tempEndDateSplit = appointmentTimeFrameEndTime?.split(":");
      let tempSelectedStartDateSplit = selectedStartTime?.split(":");
      let tempSelectedEndDateSplit = selectedEndTime?.split(":");
      let tempStartDate = moment()
        ?.add(tempStartDateSplit[0], "hours")
        ?.add(tempStartDateSplit[1], "minutes")
        ?.format("DD.MM.YYYY - HH:mm:ss");
      let tempEndDate = moment()
        ?.add(tempEndDateSplit[0], "hours")
        ?.add(tempEndDateSplit[1], "minutes")
        ?.format("DD.MM.YYYY - HH:mm:ss");
      let tempSelectedStartDate = moment()
        ?.add(tempSelectedStartDateSplit[0], "hours")
        ?.add(tempSelectedStartDateSplit[1], "minutes")
        ?.format("DD.MM.YYYY - HH:mm:ss");
      let tempSelectedEndDate = moment()
        ?.add(tempSelectedEndDateSplit[0], "hours")
        ?.add(tempSelectedEndDateSplit[1], "minutes")
        ?.format("DD.MM.YYYY - HH:mm:ss");
      let startDatePassed = moment(tempSelectedStartDate)?.isBetween(
        tempStartDate,
        tempEndDate
      );
      let endDatePassed = moment(tempSelectedEndDate)?.isBetween(
        tempStartDate,
        tempEndDate
      );

      return [!startDatePassed, !endDatePassed];
    } else {
      return [false, false];
    }
  }

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingInformation((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingInformation((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  function findBarber(barber: { id: number }) {
    return JSON.stringify(barber?.id) === selectedBarber;
  }

  const submitBookingInformation = (event: any) => {
    let temporaryBarber = barbers.find(findBarber);
    let givenDate = new Date(bookingInformation?.date as Date);
    let time = bookingInformation?.time?.split(":");
    let day = givenDate.getDay();

    temporaryBarber?.workHours.forEach((hour) => {
      if (day === hour.day) {
        if (
          Number(hour.startHour) <= Number(time && time[0]) &&
          Number(time && time[0]) <= Number(hour.endHour)
        ) {
          reserveBarber(event);
        } else {
          alert("This schedule is out working hours");
        }
      }
    });

    return;
  };

  function reserveBarber(event: any) {
    event.preventDefault();
    let payloadData = {
      serviceId: selectedService,
      barberId: selectedBarber,
      startDate: Math.floor(
        new Date(String(bookingInformation?.date)).getTime() / 1000
      ),
    };
    setValidated(true);

    if (letUserReserve && payloadData) {
      axios.post(`${process.env.REACT_APP_BASEURL}/appointments`, payloadData);
      navigate("/success");
    } else {
      alert("Appointment is already booked! Try with another schedule");
    }
  }

  return (
    <>
      <Form className="form fluid">
        <Form.Label>BOOK YOUR APPOINTMENT</Form.Label>
        <Form.Group className="mb-3 formGroup" controlId="validationCustom03">
          <Form.Control
            type="text"
            placeholder="First Name"
            className="formControl"
            name="firstName"
            required
            value={bookingInformation?.firstName || ""}
            onChange={handleValue}
          />
          <Form.Control.Feedback>Looks Good</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 formGroup">
          <Form.Control
            type="text"
            value={bookingInformation?.lastName || ""}
            placeholder="Last Name"
            className="formControl"
            name="lastName"
            required
            onChange={handleValue}
          />
        </Form.Group>

        <Form.Group className="mb-3 formGroup" controlId="formBasicEmail">
          <Form.Control
            type="email"
            value={bookingInformation?.email || ""}
            placeholder="Email"
            name="email"
            required
            className="formControl"
            onChange={handleValue}
          />
        </Form.Group>

        <Form.Group className="mb-3 formGroup">
          <Form.Control
            type="text"
            name="contactNumber"
            value={bookingInformation?.contactNumber || ""}
            placeholder="Contact Number"
            className="formControl"
            required
            onChange={handleValue}
          />
        </Form.Group>
        <Form.Select
          className="formControl mb-3"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedBarber(e.target.value)
          }
        >
          <option value="">Select Barber</option>
          {barbers.length > 0 &&
            barbers.map((barber, index) => {
              return (
                <>
                  <option value={barber?.id} key={index}>
                    {barber?.firstName} {barber?.lastName}
                  </option>
                </>
              );
            })}
        </Form.Select>
        <Form.Select
          aria-label="Default select example"
          className="formControl mb-3"
          required
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedService(e.target.value)
          }
        >
          <option value="">Select Service</option>
          {services.length > 0 &&
            services.map((service, index) => {
              return (
                <>
                  <option key={index} value={service?.id}>
                    {service?.name}
                  </option>
                </>
              );
            })}
        </Form.Select>
        <Form.Group className="mb-3 formGroup">
          <Form.Control
            type="date"
            placeholder="Select Date"
            className="formControl"
            name="date"
            value={String(bookingInformation?.date) || ""}
            onChange={handleValue}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3 formGroup">
          <Form.Control
            type="time"
            id="timepicker"
            name={"time"}
            onChange={handleSelect}
            placeholder="Select Time"
            className="formControl"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 formGroup">
          <Form.Control
            name={"price"}
            type={"text"}
            value={bookingInformation?.price || ""}
            disabled
            placeholder="Price"
            className="formControl price"
            readOnly={true}
            required
          />
        </Form.Group>
        <Button
          type="submit"
          className="buttonSubmit text-center mb-3"
          onClick={submitBookingInformation}
        >
          <p className="m-0 w-100 text-center formGroup">BOOK APPOINTMENT</p>
        </Button>
      </Form>
    </>
  );
}

export default AppointmentForm;
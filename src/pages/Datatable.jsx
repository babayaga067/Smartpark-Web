import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
import "../styles/Datatable.css";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { getAllSlots } from "../api/slotApi";



const Data = [
  {id: 1,slotNumber: "A1",status: "Available",vehicleType: "Car",bookedBy: "N/A", },

  {id: 2,slotNumber: "A2",status: "Booked",vehicleType: "Bike",bookedBy: "John abhram",},

  {id: 3,slotNumber: "A3",status: "Available",vehicleType: "Car",bookedBy: "N/A", },

  {id: 4,slotNumber: "A4",status: "Booked",vehicleType: "Car",bookedBy: "Jane Doe",},
];


import React from "react";
import GlobalNavbar from "../../Navbars/GlobalNavbar/GlobalNavbar";
import LogoutNavbar from "../../Navbars/LogoutNavbar/LogoutNavbar";
import Drawer from './Drawer/Drawer';
import '../../Appointment/Appointment.css'

const PatientCredentialsDetails = () => {
  return [
    <LogoutNavbar />,
    <div className="myDrawer" style={{margin:"20px"}}><Drawer/></div>
    
    
  ];
};

export default PatientCredentialsDetails;

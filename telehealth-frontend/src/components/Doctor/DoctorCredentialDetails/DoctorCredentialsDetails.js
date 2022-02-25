import React from "react";
import GlobalNavbar from "../../Navbars/GlobalNavbar/GlobalNavbar";
import LogoutNavbar from "../../Navbars/LogoutNavbar/LogoutNavbar";
import '../../Appointment/Appointment.css'
import DoctorDrawer from '../DoctorCredentialDetails/DoctorDrawer/DoctorDrawer';

const DoctorCredentialsDetails = () => {
  return [
    <LogoutNavbar />,
    <div className="myDrawer" style={{margin:"20px"}}><DoctorDrawer/></div>
    
    
  ];
};

export default DoctorCredentialsDetails;
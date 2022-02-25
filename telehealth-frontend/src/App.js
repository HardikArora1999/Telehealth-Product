import React from 'react';
import './App.css';
import GlobalStyle from './globalStyles';
import GlobalNavbar from './components/Navbars/GlobalNavbar/GlobalNavbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './components/Login/Signin';
import Home from './components/pages/HomePage/Home';
import Register from './components/Register/Register';
import DoctorRegister from './components/Register/DoctorRegister';
import Footer from './components/Footer/Footer';
import Blogs from './components/Blogs/Blogs';
import Covid from './components/Covid/Covid';
import PatientDashboard from './components/Patient/PatientDashboard/PatientDashboard';
import DoctorProfile from './components/Doctor/DoctorProfile/DoctorProfile';
import DoctorProfileEdit from './components/Doctor/DoctorProfileEdit/DoctorProfileEdit';
import PatientProfileEdit from './components/Patient/PatientProfileEdit/PatientProfileEdit';
import DoctorDetails from './components/Doctor/DoctorDetails/DoctorDetails';
import ProtectedRoute from './ProtectedRoute';
import PatientProfile from './components/Patient/PatientProfile/PatientProfile';
import BookingDetails from './components/Appointment/BookingDetails/BookingDetails';
import PatientCredentialDetails from './components/Patient/PatientCredentialDetails/PatientCredentialsDetails';
import VideoChat from './components/VideoChat/VideoChat';
import Room from './components/VideoChat/Room';
import { Drawer } from '@material-ui/core';
import DoctorCredentialsDetails from './components/Doctor/DoctorCredentialDetails/DoctorCredentialsDetails';
import AdminPortal from './components/AdminPortal/AdminPortal';

const App = () => {
  return (
    <>
      <Router>
        <GlobalStyle />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/video" exact component={VideoChat} />
          <Route path="/video-chat" exact component={Room} />
          <Route path="/login" exact component={SignIn} />
          <Route path="/register" exact component={Register} />
          <Route path="/doc-register" exact component={DoctorRegister} />
          <ProtectedRoute
            path="/admin-portal"
            exact
            component={AdminPortal}
            superuser={true}
          />
          <Route
            path="/patient/booking-details/:id"
            exact
            component={BookingDetails}
          />
          <ProtectedRoute
            path="/patient/credentials-details"
            exact
            component={PatientCredentialDetails}
            doctor={false}
            superuser={false}
          />

          <Route
            path="/doctor/credentials-details"
            exact
            component={DoctorCredentialsDetails}
          />

          <ProtectedRoute
            path="/patient-profile"
            exact
            component={PatientProfile}
            doctor={false}
            superuser={false}
          />
          <ProtectedRoute
            path="/doctor-profile"
            exact
            component={DoctorProfile}
            doctor={true}
            superuser={false}
          />
          <Route path="/doctor-details/:id" exact component={DoctorDetails} />
          <Route
            path="/patient-dashboard"
            exact
            component={PatientDashboard}
            // doctor={false}
          />
          <Route path="/blogs" exact component={Blogs} />
          <Route path="/covid" exact component={Covid} />
          <ProtectedRoute
            path="/edit/doctor-profile"
            exact
            component={DoctorProfileEdit}
            doctor={true}
            superuser={false}
          />
          <ProtectedRoute
            path="/edit/patient-profile"
            exact
            component={PatientProfileEdit}
            doctor={false}
            superuser={false}
          />
        </Switch>
        <Footer />
      </Router>
    </>
  );
};

export default App;

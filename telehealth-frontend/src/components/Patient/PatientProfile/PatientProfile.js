import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';
import '../../Doctor/DoctorProfile/DoctorProfile.css';
import doc1 from '../../../assets/doc1.jpg';
import LogoutNavbar from '../../Navbars/LogoutNavbar/LogoutNavbar';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import constants from '../../../constants';
import axios from 'axios';
import PatientNavbar from '../../Navbars/PatientNavbar/PatientNavbar';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function PatientProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const history = useHistory();
  const handleClick = () => history.push('/edit/patient-profile');

  const classes = useStyles();

  useEffect(() => {
    axios
      .get(`${constants.API_URL}/patient-profile`)
      .then((res) => {
        const data = res.data;
        const user = data.user;
        const profile = data.profile;
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);
        setDob(profile.dob);
        setDescription(profile.description);
        setImageUrl(profile.image);
        // console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return [
    <LogoutNavbar />,
    <PatientNavbar />,
    <div class="container">
      <div className="DoctorProfileContainer">
        <div className="DoctorName">
          <p class="title">
            <strong>PERSONAL INFORMATION </strong>
          </p>
          <p class="initials">First Name : {firstName}</p>
          <p class="initials">Last Name : {lastName}</p>
          <p class="initials">Email Address : {email}</p>
          <p class="initials">Date Of Birth : {dob}</p>
        </div>
        <div className="professionalInformation">
          <p class="title">
            <strong>MEDICAL INFORMATION </strong>
          </p>
          <p class="initials">Description : {description}</p>
        </div>
      </div>
      <div class="card-container">
        <div class="card">
          <img src={imageUrl} class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title"> {firstName}</h5>
            <Button class="btn btn-primary" onClick={handleClick}>
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </div>,
  ];
}

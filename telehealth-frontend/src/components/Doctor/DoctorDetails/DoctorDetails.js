import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';
import '../DoctorProfile/DoctorProfile.css';
import doc1 from '../../../assets/doc1.jpg';
import LogoutNavbar from '../../Navbars/LogoutNavbar/LogoutNavbar';
import { useState } from 'react';
import Appointment from '../../Appointment/Appointment.js';
import PatientNavbar from '../../Navbars/PatientNavbar/PatientNavbar.js';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import constants from '../../../constants';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Auxilary from '../../../hoc/Auxilary';
import Loader from '../../Loader/Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function DoctorDetails() {
  const [showTimeSlot, setTimeSlot] = useState(false);
  const [doctorData, setDoctorData] = useState('');
  const [slotsData, setSlotsData] = useState('');
  const [slotFlag, setSlotFlag] = useState(true);
  const [loading, setLoading] = useState(false);
  const [slotsMap, setSlotsMap] = useState(new Map());
  const [myDates, setMyDates] = useState([]);
  const addSwipeTabData = () => {};

  const datesHandler = () => {
    let week = [1, 2, 3, 4, 5, 6];
    let dateObj = [];
    let slotMap = new Map();
    let currentDate = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
    for (var i = 0; i < 7; i++) {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + i);
      var month = tomorrow.getMonth() + 1; //months from 1-12
      var day = tomorrow.getDate();
      var year = tomorrow.getFullYear(); // let nextDate=myDate.getUTCDate()+i;
      var nextDate =
        year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
      slotMap.set(nextDate, new Set());
      //  let todayDate= nextDate.toISOString().slice(0, 10);
      dateObj.push(nextDate);
      // console.log(dateObj)
    }
    // console.log(slotMap);
    setSlotsMap(slotMap);
    // console.log(dateObj);
    setMyDates(dateObj);
    // return dateObj;
  };

  const handleClick = async () => {
    // setLoading(true);
    //     await axios
    //       .get(
    //         `${constants.API_URL}/doctor-slots?doctor_id=${doctorData.doctor_details.id}`
    //       )
    //       .then((res) => {
    //         console.log(res.data);
    //         console.log(slotsMap);
    //         // (res.data);
    //         //adad
    //         setSlotFlag(false);
    //       })
    //       .catch((e) => {
    //       })
    //     setLoading(false);
    if (showTimeSlot === true) {
      setTimeSlot(false);
    } else {
      setTimeSlot(true);
      if (slotFlag) {
        setLoading(true);
        await axios
          .get(
            `${constants.API_URL}/doctor-slots?doctor_id=${doctorData.doctor_details.id}`
          )
          .then((res) => {
            const data = res.data;
            const da = [];
            const slotMap = slotsMap;
            data.forEach((slot) => {
              // console.log(slot);
              slotMap.get(slot.date).add(slot.start_time);
            });
            // console.log(slotMap);
            // console.log(slotsMap);
            setSlotsMap(slotMap);
            // (res.data);
            //adad
            setSlotFlag(false);
          })
          .catch((e) => {});
        setLoading(false);
      }
    }
  };

  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      await axios
        .get(`${constants.API_URL}/get-doctor?doctor_id=${id}`)
        .then((res) => {
          setDoctorData(res.data.result);
        })
        .catch((e) => {
          // console.log('sfsfsf');
        });
      setLoading(false);
    };

    datesHandler();

    if (location.doctorData) {
      setDoctorData(location.doctorData);
    } else {
      fetchDoctor();
    }
  }, [location]);

  const classes = useStyles();

  return (
    <Auxilary>
      <Loader loading={loading} />
      {doctorData ? <Auxilary>
      <LogoutNavbar />
      <PatientNavbar />
      <div class="container">
        <div className="DoctorProfileContainer">
          <div className="DoctorName">
            <h4
              className="title"
              style={{ fontSize: '1.2rem', marginLeft: '5%' }}
            >
              <strong>
                Dr. {doctorData.first_name} {doctorData.last_name}
              </strong>
            </h4>
            <span />
            <p class="initials" id="claimed" >
              <u style={{color:'green'}}>Profile Is Claimed</u>
            </p>
            <p class="initials" >
             Degree: {doctorData ? doctorData.doctor_details.degree : null}
            </p>

            <p class="initials" >
            Specialization: {doctorData.specialization}</p>
            <p class="initials">
            Experience: 
               {doctorData
                ? doctorData.doctor_details.years_of_experience
                : null}{' '}
              Years Experience Overall
            </p>
            <p class="initials">
              <i class="fas fa-check-circle" id="tick"></i> Medical Registration
              Verified
            </p>

                <p class="initials">
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    {/* <Typography component="legend">Read only</Typography> */}
                    <Rating
                      name="read-only"
                      value={doctorData.ratings}
                      readOnly
                    />
                  </Box>
                </p>
                <p class="initials">
                  {doctorData ? doctorData.doctor_details.description : null}
                </p>
              </div>
            </div>
            <div class="card-container">
              <div class="card">
                <img
                  src={doctorData ? doctorData.doctor_details.image : null}
                  class="card-img-top"
                  alt="..."
                />
                <div class="card-body">
                  <h5 class="card-title">
                    {' '}
                    Dr. {doctorData.first_name} {doctorData.last_name}
                  </h5>
                  <Button class="btn btn-primary" onClick={handleClick}>
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            {showTimeSlot && !loading ? (
              <Appointment
                slotsMap={slotsMap}
                doctorData={doctorData}
                DocDates={myDates}
              />
            ) : null}
          </div>
        </Auxilary>
      : null})
    </Auxilary>
  );
}

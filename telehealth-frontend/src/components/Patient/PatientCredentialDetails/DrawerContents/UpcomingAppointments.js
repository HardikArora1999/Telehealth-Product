import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import '../DrawerContents/MedicalRecords/MedicalRecords.css';
import axios from 'axios';
import constants from '../../../../constants';
import { useHistory } from 'react-router-dom';
import Auxilary from '../../../../hoc/Auxilary';
import Loader from '../../../Loader/Loader';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    const fetchFutureAppointments = async () => {
      setLoading(true);
      await axios
        .get(`${constants.API_URL}/patient-upcoming-appointments`)
        .then((res) => {
          console.log(res.data.result);
          setAppointments(res.data.result);
        })
        .catch((e) => {
          setLoading(false);
        })
        setLoading(false);
    };

    fetchFutureAppointments();
  }, []);

  const handleJoinRoom = async (appointmentId) => {
    const data = {
      appointment_id: appointmentId,
    };

    await axios
      .post(`${constants.API_URL}/video/token`, data)
      .then((res) => {
        console.log(res.data);
        history.push({
          pathname: `/video-chat`,
          token: res.data.token,
          roomName: res.data.room_name,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Auxilary>
      <Loader loading={loading}></Loader>
      <div class="medical-records">
        <div class="medical-records-list">
          <div class="container mt-1">
            <div class="row">
              <div class="col-md-12">
                <div class="d-flex justify-content-between align-items-center activity">
                  Upcoming Appointment Records
                </div>
                <hr />
                <div class="mt-1">
                  <ul class="list list-inline">
                    {appointments.map((appointment) => {
                      return (
                        <li
                          class="d-flex justify-content-between hoverlist"
                          style={{
                            width: '50rem',
                            //   cursor: "pointer",
                            //   boxShadow:
                            //     "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 5px 20px 0 rgba(0, 0, 0, 0.19)",
                          }}
                        >
                          <div
                            class="d-flex flex-row align-items-center"
                            style={{
                              justifyContent: 'space-between',
                              width: '25%',
                            }}
                          >
                            <i
                              class="fas fa-calendar-alt"
                              style={{ marginLeft: '6%', color: 'green' }}
                            ></i>
                            <div class="ml-2">
                              <h6 class="mb-0">
                                Dr. {appointment.doctor_details.first_name}{' '}
                                {appointment.doctor_details.last_name}
                              </h6>
                              <div class="d-flex flex-row mt-1 text-black-50 date-time">
                                <div>
                                  <i class="fa fa-calendar-o"></i>
                                  <span class="ml-2">
                                    {appointment.date} {appointment.start_time}
                                    {/* {appointment.start_time < 12 ? 'am' : 'pm'} */}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="d-flex flex-row align-items-center">
                            <div class="d-flex flex-column">
                              <span
                                class="report-span"
                                style={{ marginLeft: '-70%', color: 'gray' }}
                              >
                                {appointment.doctor_details.specialization}
                              </span>
                            </div>{' '}
                            <button
                              type="button"
                              class="btn btn-warning"
                              onClick={() => handleJoinRoom(appointment.id)}
                            >
                              Join
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Auxilary>
  );
};

export default UpcomingAppointments;

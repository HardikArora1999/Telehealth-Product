import React, { useEffect, useState } from 'react';
import MedicalRecords from '../../../Patient/PatientCredentialDetails/DrawerContents/MedicalRecords/MedicalRecords.css';
import axios from 'axios';
import constants from '../../../../constants';
import Auxilary from '../../../../hoc/Auxilary';
import Loader from '../../../Loader/Loader';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPastAppointments = async () => {
      setLoading(true);
      await axios
        .get(`${constants.API_URL}/doctor-appointments`)
        .then((res) => {
          console.log(res.data.result);
          setAppointments(res.data.result);
        })
        .catch((e) => {
          setLoading(false);
        });
      setLoading(false);
    };

    fetchPastAppointments();
  }, []);
  return (
    <Auxilary>
      <Loader loading={loading}></Loader>
      <div class="medical-records">
        <div class="medical-records-list">
          <div class="container mt-1">
            <div class="row">
              <div class="col-md-12">
                <div class="d-flex justify-content-between align-items-center activity">
                  Appointment Records
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
                                {appointment.patient_details.first_name}{' '}
                                {appointment.patient_details.last_name}
                              </h6>
                              <div class="d-flex flex-row mt-1 text-black-50 date-time">
                                <div>
                                  <i class="fa fa-calendar-o"></i>
                                  <span class="ml-2">
                                    {appointment.date} {appointment.start_time}
                                    :00{' '}
                                    {appointment.start_time < 12 ? 'am' : 'pm'}
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
                                {/* {appointment.patient_details.specialization} */}
                              </span>
                            </div>{' '}
                            {/* <i class="fa fa-ellipsis-h"></i> */}
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

export default Appointments;

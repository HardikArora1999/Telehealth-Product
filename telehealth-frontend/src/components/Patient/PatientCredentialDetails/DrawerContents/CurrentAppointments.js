import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import '../DrawerContents/MedicalRecords/MedicalRecords.css';
import axios from 'axios';
import constants from '../../../../constants';
import Auxilary from '../../../../hoc/Auxilary';
import Loader from '../../../Loader/Loader';
import FeedbackIcon from '@material-ui/icons/Feedback';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useParams } from 'react-router';
import Alert from '@material-ui/lab/Alert';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CurrentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchPastAppointments = async () => {
      setLoading(true);
      await axios
        .get(`${constants.API_URL}/patient-appointments`)
        .then((res) => {
          console.log(res.data.result);
          // setDoctorId(res.data.result.doctor_details.doctor_id);
          setAppointments(res.data.result);
        })
        .catch((e) => {
          setLoading(false);
        });
      setLoading(false);
    };

    fetchPastAppointments();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (doctorId) => {
    const review = { review: feedback };
    // e.preventDefault();
    // console.log(doctor_id)
    console.log(feedback);
    // const formData = new FormData();
    // formData.append('feedback', feedback);
    // const config = { headers: { 'content-type': 'multipart/form-data' } };
    // console.log(formData);

    axios
      .post(`${constants.API_URL}/feedback/${doctorId}`, review)
      .then((res) => {
        console.log(res.data);
        window.alert('Feedback submitted successfully');
      })

      .catch((e) => {
        console.log(e);
        window.alert('Feedback already exists');
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
                                {appointment.doctor_details.first_name}{' '}
                                {appointment.doctor_details.last_name}
                              </h6>
                              <div class="d-flex flex-row mt-1 text-black-50 date-time">
                                <div>
                                  <i class="fa fa-calendar-o"></i>
                                  <span class="ml-2">
                                    {appointment.date} {appointment.start_time}
                                    {/* {' '} */}
                                    {/* {appointment.start_time < 12 ? 'am' : 'pm'} */}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="d-flex flex-row align-items-center">
                            <div class="d-flex flex-column">
                              <Tooltip title="Send Feedback">
                                <label htmlFor="icon-button-file">
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={handleOpen}
                                  >
                                    <FeedbackIcon></FeedbackIcon>
                                    <Modal
                                      // aria-labelledby="transition-modal-title"
                                      // aria-describedby="transition-modal-description"
                                      className={classes.modal}
                                      open={open}
                                      onClose={handleClose}
                                      closeAfterTransition
                                      BackdropComponent={Backdrop}
                                      BackdropProps={{
                                        timeout: 500,
                                      }}
                                    >
                                      <div className="form-group">
                                        <form onSubmit={handleSubmit}>
                                          <textarea
                                            className="form-control"
                                            row="8"
                                            placeholder="Write Feedback"
                                            value={feedback}
                                            onChange={(e) =>
                                              setFeedback(e.target.value)
                                            }
                                          ></textarea>
                                        </form>
                                        <br />
                                        <div className="form-group">
                                          <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                              handleSubmit(
                                                appointment.doctor_details
                                                  .doctor_id
                                              )
                                            }
                                            size="small"
                                          >
                                            Send Feedback
                                          </Button>
                                        </div>
                                      </div>
                                    </Modal>
                                  </IconButton>
                                </label>
                              </Tooltip>
                              {/* <span
                                class="report-span"
                                style={{ marginLeft: '-70%', color: 'gray' }}
                              >
                                {appointment.doctor_details.specialization}
                              </span> */}
                            </div>{' '}
                            {/* <i class="fa fa-ellipsis-h"></i> */}
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
export default CurrentAppointments;

// import React from 'react'
// import notes from '../../../../assets/notes.png';
// const Feedbacks = () => {
//     return (
//         <div>
//             <div class="feedback-img">
//                 <img src={notes} style={{width:"13%",marginLeft:"36%"}}></img>
//             </div>
//             <div class="feedback-title" style={{marginLeft:"30%",color:"gray",marginTop:"2%",fontSize:"1rem"}}>
//                 You haven't submitted any feedback's yet.
//             </div>
//         </div>
//     )
// }

// export default Feedbacks
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
}));

const CurrentFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      await axios
        .get(`${constants.API_URL}/feedback`)
        .then((res) => {
          console.log(res.data.response);
          setFeedbacks(res.data.response);
        })
        .catch((e) => {
          setLoading(false);
        })
        setLoading(false);
    };

    fetchFeedbacks();
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
                  Feedbacks Given
                </div>
                <hr />
                <div class="mt-1">
                  <ul class="list list-inline">
                    {feedbacks.map((feedback) => {
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
                              {feedback.doctor}
                              </h6>
                              <div class="d-flex flex-row mt-1 text-black-50 date-time">
                                <div>
                                  <i class="fa fa-calendar-o"></i>
                                  <span class="ml-2">
                                    {feedback.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="d-flex flex-row align-items-center">
                            <div class="d-flex flex-column">
                              <span
                                class="report-span"
                                style={{ marginLeft: "-70%", color: 'black', alignContent: "flex-start", alignItems: "self-start"}}
                              >
                                Feedback: {feedback.review}
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

export default CurrentFeedback;

import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import Grid from '@material-ui/core/Grid';
import { useLocation, useHistory } from 'react-router-dom';
// import './Room.css';
import Auxilary from '../../hoc/Auxilary';
import LogoutNavbar from '../Navbars/LogoutNavbar/LogoutNavbar'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from "../../globalStyles";
import { Container } from "@material-ui/core";
import jsPDF from'jspdf';
import html2canvas from "html2canvas";

const Room = () => {
  const [token,setToken] = useState('')
  const [roomName,setRoomName] = useState(null)
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    setToken(location.token)
    setRoomName(location.roomName)
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function(
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const handleCallDisconnect = () => {
    room.disconnect();
    history.goBack();
  };

  const handleAudioToggle = () => {
    room.localParticipant.audioTracks.forEach(track => {
      if (track.track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
      setToggleAudio(track.track.isEnabled);
    });
  };

  const handleVideoToggle = () => {
    room.localParticipant.videoTracks.forEach(track => {
      if (track.track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
      setToggleVideo(track.track.isEnabled);
    });
  };

  const remoteParticipants = participants.map(participant => (
    <Participant
      key={participant.sid}
      participant={participant}
      isLocal={false}
    />
  ));

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 800,
      backgroundColor: theme.palette.background.paper,
      // border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2,4),
    },
    card: {
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    }
  }));

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const printDocument = (event) => {
    event.preventDefault();
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0, 200, 75);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      })
  };

  return (
    <Auxilary>
      <LogoutNavbar/>
    <div className="room" style={{marginTop: '2%'}}>
      {/* <h2>Room: {roomName}</h2> */}
      {/* <button>Leave Room</button> */}
      <Grid container component="main">
        <Grid item xs={12} sm={3} md={3} style={{margin:"1%"}}>
          <div className="local-participant" style={{position:"inherit", alignContent: "flex-start", alignSelf: "start"}}>
            {room ? (
              <Participant
                key={room.localParticipant.sid}
                participant={room.localParticipant}
                handleAudioToggle={handleAudioToggle}
                handleVideoToggle={handleVideoToggle}
                handleCallDisconnect={handleCallDisconnect}
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                isLocal={true}
              />
            ) : (
              ""
            )}
          </div>
        </Grid>
        <Grid item xs={12} sm={5} md={5} style={{margin:"1%"}}>
          {/* <h3>Remote Participants</h3> */}
          <div className="remote-participants">{remoteParticipants}</div>
        </Grid>
        <Grid item xs={12} sm md style={{margin:"1%"}}>
          <Button type="button" onClick={handleOpen}>
            Write Prescription
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="Prescription"
            aria-describedby="simple-modal-description"
          >
            <form style={modalStyle} className={classes.paper} onSubmit={printDocument}>
              <h2 id="Prescription">Prescription</h2>
              <div className={`Container`}>
                <div className="row">
                  <div className={`col-sm  ${classes.card}`}>
                    <div className="row gy-2" id="divToPrint" >
                      <div className="col-sm">
                        <label>Doctor Name</label>
                        <input
                          type="text"
                          // readonly
                          className="form-control"
                          placeholder="Doctor Name"
                          // disabled
                        />
                      </div>
                      <div className="col-sm">
                        <label>Patient Name</label>
                        <input
                          type="text"
                          // readonly
                          className="form-control"
                          placeholder="Patient Name"
                          // disabled
                        />
                      </div>
                      <div className="col-sm">
                        <div className="form-group">
                          <label>Name of Disease</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Name of Disease"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label for="exampleFormControlTextarea1">Prescription</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Prescription"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-sm mt-3 mb-3">
                      <div className="form-group">
                        <Button type="submit" variant="contained" color="primary">
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        </Grid>
      </Grid>
    </div>
    </Auxilary>
  );
};

export default Room;

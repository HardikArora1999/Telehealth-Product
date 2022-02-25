import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import Grid from '@material-ui/core/Grid';

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);

  useEffect(() => {
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

  return (
    <div className="room" style={{marginTop: '2%'}}>
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Leave Room</button>
      <Grid container component="main">
        <Grid item xs={12} sm={4} md={3} style={{margin:"1%"}}>
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
        <Grid item xs={12} sm={4} md={5} style={{margin:"1%"}}>
          {/* <h3>Remote Participants</h3> */}
          <div className="remote-participants">{remoteParticipants}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Room;

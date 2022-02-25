import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useHistory} from 'react-router-dom';

export default function AlertDialog(props) {
  //const [open, setOpen] = React.useState(false);
  const [open, setOpen] = React.useState(props.isOpen);
  const history = useHistory();
  const handleClick = () =>{
      history.push('/patient/credentials-details');
  }

  
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     console.log(open)
//   };

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={setOpen}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            <i class="fas fa-check-circle" style={{color:"green",fontSize:"1.5rem",padding:"1%"}}></i> {"Payment Successful"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your transcation is successful and your appointment is booked.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary" onClick={handleClick}>
            Go To Dashboard
          </Button>
          {/* <Button onClick={props.onClose} color="primary" autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

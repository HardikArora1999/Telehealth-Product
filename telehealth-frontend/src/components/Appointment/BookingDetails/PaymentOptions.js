import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Modal from '../../Appointment/Modal/Modal';
import axios from 'axios';
import constants from '../../../constants';
import { useHistory } from 'react-router-dom';
import Loader from '../../Loader/Loader';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
}));

const PaymentOptions = ({
  doctor_id,
  start_time,
  end_time,
  date,
  destination,
}) => {
  const classes = useStyles();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const isUserLoggedIn = async (appointmentDetails) => {
    setLoading(true);
    await axios
      .get(`${constants.API_URL}/user`)
      .then(async (res) => {
        await axios
          .post(`${constants.API_URL}/book-appointment`, appointmentDetails)
          .then((res) => {
            console.log(res);
            setModalState(true);
          })
          .catch((e) => {
            console.log(e);
          });
        setLoading(false)
      })
      .catch((e) => {
        console.log('logged off');
        history.replace({
          pathname: '/login',
          destination: destination,
        });
      });
      setLoading(false)
  };
  const openModal = async () => {
    const appointmentDetails = {
      doctor_id,
      start_time,
      date: date,
    };
    console.log(appointmentDetails);
    isUserLoggedIn(appointmentDetails);
  };
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(null);

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleClose = () => {
    setModalState(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === 'net') {
      setHelperText('You got it!');
      setError(false);
    } else if (value === 'upi') {
      setHelperText('You got it!');
      setError(false);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <form onSubmit={handleSubmit}>
        <FormControl
          component="fieldset"
          error={error}
          className={classes.formControl}
        >
          <RadioGroup
            aria-label="payment"
            name="payment"
            value={value}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="net"
              control={<Radio />}
              label="Net Banking"
            />
            <FormControlLabel value="upi" control={<Radio />} label="UPI" />
          </RadioGroup>
          <FormHelperText>{helperText}</FormHelperText>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={openModal}
          >
            Confirm
          </Button>
          
        </FormControl>
      </form>
      {modalState ? <Modal isOpen={true} onClose={handleClose} /> : null}
    </>
  );
};

export default PaymentOptions;

import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router-dom';
import constants from '../../constants';
import axios from 'axios';
import Auxilary from '../../hoc/Auxilary';
import Loader from '../Loader/Loader';
import Select from 'react-select';

export default function DoctorModal(props) {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [consultationFees, setConsultationFees] = useState('');
  const [dob, setDob] = useState('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState({ preview: '', raw: '' });
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(props.isOpen);

  const data = [
    {
      value: 'General Physician',
      label: 'General Physician',
    },
    {
      value: 'Surgeon',
      label: 'Surgeon',
    },
    {
      value: 'Gynaecologist',
      label: 'Gynaecologist',
    },
    {
      value: 'Orthopaedics',
      label: 'Orthopaedics',
    },
    {
      value: 'Dermatologist',
      label: 'Dermatologist',
    },
    {
      value: 'Cardiologist',
      label: 'Cardiologist',
    },
  ];

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    console.log(e);
    setSelectedOption(e);
  };

  const history = useHistory();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const login = async () => {
      const userData = {
        email: props.email,
        password: props.password,
      };
      setLoading(true);
      await axios
        .post(`${constants.API_URL}/login`, userData)
        .then((res) => {
          const data = res.data;
          setPhoneNumber(data.phone_number);
          setEmail(data.email);
        })
        .catch((e) => {
          console.log(e.response.data.detail);
        });
      setLoading(false);
    };
    login();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image.raw);
    formData.append('degree', degree);
    formData.append('specialization', selectedOption.value);
    formData.append('years_of_experience', yearsOfExperience);
    formData.append('dob', dob);
    formData.append('description', description);
    formData.append('phone_number', phoneNumber);
    formData.append('licence_number', registrationNumber);
    formData.append('fee', consultationFees);
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    console.log(formData);
    props.onClose();
    setLoading(true);
    await axios
      .post(`${constants.API_URL}/edit-doctor-profile`, formData, config)
      .then((res) => {
        console.log(res.data);
        axios
          .post(`${constants.API_URL}/logout`)
          .then((res) => {
            console.log(res);
            console.log(res.data);
            history.push('/login');
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImage = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  return (
    <Auxilary>
      <Loader loading={loading} />
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={setOpen}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          <i
            class="far fa-edit"
            style={{ color: 'green', fontSize: '1.5rem', padding: '1%' }}
          ></i>{' '}
          {'Create Profile'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div className={``}>
              <div className="row">
                {/* <div className="col-sm-4">
                        <img
                          src={imageUrl}
                          className={`card-img-top`}
                          alt="..."
                        />
                      </div> */}
                <div className={`col-sm-12 pt-2`}>
                  <div className="row gy-2">
                    <div className="col-sm">
                      <label>Registration Number</label>
                      <input
                        type="text"
                        readonly
                        className="form-control"
                        placeholder="Registration Number"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                      />
                    </div>
                    {/* <div className="col-sm">
                      <label>Last Name</label>
                      <input
                        type="text"
                        readonly
                        className="form-control"
                        // value={lastName}
                        disabled
                      />
                    </div> */}
                    <div className="col-sm">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row gy-2 mt-1">
                    <div className="col-sm">
                      <div className="form-group">
                        <label>Dob</label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group">
                        <label>Contact</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contact"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm">
                      <label>Specialization</label>
                      <Select
                        placeholder="Specialization"
                        value={selectedOption}
                        options={data}
                        onChange={handleChange}
                        name="Specialization"
                        label="Specialization"
                        type="String"
                        id="Specialization"
                        margin="normal"
                      />
                    </div>
                  </div>

                  <div className="row gy-2 mt-1">
                    <div className="col-sm">
                      <div className="form-group">
                        <label>Degree</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Degree"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group">
                        <label>Years of Experience</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Years of Experience"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group">
                        <label>Consultation Fees</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Consultation Fees"
                          value={consultationFees}
                          onChange={(e) => setConsultationFees(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row gy-2 mt-1">
                    <div className="col-sm">
                      <div className="form-group">
                        <label>Choose Image</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleImage}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row gy-2 mt-1">
                    <div className="col-sm">
                      <div className="form-group">
                        <label for="exampleFormControlTextarea1">About</label>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          rows="3"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          // style="resize: none;"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm mt-3 mb-3">
                    <div className="form-group">
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={props.onClose} color="primary" onClick={handleClick}>
            Go To Dashboard
          </Button>
        </DialogActions> */}
      </Dialog>
    </Auxilary>
  );
}

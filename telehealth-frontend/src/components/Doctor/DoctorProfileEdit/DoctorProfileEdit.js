import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { AccountCircle } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import LogoutNavbar from '../../Navbars/LogoutNavbar/LogoutNavbar';
import { ThemeConsumer } from 'styled-components';
import constants from '../../../constants';
import axios from 'axios';
import { useHistory } from 'react-router';
import { blue } from '@material-ui/core/colors';
import Auxilary from '../../../hoc/Auxilary';
import Loader from '../../Loader/Loader';

export default function DoctorProfileEdit() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [consultationFees, setConsultationFees] = useState('');
  const [dob, setDob] = useState('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://library.kissclipart.com/20181001/wbw/kissclipart-gsmnet-ro-clipart-computer-icons-user-avatar-4898c5072537d6e2.png');
  const [image, setImage] = useState({ preview: '', raw: '' });
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading,setLoading] = useState(true);
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
  const useStyles = makeStyles((theme) => ({
    card: {
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    }
  }));
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`${constants.API_URL}/doctor-profile`)
      .then((res) => {
        const data = res.data;
        const user = data.user;
        const profile = data.profile;
        const specializationName = data.specialization.name;
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setPhoneNumber(user.phone_number);
        setEmail(user.email);
        setDob(profile.dob);
        setDegree(profile.degree);
        setSpecialization(specializationName);
        setDescription(profile.description);
        setImageUrl(profile.image);
        setYearsOfExperience(profile.years_of_experience);
        setSelectedOption({value: specializationName, label: specializationName})
        console.log(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
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
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    console.log(formData);
    axios
      .post(`${constants.API_URL}/edit-profile-doctor`, formData, config)
      .then((res) => {
        console.log(res.data);
        history.push('/doctor-profile');
      })
      .catch((e) => {
        console.log(e);
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

  const classes = useStyles();
  return (
  <Auxilary>
    <Loader loading={loading}/>
    <LogoutNavbar />
    <div className="container">
        <i class="far fa-edit"> Edit Profile</i>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`container`}>
          <div className="row">
            <div className="col-sm-4">
              <img src={imageUrl} className={`card-img-top ${classes.card}`} alt="..." />
            </div>
            <div className={`col-sm-8 pt-2 ${classes.card}`}>
              <div className="row gy-2">
                <div className="col-sm">
                  <label>First Name</label>
                  <input
                    type="text"
                    readonly
                    className="form-control"
                    value={firstName}
                    disabled
                  />
                </div>
                <div className="col-sm">
                  <label>Last Name</label>
                  <input
                    type="text"
                    readonly
                    className="form-control"
                    value={lastName}
                    disabled
                  />
                </div>
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
  </Auxilary>
  )
}

import React, { useState, useEffect } from 'react';
import '../AdminPortal/AdminPortal.css';
import Auxilary from '../../hoc/Auxilary';
import LogoutNavbar from '../Navbars/LogoutNavbar/LogoutNavbar';
import PatientNavbar from '../Navbars/PatientNavbar/PatientNavbar';
import doc1 from '../../assets/doc1.jpg';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Loader from '../Loader/Loader';
import axios from 'axios';
import constants from '../../constants';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const AdminPortal = () => {
  const classes = useStyles();
  const docList = [
    {
      medicalRegistrationNumber: 'ab122338464',
      medicalLicenseNumber: '182635463',
      dateOfBirth: '12/08/1995',
      email: 'john@gmail.com',
      degree: 'MBBS',
      practisingExperience: '11 years',
    },
    {
      medicalRegistrationNumber: 'ab122338464',
      medicalLicenseNumber: '182635463',
      dateOfBirth: '12/08/1995',
      email: 'john@gmail.com',
      degree: 'MBBS',
      practisingExperience: '11 years',
    },
    {
      medicalRegistrationNumber: 'ab122338464',
      medicalLicenseNumber: '182635463',
      dateOfBirth: '12/08/1995',
      email: 'john@gmail.com',
      degree: 'MBBS',
      practisingExperience: '12 years',
    },
  ];
  const [doctorList, setDoctorList] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };
  // React.useEffect(() => {
  //   const results = docList.filter(person =>
  //     docList.toLowerCase().includes(searchTerm)
  //   );
  //   setSearchResults(results);
  // }, [searchTerm]);
  
  
  const [searchDoc, setSearchDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchAllDoctors = async () => {
      setLoading(true);
      await axios.get(`${constants.API_URL}/doctors-status`).then((res) => {
        console.log(res.data);
        setDoctorList(res.data.results);
      });
      setLoading(false);
    };

    fetchAllDoctors();
  }, []);

  const handleDoctorStatus = async (doctorId,idx) => {
    const id = {
      doctor_id: doctorId,
    };
    setLoading(true);
    await axios
      .post(`${constants.API_URL}/doctor-licence-verification`, id)
      .then((res) => {
          console.log("Doctor Status Changes...");
      });
    setLoading(false);

    const doc = doctorList[idx];
    doc.doctor_details.licence_details.is_verified = !doc.doctor_details.licence_details.is_verified;
    const docList = [...doctorList];
    docList[idx] = doc;
    setDoctorList(docList);
  };

  return (
    <Auxilary>
      <Loader loading={loading} />
      <LogoutNavbar />
      <>
        <div>
          <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
              
              <ul>
                {searchResults.map(item => (
                <li>{item}</li>
              ))}
          </ul>
            </div>
          </nav>
        </div>
        <nav class="accordion arrows">
          <header class="box">
            <label for="acc-close" class="box-title">
              VERIFIED DOCTOR'S LIST
            </label>
          </header>
          {doctorList.map((docDetail, i) => (
            <Auxilary>
              <input type="radio" name="accordion" id={i} />
              <section class="box" key={i}>
            
                <label class="box-title" for={i}>
                  <div class="grid">
                  <div class="doc-img">
                    <Avatar
                      alt="Remy Sharp"
                      src={docDetail.doctor_details.image}
                    />
                  </div>
                  <div class="doc-name">
                    {' '}
                    Dr. {docDetail.first_name} {docDetail.last_name}
                  </div>
                  <div class="specialization">{docDetail.specialization}</div>
                  </div>
                </label>
                <label class="box-close" for="acc-close"></label>
                <div class="box-content">
                  <div class="doc-verfication-details">
                    <div class="dob">Email - {docDetail.email}</div>
                    <div class="medical-number">
                      Registration no. -{' '}
                      {docDetail.doctor_details.licence_details.licence_number}
                    </div>
                    <div class="dob">Dob - {docDetail.doctor_details.dob}</div>
                    <div class="dob">
                      Degree - {docDetail.doctor_details.degree}
                    </div>
                    {/* <div class="deg">{docDetail.medicalLicenseNumber}</div> */}
                    <div class="dob">
                      Experience -{' '}
                      {docDetail.doctor_details.years_of_experience} years
                    </div>
                  </div>
                  <div class="verified-icon">
                    <Button
                      variant="contained"
                      size="small"
                      className={classes.button}
                      startIcon={<SaveIcon />}
                      style={{
                        backgroundColor: `${
                          docDetail.doctor_details.licence_details.is_verified
                            ? '#008000b3'
                            : '#9c1635'
                        }`,
                        color: 'white',
                      }}
                      onClick={() =>
                        handleDoctorStatus(docDetail.doctor_details.id,i)
                      }
                    >
                      {docDetail.doctor_details.licence_details.is_verified
                        ? 'Unverify'
                        : 'Verify'}
                    </Button>
                  </div>
                </div>
              </section>
            </Auxilary>
          ))}

          <input type="radio" name="accordion" id="acc-close" />
        </nav>
      </>
    </Auxilary>
  );
};

export default AdminPortal;

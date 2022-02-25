import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LogoutNavbar from '../../Navbars/LogoutNavbar/LogoutNavbar';
import doctor from '../../../assets/doctor.jpg';
import DoctorProfile from '../../Doctor/DoctorProfile/DoctorProfile';
import { useHistory } from 'react-router-dom';
import PatientNavbar from '../../Navbars/PatientNavbar/PatientNavbar.js';
import Auxilary from '../../../hoc/Auxilary';
import constants from '../../../constants';
import axios from 'axios';
import "react-chat-widget/lib/styles.css";
import { Widget, addResponseMessage, addLinkSnippet } from "react-chat-widget";
import DoctorCards from './DoctorCards/DoctorCards';
import Loader from '../../Loader/Loader.js';
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minWidth: 300,
    height: 250,
    display: 'flex',
    margin: 15,
  },
  media: {
    height: 100,
  },
  paginationContainer: {
    marginLeft : "2%",
    marginBottom : "2%"
  },
  
});

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [numberOfpages, setNumberOfPages] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [showLoader,setShowLoader]=useState(false)

  const history = useHistory();
  const handleClick = () => history.push('/doctor-details');

  const id = Math.random();
  useEffect(() => {
    addResponseMessage("Welcome to your Patient Dashboard!")
  });  
  const handleNewUserMessage = (message) => {
    axios.post(`${constants.API_URL}/chatbot`, {
        message,
        id
    }).then((response) => {
        response.data.response.says.forEach((say) => {
        addResponseMessage(say.text)
        })
        response.data.response.shows.forEach((shows) =>{
          console.log("This is test",shows.body)
          let me = {
              title: '',
              link: shows.body,
              target: '_blank'
          }
          addLinkSnippet(me)
      })
    })
    }

  const handleChange = (event, value) => {
    
      setPage(value);
    
  };

  const handleSpecializationChange = (value) => {
    setSpecialization(value);
  }
  const classes = useStyles();


  useEffect(() => {
    const fetchDoctors = async () => {
      setShowLoader(true)
      await axios.get(
        `${constants.API_URL}/get-doctors?page=${page}&specialization=${specialization}`
      )
      .then(res=>{
        setDoctors(res.data.results);
        setNumberOfPages(res.data.num_pages);
        // setShowLoader(false)
      })
      setShowLoader(false)
    };
      
    fetchDoctors();
  }, [specialization,page]);

  // console.log(doctors);
  

  return (
    <Auxilary>
      <LogoutNavbar />
      <Widget handleNewUserMessage={handleNewUserMessage} 
        title="Welcome to Homecare"
        subtitle="This is an automated chatbot"
      />
      <PatientNavbar onSpecializationChange = {handleSpecializationChange}/>
      <Loader loading={showLoader}/>
      <div class="cardsContainerBox">
      <div className="docCards" 
      style={{gridTemplateColumns:'2fr 2fr 2fr',
              display:'grid',
              marginTop: '1%',
              marginLeft: '7%',
              marginRight: '9%',
              gridAutoColumns:'max-content'}}>
        <DoctorCards doctors={doctors} />
      </div>
      </div>
      <div className={classes.paginationContainer}>
      <Pagination count={numberOfpages} variant="outlined" shape="rounded" page={page} onChange={handleChange} />
      </div>
    </Auxilary>
  );
}
export default PatientDashboard;

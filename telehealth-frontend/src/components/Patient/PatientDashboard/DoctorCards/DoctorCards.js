import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
// import LogoutNavbar from '../../Navbars/LogoutNavbar/LogoutNavbar';
// import doctor from '../../../assets/doctor.jpg';
// import DoctorProfile from '../../Doctor/DoctorProfile/DoctorProfile';
import {useHistory} from 'react-router-dom';
// import PatientNavbar from '../../Navbars/PatientNavbar/PatientNavbar.js';
import Auxilary from '../../../../hoc/Auxilary';
// import constants from '../../../constants';
import axios from 'axios'
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minWidth:300,
    height:250,
    display:'flex',
    margin:15
  },
  media: {
    height: '144px',
  },
  
});

const DoctorCards = ({doctors}) => {
    const classes = useStyles();
    const history = useHistory();
    const handleClick = (doctor) => history.push({
      pathname: `/doctor-details/${doctor.id}`,
      doctorData: doctor,
    });
    
    let doctorDetails = null;
    if(doctors.length>0){
        doctorDetails = doctors.map((doctor)=>
        <Card className={classes.root} onClick={() => handleClick(doctor)}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image= {doctor.doctor_details.image}
              title="Doctors Available"
            />
            <CardContent className="one">
              <Typography gutterBottom variant="h6" component="h5">
                Dr. {doctor.first_name} {doctor.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
               Specialization {doctor.specialization}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              <Rating
                      name="read-only"
                      value={doctor.ratings}
                      readOnly
                      size="small"
                    />
               {/* Ratings {} */}
              </Typography>
              
            </CardContent>
          </CardActionArea>  
        </Card> 
        );
    }
  
    return (
        <Auxilary>
            {doctorDetails}
        </Auxilary>
    )
}

export default DoctorCards
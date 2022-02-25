import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import dentist2 from '../../../../assets/specialists/dentist2.jpg';
import doc1 from '../../../../assets/doc1.jpg';
import gye from '../../../../assets/specialists/gye.jpg';
import ortho2 from '../../../../assets/specialists/ortho2.jpg';
import derma from '../../../../assets/specialists/derma.jpg';
import cardio from '../../../../assets/specialists/cardio.jpg';
import Pagination from '@material-ui/lab/Pagination';
import { useHistory } from 'react-router-dom';
import '../SpecializationList/GenericCards.css';
import Slider from '../../../Slider';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    width: '18rem',
    borderRadius: '0.4rem',
    height: '15%',
    marginLeft: '2px',
    marginTop: '1.5%',
    marginBottom: '1.5%',

    // fontFamily: "Camphor,Helvetica,Arial,sans-serif!important",
  },
  media: {
    height: '14rem',
    paddingTop: '56.25%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  cardList: {
    display: 'flex',
    opacity: '1',
    justifyContent: 'flex-start',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  specializationTitle: {
    color: '#084298',
    marginLeft: '2%',
    marginTop: '4%',
    fontSize: '1.4rem',
    fontWeight: 'inherit',
  },
  specializationSubTitle: {
    marginLeft: '2%',
    fontSize: '1rem',
    fontWeight: 'inherit',
    color: '#41464b',
  },
  paginationContainer: {
    marginLeft: '2%',
    marginBottom: '2%',
  },
}));

const SliderProps = {
  zoomFactor: 10, // How much the image should zoom on hover in percent
  slideMargin: 10, // Margin on each side of slides
  maxVisibleSlides: 4,
  pageTransition: 500, // Transition when flipping pages
};

export default function GenericCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [page, setPage] = useState(1);
  const [numberOfpages, setNumberOfPages] = useState('');
  const history = useHistory();

  const handleRoute = () => {
    history.push('/patient-dashboard');
  };

  const handleChange = (event, value) => {
    setPage(value);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const data = [
    {
      image: dentist2,
      title: 'Dentist Doctors',
      name: 'Dentist',
      description: 'Tooth troubles? Schedule a dental checkup',
    },
    {
      image: doc1,
      title: 'General Surgeon',
      name: 'General Surgeon',
      description:
        'Want to get operated by the best Surgeon? Book an appointment.',
    },
    {
      image: gye,
      title: 'Gynecologist',
      name: 'Gynecologist/Obstetrician',
      description:
        "Explore for women's health,pregnancy and infertility treatments.",
    },
    {
      image: ortho2,
      title: 'Orthopedist',
      name: 'Orthopedist',
      description:
        'For Bones and Joints issues, spiral injuries and more book appointment.',
    },
    {
      image: derma,
      title: 'Dermatologist',
      name: 'Dermatologist',
      description:
        "Bless yourself with the best skin care treatment with the top Dermatologist's. ",
    },
    {
      image: cardio,
      title: 'Cardiologist',
      name: 'Cardiologist',
      description:
        "Healthy heart and healthy lifestyle is on it's way book your appointment.",
    },
  
  ];
  return (
    <>
      <div class="content-header">
        <div>
          <h5 className={classes.specializationTitle}>
            Book an appointment for an online video consultation
          </h5>
          <div className={classes.specializationSubTitle}>
            Find experienced doctors across all specialist
          </div>
        </div>
      </div>

      <Slider {...SliderProps}>
        {data.map((doctor, index) => (
          <Card key={index} className={classes.root} onClick={handleRoute}>
            <CardMedia
              className={classes.media}
              image={doctor.image}
              title={doctor.title}
            />
            <CardContent>
              <Typography style={{fontSize:'1.15rem',color:"#084298"}} color="blue" component="p">
                {doctor.name}
              </Typography>
              <Typography style={{fontSize:'0.895rem',color:'#41464b'}} color="black" component="p">
                {doctor.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Slider>
    </>
  );
}

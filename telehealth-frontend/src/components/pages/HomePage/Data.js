import med1 from '../../../assets/med1.svg';
import appointment from '../../../assets/appointment.svg';
import blog1 from '../../../assets/blog1.svg';
import blog2 from '../../../assets/blog2.svg';
import YoutubeEmbed from '../../YoutubeEmbed/YoutubeEmbed.js';
import '../../YoutubeEmbed/YoutubeEmbed.css';


export const homeObjOne={
    lightBg:false,
    primary: false,
  lightBg: true,
  lightTopLine: false,
  lightText: false,
  lightTextDesc: false,
  topLine: 'Providing homecare medical facilites',
  headline: 'Remote Patient Monitoring System',
  description:
    'We help doctors and patients combat the distance and get best homecare facilites.',
  buttonLabel: 'GET STARTED WITH HOMECARE',
  handleClick: '/login',
//   buttonLabel: 'Blogs',
  imgStart: '',
  img: med1,
  alt: 'Doctors and Hospitals',
  start: ''
};
export const homeObjTwo = {
  primary: true,
  lightBg: false,
  lightTopLine: true,
  lightText: true,
  lightTextDesc: true,
  video: 'https://youtu.be/jYXS6JjN0Bg',
  topLine: 'Get an Instant Demo For Specialized Appointment',
  description:
    "Get a detailed video learning on how to avail all the homecare medical facilites",
  buttonLabel: 'GET A DEMO OF THE APPLICATION',
  handleClick:"/patient-dashboard",
  
};
export const homeObjThree = {
    primary: false,
    lightBg: true,
    lightTopLine: false,
    lightText: false,
    lightTextDesc: false,
    topLine: 'Instant setup for specialized appointment',
    headline: 'Get your appointment fixed by our top specialists.. ',
    description:
      "Once you've joined, our team of specialist will reach out to you and get you set up in minutes. Get our first video consultation free... ",
    buttonLabel: 'VIDEO CONSULTATION',
    handleClick:"/patient-dashboard",
    imgStart: '',
    img: appointment,
    alt: 'Fix Appointments',
    start: ''
  };
  export const homeObjFour = {
    primary: true,
    lightBg: false,
    lightTopLine: true,
    lightText: true,
    lightTextDesc: true,
    topLine: 'Instant setup for specialized appointment',
    description:
      "Book Appointments with our skilled and specialized doctors instantly...",
    buttonLabel: 'VIEW OUR BLOGS',
    handleClick:"/blogs",
    imgStart: '',
    img: blog2,
    alt: 'Fix Appointments',
    start: ''
    
  };

import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import GlobalNavbar from '../Navbars/GlobalNavbar/GlobalNavbar';
import {useHistory,useLocation} from 'react-router-dom';
import constants from '../../constants'



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const SignIn = (props) =>{
  
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const [errMsg,setErrMsg]=useState('');
  

  axios.defaults.withCredentials = true

  const handleSubmit = (e) =>{
      e.preventDefault();
      
      const userData = {
        email : email,
        password: password
      };

      axios.post(`${constants.API_URL}/login`,userData
      )
      .then(res =>{
        
        const data = res.data;
        if (location.destination)
          props.history.push(location.destination)
        else if(data.is_superuser)
          props.history.push("/admin-portal")
        else if(data.is_doctor)
          props.history.push("/doctor-profile");
        else
          props.history.push("/patient-dashboard");
      })
      .catch(e => {
        console.log(e);
        setErrMsg(e.response.data.detail)

      }) 
  }
  
  const classes = useStyles();
  return (
    [<GlobalNavbar />,
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <div class="doc-icon" style={{fontSize:"3rem",color:"#0000ff9e"}}><i class="fas fa-hand-holding-medical"></i></div>

        <Typography component="h1" variant="h5">
          <b>Sign In</b>
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
          />
          
        
          {errMsg?<div style={{color:"red",alignItems:"center"}}>{errMsg}</div>:null}
         
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            // onClick={handleClick}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Register here"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        
      </Box>
    </Container>
    ]
  );
}

export default SignIn;
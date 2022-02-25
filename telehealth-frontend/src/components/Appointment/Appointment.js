import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '55%',
    marginLeft: '8%',
    marginBottom:'5%'
  },
  slottimings: {},
  heading2: {
    color: '#0000ffb8',
    fontStyle: 'comic sans',
  },
  morning: {
    marginBottom: '3%',
    color: 'gray',
    fontSize: '1rem',
  },
}));

const Appointment = ({ slotsMap, doctorData, DocDates }) => {
  // console.log(slotsMap);
  const history = useHistory();
  const myDocDates = DocDates;
  // console.log("slot->>>>",timeSlot);
  function handleClick(timeSlot, date) {
    // history.push('/patient/booking-details')
    history.push({
      pathname: `/patient/booking-details/${doctorData.id}`,
      search: `?slot=${timeSlot}&date=${date}`,
      doctorData: doctorData,
    });
  }

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const docTimingsMorning = [
    { time: '8:00' },
    { time: '8:30' },

    { time: '9:00' },
    { time: '9:30' },

    { time: '10:00' },
    { time: '10:30' },

    { time: '11:00' },
    { time: '11:30' },
  ];
  const docTimingsAfternoon = [
    { time: '12:00' },
    { time: '12:30' },
    { time: '13:00' },
    { time: '13:30' },

    { time: '14:00' },
    { time: '14:30' },

    { time: '15:00' },
    { time: '15:30' },

    { time: '16:00' },
    { time: '16:30' },

    { time: '17:00' },
    { time: '17:30' },

    { time: '18:00' },
    { time: '18:30' },

    { time: '19:00' },
    { time: '19:30' },
    { time: '20:00' },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root} style={{marginLeft:'5%'}}>
      <AppBar position="static" color="default" style={{width:"163%"}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {myDocDates.map((date) => (
            <Tab label={date} {...a11yProps(0)} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{width:'163%',backgroundColor:'#ffffff'}}
      >
        {/* today pannel */}
        {myDocDates.map((date, i) => {
          const timeSlots = slotsMap.get(date);
          console.log('timeSlots->>>', timeSlots);
          let slotsGone = 0;
          let slotsDuplicate = 0;
          docTimingsMorning.map((dTime) => {
            let today = new Date(
              new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
            );
            var currentTime = today.getHours() + ':' + today.getMinutes();
            var slotDate = new Date(`${date} ${dTime.time}`);

            var res = new Date(today).getTime() > new Date(slotDate).getTime();
            if (res) {
              slotsGone++;
              if (timeSlots.has(dTime.time + ':00')) slotsDuplicate++;
            }
          });

          docTimingsAfternoon.map((dTime) => {
            let today = new Date(
              new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
            );
            var currentTime = today.getHours() + ':' + today.getMinutes();
            var slotDate = new Date(`${date} ${dTime.time}`);

            var res = new Date(today).getTime() > new Date(slotDate).getTime();
            if (res) {
              slotsGone++;
              if(timeSlots.has(dTime.time + ':00')) slotsDuplicate++;
            }
          });
          console.log('slotsGone->>>', slotsGone, timeSlots.size);
          return (
            <TabPanel value={value} index={i} dir={theme.direction}>
              <div className={classes.heading2}>
                Total {25 - timeSlots.size - slotsGone + slotsDuplicate} slots available
              </div>
              <hr />
              <div className={classes.morning}>Morning</div>
              <div className={classes.slottimings}>
                {' '}
                {docTimingsMorning.map((dTime) => {
                  // var d = new Date("11:20:00");
                  let today = new Date(
                    new Date().toLocaleString('en-US', {
                      timeZone: 'Asia/Kolkata',
                    })
                  );
                  var currentTime = today.getHours() + ':' + today.getMinutes();
                  var slotDate = new Date(`${date} ${dTime.time}`);

                  var res =
                    new Date(today).getTime() > new Date(slotDate).getTime();

                  if (!timeSlots.has(dTime.time + ':00') && !res)
                    return (
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        style={{ marginRight: '2%', marginBottom: '2%' }}
                        onClick={() => handleClick(dTime.time, date)}
                      >
                        {dTime.time} am
                      </button>
                    );
                })}
              </div>
              <hr />

              <div className={classes.morning}>AfterNoon</div>
              <div className={classes.slottimings}>
                {' '}
                {docTimingsAfternoon.map((dTime) => {
                  let today = new Date(
                    new Date().toLocaleString('en-US', {
                      timeZone: 'Asia/Kolkata',
                    })
                  );
                  var currentTime = today.getHours() + ':' + today.getMinutes();
                  var slotDate = new Date(`${date} ${dTime.time}`);

                  var res =
                    new Date(today).getTime() > new Date(slotDate).getTime();

                  if (!timeSlots.has(dTime.time + ':00') && !res)
                    return (
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        style={{ marginRight: '2%', marginBottom: '2%' }}
                        onClick={() => handleClick(dTime.time, date)}
                      >
                        {dTime.time} pm
                      </button>
                    );
                })}
              </div>
            </TabPanel>
          );
        })}
      </SwipeableViews>
    </div>
  );
};
export default Appointment;

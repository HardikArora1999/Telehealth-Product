import React, {useEffect, useState} from 'react'
import LogoutNavbar from '../../Navbars/LogoutNavbar/LogoutNavbar.js';
import PatientNavbar from '../../Navbars/PatientNavbar/PatientNavbar.js';
import doc1 from '../../../assets/doc1.jpg';
import '../../Appointment/BookingDetails/BookingDetails.css';
import PaymentOptions from '../BookingDetails/PaymentOptions.js';
import Button from '@material-ui/core/Button';
import { useLocation, useParams } from 'react-router-dom';
import Loader from '../../Loader/Loader.js';
import axios from 'axios'
import constants from '../../../constants.js';

const BookingDetails = () => {
    const [doctorData, setDoctorData] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { id } = useParams();
    const useQuery = () =>{
        return new URLSearchParams(location.search);
      }
    let query = useQuery();
    
    useEffect(() => {
        const fetchDoctor = async () => {
          setLoading(true);
           await axios
            .get(`${constants.API_URL}/get-doctor?doctor_id=${id}`)
            .then((res) => {
              setDoctorData(res.data.result);
            })
            .catch(e =>{
              console.log("sfsfsf");
            })
          setLoading(false);
        };
    
        if (location.doctorData) {
          setDoctorData(location.doctorData);
        } else {
          fetchDoctor();
        }
      }, [location]);

    return ([
        <Loader loading={loading} />,
        <LogoutNavbar/>,
        <PatientNavbar/>,
        <div class="booking-details-container">
             <div class="booking-details">
             <div class="card" style={{width: "25rem",marginLeft: "47%", marginTop: "11%",    marginBottom: "12%"
}}>
             <ul class="list-group list-group-flush">
                <li class="list-group-item"><i class="fas fa-laptop-medical" style={{color:"green",fontSize:"1.3rem"}}></i> Online Appoinment</li>
    
                 <li class="list-group-item"><i class="fas fa-calendar-check" style={{color:"green",fontSize:"1.3rem"}}></i> {query.get("date")} at {query.get("slot")} </li>
            </ul> 
            <img src={doctorData ? doctorData.doctor_details.image : null} class="card-img-top"  style={{padding:"5%"}} alt="..."/>
            <div class="card-body">
                <h5 class="card-title">Dr. {doctorData.first_name} {doctorData.last_name}</h5>
                <p class="card-text">{doctorData ? doctorData.doctor_details.description : null}</p>
            </div>
        </div>
        </div>

            <div class="appointment-container">
                <div class="patient-payment-details">Patient Payment Details</div>
                <hr/>
                <div class="otp-generation">
                    <div class="phone-title">Plaese enter your phone number and enter the otp received:</div>
                    <hr/>
                </div>
               <div class="form-detaisl">
                        <div class="phone-num">
                            
                              <div className="col-sm">
                  <div className="form-group">
                    <label> Enter Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=" Enter Phone Number"
                      
                    />
                  </div>
                </div>
                        </div>
                        <div class="phone-num" style={{marginTop:'3%'}}>
                            
                            <div className="form-group">
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter OTP"
                      
                    />
                  </div>
                            <div class="send-otp-btn" style={{marginTop:'4%'}}>
                                <Button variant="outlined" color="primary">
                                Send OTP
                                </Button>
                            </div>
                        </div>
                        <hr/>
                        {/* payment options */}
                        <div class="payment-options">
                            <div class="paytment-option-title">Choose a payment option to book your appointment:</div>
                            <PaymentOptions
                            doctor_id = {doctorData?doctorData.doctor_details.id:null}
                            start_time = {query.get("slot")}
                            date = {query.get("date")}
                            destination ={location.pathname+location.search}
                            />
                        </div>
               </div>
            </div>
           
        </div>
      
    ]);
}

export default BookingDetails

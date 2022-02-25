import React from 'react';
import wallet from '../../../../assets/wallet.png';

const Payments = () => {
    return (
        <div>
           
            <div class="feedback-img">
                <img src={wallet} style={{width:"15%",marginLeft:"36%"}}></img>
            </div>
            <div class="feedback-title" style={{marginLeft:"30%",color:"gray",marginTop:"2%",fontSize:"1rem"}}>
                You do not have any payments made.
            </div>
        
        </div>
    )
}

export default Payments

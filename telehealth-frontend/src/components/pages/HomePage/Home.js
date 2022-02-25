import React, { Component } from 'react'
import {homeObjOne,homeObjTwo,homeObjThree,homeObjFour,homeObjFive} from './Data'
import {InfoSection} from '../../../components'
import GlobalNavbar from '../../Navbars/GlobalNavbar/GlobalNavbar';
import { Widget, addResponseMessage, addLinkSnippet } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import axios from "axios";
import GenericCard from './SpecializationList/GenericCard';
import constants from '../../../constants';

const id = Math.random();

class Home extends Component{


    componentDidMount() {
    addResponseMessage("Welcome!! How may I help you?")
    }

    handleNewUserMessage(message) {
    axios.post(`${constants.API_URL}/chatbot`, {
        message,
        id 
    }).then((response) => {
        response.data.response.says.forEach((say) => {
        addResponseMessage(say.text)
        })
        response.data.response.shows.forEach((shows) =>{
            let me = {
                title: '',
                link: shows.body,
                target: '_blank'
            }
            addLinkSnippet(me)
        })
    })
    }

    render(){
    return(
        <>
        <GlobalNavbar />
        <Widget handleNewUserMessage={this.handleNewUserMessage} 
        title="Welcome to Homecare"
        subtitle="This is an automated chatbot"
        />
        <InfoSection {...homeObjOne}/>
        <InfoSection {...homeObjTwo}/>
        <InfoSection {...homeObjThree}/>
        <InfoSection {...homeObjFour}/>
        <GenericCard/>
        </>
    )
   } 
}
 export default Home;
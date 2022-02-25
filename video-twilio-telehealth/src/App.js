import React from 'react';
import './App.css';
import { BrowserRouter as Router} from 'react-router-dom'
import VideoChat from './VideoChat';
import Header from './DoctorNavbar/Header2';
import Footer from './Footer/Footer';
import GlobalStyle from './globalStyles'
import { isClassExpression } from 'typescript';


const App = () => {
  margin :{

  }
  return (
    <Router>
      <GlobalStyle />
       <Header />
        <VideoChat />
      <Footer />
    </Router>
        
  
  );
};

export default App;

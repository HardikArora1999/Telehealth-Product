import React,{useState,useEffect}from 'react'
import {FaBars,FaTimes} from 'react-icons/fa'
import { MobileIcon } from '../GlobalNavbar/Navbar.elements';
import {Nav,NavbarContainer, NavLogo, NavIcon, NavMenu,NavItem,
  NavLinks, NavBtnLink,NavItemBtn
} from '../GlobalNavbar/Navbar.elements';
import {IconContext } from 'react-icons/lib'
import {Button} from '../../../globalStyles'
// import Navbar2 from './LogoutNavbar';
import axios from 'axios'
import constants from '../../../constants';



const LogoutNavbar = (props) => {
  
  const [click,setClick] = useState(false);
  const[button,setButton] = useState(true);

  const handleClick = () => setClick(!click);
  axios.defaults.withCredentials = true

  const handleLogout = () => {
    axios.post(`${constants.API_URL}/logout`)
    .then(res =>{
     
      console.log(res);
      console.log(res.data);
      window.location.href= '/';
    })
    .catch(e => {
      console.log(e);
    }) 
  }
  const showButton = () =>{
    if(window.innerWidth<=960){
      setButton(false);
    }
    else{
      setButton(true)
    }
  }

  useEffect(() =>{
    showButton();
  },[])

  window.addEventListener('resize',showButton);

  return (
    <>
    <IconContext.Provider value ={{color:'#fff'}}>
      <Nav>
        <NavbarContainer>
            <NavLogo to='/'>
              <NavIcon />
              HOMECARE
            </NavLogo>
            <MobileIcon onClick={handleClick}>{click ? <FaTimes/> :<FaBars/>}</MobileIcon>

            <NavMenu onClick={handleClick} click={click}>
              <NavItem>
                <NavLinks to='/patient-dashboard'>
                  Home 
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to='/covid'>
                  Covid-19
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to='/blogs'>
                  Resources
                </NavLinks>
              </NavItem>

              <NavItemBtn>
                    <Button color="default" onClick={handleLogout}>Logout</Button>
              </NavItemBtn>
              
              
            </NavMenu>
        </NavbarContainer>
      </Nav>
      </IconContext.Provider>
    </>
   
  )
}

export default LogoutNavbar;

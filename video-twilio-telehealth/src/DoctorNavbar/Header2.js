import React,{useState,useEffect}from 'react'
import {FaBars,FaTimes} from 'react-icons/fa'
import { MobileIcon } from './Navbar.elements';
import {Nav,NavbarContainer, NavLogo, NavIcon, NavMenu,NavItem,
  NavLinks, NavBtnLink,NavItemBtn
} from './Navbar.elements';
import {IconContext } from 'react-icons/lib'
import {Button} from '../globalStyles'

const Navbar = () => {
  
  const [click,setClick] = useState(false);
  const[button,setButton] = useState(true);

  const handleClick = () => setClick(!click);

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
                <NavLinks to='/'>
                  Home 
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to='/covid'>
                  Covid-19
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to='/resources'>
                  Resources
                </NavLinks>
              </NavItem>
              <NavItemBtn>
                  <NavBtnLink to='/'>
                    <Button color="default">Logout</Button>
                  </NavBtnLink>
              </NavItemBtn>
            </NavMenu>
        </NavbarContainer>
      </Nav>
      </IconContext.Provider>
    </>
  )
}

export default Navbar

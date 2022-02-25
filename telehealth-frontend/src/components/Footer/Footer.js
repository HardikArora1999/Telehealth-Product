import React from 'react'
import {FooterContainer,
  FooterSubscription,
  FooterSubText,
  FooterSubHeading,
  Form,
  FormInput,
  FooterLinksContainer,
  FooterLinksWrapper,
  FooterLinkTitle,
  FooterLink,
  FooterLinkItem,
  SocialMedia,
  SocialMediaWrap,
  SocialLogo,
  SocialIcon,
  SocialIcons,
  SocialIconLink
   
}from './Footer.element';

import {FaFacebook,
FaInstagram,
FaTwitter,
FaLinkedin} from 'react-icons/fa'

import {Button} from '../../globalStyles'

const Footer = () => {
  return (
    <FooterContainer>
        <FooterSubscription>
        <FooterSubHeading>
          Join our exclusive membership to receive the latest updates and services
        </FooterSubHeading>
        <FooterSubText>You can unsubscribe at any time.</FooterSubText>
        <Form>
          <FormInput name='email' type='email' placeholder='Your Email' />
          <Button fontSmall>Subscribe</Button>
        </Form>
      </FooterSubscription>
      <FooterLinksContainer>
        <FooterLinksWrapper>

        {/* first  */}
          <FooterLinkItem>
            <FooterLinkTitle Link to="/">About Us</FooterLinkTitle>
            <FooterLink to='/'>How it works</FooterLink>
           
          </FooterLinkItem>

          {/* 2nd */}
          <FooterLinkItem>
            <FooterLinkTitle>Contact Us</FooterLinkTitle>
            <FooterLink to='/blogs'>View Our Blogs</FooterLink>
            <FooterLink to='/patient-dashboard'>Video Consultations</FooterLink>
           
          </FooterLinkItem>

          {/* 3rd */}
          <FooterLinkItem>
            <FooterLinkTitle>Resources</FooterLinkTitle>
            <FooterLink to='/'>See Our Covid Updates</FooterLink>
            {/* <FooterLink to='/'>Testimonials</FooterLink> */}
           
          </FooterLinkItem>

          {/* 4th */}
          <FooterLinkItem>
            <FooterLinkTitle>Social Media</FooterLinkTitle>
            <FooterLink to='/patient-dashboard'>Get a demo of the application</FooterLink>
            {/* <FooterLink to='/'>Testimonials</FooterLink>
            <FooterLink to='/'>Careers</FooterLink>
            <FooterLink to='/'>Investors</FooterLink>
            <FooterLink to='/'>Terms of Service</FooterLink> */}
          </FooterLinkItem>
        </FooterLinksWrapper>
      </FooterLinksContainer>
      <SocialMedia>
        <SocialMediaWrap>
          <SocialLogo to="/">
            <SocialIcon>HOMECARE 2021</SocialIcon>
          </SocialLogo>

          <SocialIcons>
            <SocialIconLink href='/' target="_blank" aria-label="Facebook">
              <FaFacebook/>
            </SocialIconLink>

            <SocialIconLink href='/' target="_blank" aria-label="Instagram">
              <FaInstagram/>
            </SocialIconLink>

            <SocialIconLink href='/' target="_blank" aria-label="Twitter">
              <FaTwitter/>
            </SocialIconLink>

            <SocialIconLink href='/' target="_blank" aria-label="Linkedin">
              <FaLinkedin/>
            </SocialIconLink>

          </SocialIcons>
        </SocialMediaWrap>
      </SocialMedia>
    </FooterContainer>
  )
}

export default Footer

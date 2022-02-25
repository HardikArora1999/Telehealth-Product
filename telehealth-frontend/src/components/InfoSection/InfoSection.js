import React from 'react'
import {Link} from 'react-router-dom';
import {InfoColumn, InfoSec} from './InfoSection.element'
import {Container,Button} from '../../globalStyles';
import {InfoRow,TextWrapper,TopLine,Subtitle,Heading,ImgWrapper,Img} from './InfoSection.element'
import ReactPlayer from 'react-player';
import YoutubeEmbed from '../YoutubeEmbed/YoutubeEmbed';


const InfoSection = ({primary,
  lightBg,
  topLine,
  lightTopLine,
  lightText,
  lightTextDesc,
  headline,
  description,
  buttonLabel,
  handleClick,
  img,
  video,
  alt,
  imgStart,
  start}) => {
    
    return (
        <>
          <InfoSec lightBg={lightBg}>
            <Container>
              <InfoRow imgStart={imgStart}>
                <InfoColumn>
                  <TextWrapper>
                  <TopLine lightTopLine={lightTopLine}>{topLine}</TopLine>
                <Heading lightText={lightText}>{headline}</Heading>
                <Subtitle lightTextDesc={lightTextDesc}>{description}</Subtitle>
              
                <Link to={handleClick}>
                  <Button small primary={primary}>
                    {buttonLabel}
                  </Button>
                </Link>
              
                  </TextWrapper>
                </InfoColumn>

                <InfoColumn>
              <ImgWrapper start={start}>
                <Img src={img} alt={alt} />
                {/* <YoutubeEmbed /> */}
                <ReactPlayer url={video} />
              </ImgWrapper>
            </InfoColumn>
              </InfoRow>
            </Container>
          </InfoSec>  
        </>
    )
}

export default InfoSection

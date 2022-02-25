import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import GlobalNavbar from '../Navbars/GlobalNavbar/GlobalNavbar';
import'bootstrap/dist/css/bootstrap.min.css';


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  
}));

const cards = [
  {img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80", title: "An Apple a Day Keeps the Doctor Away — Fact or Fiction?", 
  text: "This article takes a closer look at whether eating an apple a day can truly help keep the doctor away.", url: "https://www.healthline.com/nutrition/an-apple-a-day-keeps-the-doctor-away"},
  {img: "https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/video/high_blood_sugar_warnings_video/1800x1200_high_blood_sugar_warnings_video.jpg?resize=*:350px", title: "Blood Sugar Control in Diabetes Getting Worse: Study", 
  text: "Fewer adults with diabetes in the United States have well-controlled blood sugar or blood pressure now compared with 10 years ago,", url: "https://www.webmd.com/diabetes/news/20210609/blood-sugar-control-in-diabetes-getting-worse-study"},
  {img: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=748&q=80", title: "My 30-Day Reset Autoimmune Diet Plan & Recipes", 
  text: "Autoimmune disease happens when the immune system mistakenly targets your own body cells as the enemy, resulting in damage.", url: "https://wellnessmama.com/22689/autoimmune-diet/"},
  {img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=794&q=80", title: "Cardio Yoga: Benefits, Guide, and How It Compares", 
  text: "This article explains everything you need to know about cardio yoga, including its benefits, specific workouts, and how it compares with other forms of cardio.", url: "https://www.healthline.com/nutrition/cardio-yoga"},
  {img: "https://images.unsplash.com/photo-1437750769465-301382cdf094?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80", title: "The 15 Best Supplements to Boost Your Immune System Right Now", 
  text: "Making healthy lifestyle choices by consuming nutritious foods and getting enough sleep and exercise are the most important ways to bolster your immune system.", url: "https://www.healthline.com/nutrition/immune-boosting-supplements"},
  {img: "https://images.unsplash.com/photo-1589326499547-ed09eff4c5cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80", title: "8 Foods and Beverages to Avoid with Arthritis", 
  text: "Arthritis is a common health condition involving chronic inflammation in your joints. It causes pain and damage to joints, bones, and other body parts depending on the type.", url: "https://www.healthline.com/nutrition/foods-to-avoid-arthritis#1.-Added-sugars"},
  {img: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=810&q=80", title: "Implanted Microchip Could Help Avoid Stroke", 
  text: "Norman Mayer, 86, walks around with a computer chip in his chest and doesn't think a thing about it.", url: "https://www.webmd.com/heart-disease/atrial-fibrillation/news/20210609/implanted-microchip-could-help-avoid-stroke"},
  {img: "https://images.unsplash.com/photo-1585577529540-a8095ea25427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", title: "Wake up refreshed by sleeping Smarter, not Longer", 
  text: "Getting good sleep is both an art and a science — yet the overwhelming majority of people have trouble sleeping, even those who have mastered every other aspect of their lives. ", url: "https://shop.bulletproof.com/pages/sleep-solutions"},
  {img: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", title: "30 Mindfulness Activities to Find Calm at Any Age",
  text: "The practice of mindfulness is gaining popularity as a way to ease stress, soothe anxiety, and be more present and engaged in life.", url: "https://www.healthline.com/health/mind-body/mindfulness-activities"},

];

const searchHandler = () => {};

// const getSearchTerm = () =>{};


export default function Blogs() {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    [<GlobalNavbar />,
      <div><nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
      
      </div>
    </nav></div>,

    <React.Fragment>
      <CssBaseline />
  <main>
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card.img}
                  title={card.title}
                />
                <CardContent className={classes.cardContent} 
                term={searchTerm}
                searchKeyword={searchHandler}
                >
                  <Typography gutterBottom component="h6" style={{fontWeight:"bold"}}>
                    {card.title}
                  </Typography>
                  <Typography style={{color:"#41464bbf"}} variant="p">
                    {card.text}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" href={card.url}>
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </main>
    </React.Fragment>]
  );
}
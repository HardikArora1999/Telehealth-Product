import React from "react";
import Cards from "./Cards/Cards";
import CountryPicker from './CountryPicker/CountryPicker';
import Chart from './Chart/Chart';
import styles from "./Covid.module.css";
import { fetchData } from "./index";
import GlobalNavbar from '../Navbars/GlobalNavbar/GlobalNavbar';
import coronaImage from "../../assets/corona.png";

class Covid extends React.Component {
  state = {
    data: {},
    country: "",
  };
  async componentDidMount() {
    const fetchedData = await fetchData();
    this.setState({ data: fetchedData });
  }
  handleCountryChange = async (country) => {
    const fetchedData = await fetchData(country);
    this.setState({ data: fetchedData, country: country });
  };
  render() {
    const { data, country } = this.state;
    return ([
    <GlobalNavbar />,
        <div className={styles.container}>
            <img className={styles.image} src={coronaImage} alt="COVID-19" />
            <br />
            <text>
            <b>Global and Country Wise Cases of Corona Virus</b>
            </text>
            <br />
            <text>
            <i>(For a Particular country, select a Country from below)</i>
            </text>
            <br />
            {this.state.data?<Cards data={data} country={country} />:null}
            {this.state.data?<CountryPicker handleCountryChange={this.handleCountryChange} />:null}
            {this.state.data?<Chart data={data} country={country} />:null}
            <br />
        </div>]
    );
  }
}

export default Covid;



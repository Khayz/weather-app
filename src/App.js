import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';

import './App.css';

import { Spinner } from './components/ui/Spinner/Spinner';

function App() {
	const [currentLocation, setCurrentLocation] = useState({});
	const [nameLocation, setNameLocation] = useState('zapopan');
	const [isLoading, setIsLoading] = useState(true);
	const [temperatureData, setTemperatureData] = useState(null);
	const [isFahrenheit, setIsFahrenheit] = useState(true);
	const [isCelcius, setIsCelcius] = useState(false);
	const [nextTemp, setNextTemp] = useState('Celcius');
	const [nextCity, setNextCity] = useState('');
	const [error, setError] = useState(null);

	useEffect(() => {
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${nameLocation}&appid=bb67daae94518deb896b60e80d0b1c81`
			)
			.then(response => {
				setCurrentLocation(response.data);
				setIsLoading(false);
				setError(false);
				setTemperatureData(response.data.main);
			})
			.catch(error => {
				setIsLoading(false);
				setError(true);
			});
	}, [nameLocation]);

	let iconWeather = <Spinner />;
	let descriptionWeather = null;
	if (!isLoading && currentLocation.weather[0].icon) {
		iconWeather = `https://openweathermap.org/img/w/${currentLocation.weather[0].icon}.png`;
		descriptionWeather = <h3>{currentLocation.weather[0].description}</h3>;
	}

	const changeGradesHandler = event => {
		event.preventDefault();
		setIsFahrenheit(!isFahrenheit);
		setIsCelcius(!isCelcius);
		if (isFahrenheit) {
			setNextTemp('Fahrenheit');
		} else {
			setNextTemp('Celcius');
		}
	};

	const changeLocationHandler = event => {
		event.preventDefault();
		let city = nextCity;
		if (
			nextCity.length > 3 &&
			city.toLowerCase() !== nameLocation.toLowerCase()
		) {
			setIsLoading(true);
			setNameLocation(nextCity.toLowerCase());
		}
	};

	let temperatures = null;
	if (temperatureData && isFahrenheit) {
		const newTemperatures = { ...temperatureData };
		for (let temp in newTemperatures) {
			newTemperatures[temp] = ((newTemperatures[temp] - 273.15) * 9) / 5 + 32;
		}

		temperatures = Object.keys(newTemperatures).map((temp, index) => {
			return index < 4 ? (
				<h3 key={temp}>
					{temp.split('_').join(' ')}: {newTemperatures[temp].toFixed(2)} °F
				</h3>
			) : null;
		});
	} else if (temperatureData && isCelcius) {
		const newTemperatures = { ...temperatureData };
		for (let temp in newTemperatures) {
			newTemperatures[temp] = newTemperatures[temp] - 273.15;
		}

		temperatures = Object.keys(newTemperatures).map((temp, index) => {
			return index < 4 ? (
				<h3 key={temp}>
					{temp.split('_').join(' ')}: {newTemperatures[temp].toFixed(2)} °C
				</h3>
			) : null;
		});
	}

	let dataCity = null;
	if (error) {
		dataCity = <h1>City not found, write a correct city!</h1>;
	} else {
		dataCity = (
			<Fragment>
				<h1>Location</h1>
				<h2>{nameLocation}</h2>
				{descriptionWeather}
				<img src={iconWeather} alt='descriptionWeather' />
				{temperatures}
				<button onClick={changeGradesHandler}>Change to {nextTemp}</button>
			</Fragment>
		);
	}

	return isLoading ? (
		<Spinner />
	) : (
		<div className='App'>
			<form onSubmit={changeLocationHandler}>
				<input
					onChange={event => setNextCity(event.target.value)}
					value={nextCity}
					type='text'
					placeholder='Search a location'
				/>
				<button>Find</button>
			</form>
			{dataCity}
		</div>
	);
}

export default App;

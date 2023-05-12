import './Home.css'
import backgroundGIF from '../../assets/NBAStadium.gif';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import axios from '../../api/axios';

function Home() {
	const [listOfItems, setListOfItems] = useState([]);

	useEffect(() => {
		axios.get("/entries/searchItems").then((response) => {
			setListOfItems(response.data);
		});
	}, []);

	return (
		<div className="home-page">
			<div className="home-page-background" style={{backgroundImage: "url(" + backgroundGIF + ")"}}></div>
			<div className="home-page-description">
				<div>
					HooperRef is an archive of songs that 
					have references to current and former NBA players.
				</div>
				<div>Search for a player, artist, or song to get started.</div>
			</div>
			<SearchBar placeholder="Search..." data={listOfItems} input=""/>
		</div>
	)
}

export default Home
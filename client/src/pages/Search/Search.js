import './Search.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import EntriesTable from '../../components/EntriesTable/EntriesTable';


function Search() {
    const location = useLocation();
    const [query, setQuery] = useState(() => {
        const q = new URLSearchParams(location.search);
        return q.get("q") || "";
    });

    const [searchResults, setSearchResults] = useState([]); 
    const [listOfItems, setListOfItems] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/entries/search?q=${query}`).then((response) => {
            setSearchResults(response.data);
        });

		axios.get("http://localhost:3001/entries/searchItems").then((response) => {
			setListOfItems(response.data);
		});
    }, []);

    return (
        <div className="search-page">
            <div className="page-description">Search for any player, artist, or song.</div>
            <SearchBar placeholder="Search..." data={listOfItems} input={query}/>
            <EntriesTable header="Search Results" entries={searchResults}/>
        </div>
    )
}

export default Search
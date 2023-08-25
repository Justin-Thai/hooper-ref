import './Search.css';
import axios from '../../api/axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import UsersGrid from '../../components/UsersGrid/UsersGrid';
import EntriesTable from '../../components/EntriesTable/EntriesTable';

function Search() {
    const location = useLocation();
    const [query, setQuery] = useState(() => {
        const q = new URLSearchParams(location.search);
        return q.get("q") || "";
    });

    const [searchResults, setSearchResults] = useState([]); 
    const [userResults, setUserResults] = useState([]);
    const [listOfItems, setListOfItems] = useState([]);

    useEffect(() => {
        axios.get(`/entries/search?q=${query}`).then((response) => {
            setSearchResults(response.data);
        });

        axios.get(`/users/search/user?q=${query}`).then((response) => {
            setUserResults(response.data);
        });

		axios.get('/entries/searchItems').then((response) => {
			const totalItems = response.data;

			axios.get('users/search/names').then((response) => {
				response.data.forEach((value) => {
					totalItems.push(value);
				});
	
				setListOfItems(totalItems);
			})
		});
    }, []);

    return (
        <div className="search-page">
            <div className="page-description">Search for any user, player, artist, or song.</div>
            <SearchBar placeholder="Search..." data={listOfItems} input={query}/>
            <UsersGrid header="Users" users={userResults}/>
            <EntriesTable header="Songs" entries={searchResults}/>
        </div>
    )
}

export default Search
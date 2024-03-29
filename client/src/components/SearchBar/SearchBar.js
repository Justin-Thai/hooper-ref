import './SearchBar.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useClickOutside from '../../hooks/useClickOutside';

function SearchBar({ placeholder, data, input }) { 
	let navigate = useNavigate();
	const location = useLocation();
	const [query, setQuery] = useState(input);
	const [resultActive, setResultActive] = useState(false);

	let domNode = useClickOutside(() => {
		setResultActive(false);
	});

	const filteredData = data.filter((item) => {
		return item.toLowerCase().replace(/\W/g, '')
					.includes(query.toLowerCase().replace(/\W/g, ''));
	});

	const replaceInput = (value) => {
		setResultActive(false);
		setQuery(value);
	}

	const inputChange = (value) => {
		if (!resultActive) {
			setResultActive(true);
		}
		setQuery(value);
	}

	const goToSearch = () => {
		if(query.length === 0) {
			navigate(`/search`);
		}
		else {
			navigate(`/search?q=${query}`);
			if (location.pathname.includes("search")) {
				navigate(0);	// Refresh page to show results
			}
		}
	}

	return (
		<div ref={domNode} className="search-bar-container">
			<div className="search-bar-inputs">
				<input type="text"
					id="search-input"
					placeholder={placeholder}
					value={query}
					onChange={(e) => inputChange(e.target.value)}
				/>
				<FontAwesomeIcon icon={faMagnifyingGlass} className="icon-search" onClick={goToSearch}/>
			</div>
			{query.length !== 0 && filteredData.length !== 0 && resultActive && (
				<div className="data-result">
					{filteredData.map((value, key) => {
						return (
							<>
								<p onClick={() => replaceInput(value)}>{value}</p>
							</>
						);
					})}
				</div>
			)}
		</div>
	)
}

export default SearchBar
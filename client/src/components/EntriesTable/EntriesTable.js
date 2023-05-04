import './EntriesTable.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { useClickOutside, sortEntriesByCat } from '../../util/Utils';


function EntriesTable({ header, entries }) {
	let listOfEntries = entries;
	const [sortDropdown, setSortDropdown] = useState(false);

	const openSortDropdown = () => { setSortDropdown(!sortDropdown) };

	let domNode = useClickOutside(() => { setSortDropdown(false); });

	let sortHandler = (event) => {
		const option = event.target;
		if (option.matches("#dropdownOptions li")) {
			const index = Array.prototype.indexOf.call(option.parentElement.children, option);
			const currentIsAscending = option.classList.contains("li-sort-asc");

			sortEntriesByCat(listOfEntries, index, !currentIsAscending);

			// Updating dropdown option items
			option.closest("#dropdownOptions")
				.querySelectorAll("li")
				.forEach(li => li.classList.remove("li-sort-asc", "li-sort-desc"));
			option.classList.toggle("li-sort-asc", !currentIsAscending);
			option.classList.toggle("li-sort-desc", currentIsAscending);
		}
	}

	const sortEntries = () => {
		const element = document.getElementById("dropdownOptions");		// PROBLEM HERE (Always returns null)
		element.addEventListener("click", sortHandler, { once: true });

		setSortDropdown(false);
	};


	return (
		<div>
			<div className="entries-header-container">
				<div className="entries-header">{header} ({listOfEntries.length})</div>
				<div ref={domNode} className="dropdown">
					<button className="dropbtn" onClick={openSortDropdown}>Sort By</button>
					<ul
						className={sortDropdown ? "dropdown-content-active" : "dropdown-content"}
						onClick={sortEntries}
						id="dropdown-options"
					>
						<li className="li-sort-asc">Default</li>
						<li>Title</li>
						<li>Artist</li>
						<li>Album</li>
						<li>Year</li>
						<li>Player</li>
					</ul>
				</div>
			</div>
			<table className="entry-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Title</th>
						<th>Album</th>
						<th>Player Ref.</th>
						<th>Excerpt</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>
					{listOfEntries.map((value) => {
						return (
							<tr>
								<td></td>
								<td className="song-column">
									<div className="entry-song">{value.song}</div>
									<div>{value.artist}</div>
								</td>
								<td className="album-column">
									<div className="entry-album">{value.album}</div>
									<div>({value.year})</div>
								</td>
								<td className="entry-player">{value.player}</td>
								<td className="entry-excerpt">"{value.excerpt}"</td>
								<td>
									<div onClick={() => {
										window.open(value.link, "_blank");
									}}>
										<FontAwesomeIcon icon={faSpotify} className="icon-spotify" />
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	)
}

export default EntriesTable;
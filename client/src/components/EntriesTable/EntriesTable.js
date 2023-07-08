import './EntriesTable.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { sortEntriesByCat } from '../../util/Utils';
import useClickOutside from '../../hooks/useClickOutside';

function EntriesTable({ header, entries }) {
	let listOfEntries = entries;
	const [sortDropdown, setSortDropdown] = useState(false);

	const openSortDropdown = () => { setSortDropdown(!sortDropdown) };

	let domNode = useClickOutside(() => { setSortDropdown(false); });

	let sortHandler = (event) => {
		const option = event.target;
		if (option.matches("#dropdown-options li")) {
			const index = Array.prototype.indexOf.call(option.parentElement.children, option);
			const currentIsAscending = option.classList.contains("li-sort-asc");

			sortEntriesByCat(listOfEntries, index, !currentIsAscending);

			// Updating dropdown option items
			option.closest("#dropdown-options")
				.querySelectorAll("li")
				.forEach(li => li.classList.remove("li-sort-asc", "li-sort-desc"));
			option.classList.toggle("li-sort-asc", !currentIsAscending);
			option.classList.toggle("li-sort-desc", currentIsAscending);
		}
	}

	const sortEntries = () => {
		const element = document.getElementById("dropdown-options");
		element.addEventListener("click", sortHandler, { once: true });

		setSortDropdown(false);
	};

	const goToPlayerPage = (code) => {
		window.open(`https://www.basketball-reference.com/players/${code.charAt(0)}/${code}.html`)
	}

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
						<th className="entry-table-number">#</th>
						<th className="entry-table-title">Title</th>
						<th className="entry-table-album">Album</th>
						<th className="entry-table-player">Player Ref.</th>
						<th className="entry-table-excerpt">Excerpt</th>
						<th className="entry-table-link">Link</th>
					</tr>
				</thead>
				<tbody>
					{listOfEntries.map((value) => {
						return (
							<tr key={value.id}>
								<td></td>
								<td>
									<div className="entry-song">{value.song}</div>
									<div>{value.artist}</div>
								</td>
								<td>
									<div>{value.album}</div>
									<div>({value.year})</div>
								</td>
								<td className="entry-player" 
									onClick={
										() => goToPlayerPage(value.Player.playerCode)
									}
								>
									{value.Player.name}
								</td>
								<td className="entry-excerpt">"{value.excerpt}"</td>
								<td className="entry-link">
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
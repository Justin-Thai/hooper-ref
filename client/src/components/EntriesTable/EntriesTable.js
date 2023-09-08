import './EntriesTable.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { sortItemsByCat } from '../../util/Utils';
import useClickOutside from '../../hooks/useClickOutside';

function EntriesTable({ header, entries, playerLink }) {
	let listOfEntries = entries;
	const categories = ["id", "song", "artist", "album", "year", "playerCode"];
	const [sortDropdown, setSortDropdown] = useState(false);
	const sortElement = document.getElementById("dropdown-options");
	let domNode = useClickOutside(() => { setSortDropdown(false); });
	let navigate = useNavigate();

	let sortHandler = (event) => {
		const option = event.target;
		if (option.matches("#dropdown-options li")) {
			const index = Array.prototype.indexOf.call(option.parentElement.children, option);
			const currentIsAscending = option.classList.contains("li-sort-asc");

			listOfEntries = sortItemsByCat(listOfEntries, categories, index, !currentIsAscending);

			// Updating dropdown option items
			option.closest("#dropdown-options")
				.querySelectorAll("li")
				.forEach(li => li.classList.remove("li-sort-asc", "li-sort-desc"));
			option.classList.toggle("li-sort-asc", !currentIsAscending);
			option.classList.toggle("li-sort-desc", currentIsAscending);
		}

		sortElement.removeEventListener("click", sortHandler);
	}

	const openSortDropdown = () => {
		sortElement.addEventListener("click", sortHandler);
		setSortDropdown(!sortDropdown);
	}

	return (
		<div>
			<div className="entries-header-container">
				<div className="entries-header">{header} ({listOfEntries.length})</div>
				{listOfEntries.length === 0 ? (
					<div ref={domNode}></div>
				) : (
					<div ref={domNode} className="dropdown">
						<button className="dropbtn" onClick={openSortDropdown}>Sort By</button>
						<ul
							className={sortDropdown ? "dropdown-content-active" : "dropdown-content"}
							onClick={() => setSortDropdown(false)}
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
				)}
			</div>
			{listOfEntries.length === 0 ? (
				<div className="no-entries-text">No songs found</div>
			) : (
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
									{playerLink ? (
										<td className="entry-player"
											onClick={
												() => navigate(`/player/${value.playerCode}`)
											}
										>
											{value.playerName}
										</td>
									) : (
										<td className="entry-player">
											{value.playerName}
										</td>
									)}
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
			)}

		</div>
	)
}

export default EntriesTable;
import './PlayerProfile.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import EntriesTable from '../../components/EntriesTable/EntriesTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball } from '@fortawesome/free-solid-svg-icons';
import default_profile_image from '../../assets/default_profile.png';

function Profile() {
	let { playercode } = useParams();
	const [player, setPlayer] = useState({});
	const [playerImage, setPlayerImage] = useState("");
	const [listOfEntires, setListOfEntries] = useState([]);
	const playerInfo = {
		"Nicknames": "Pip, Scott, Batman, Robin",
		"Position(s)": "SF",
		"Height/Weight": "6ft 8in, 210 lbs",
		"DOB": "1965-09-25",
		"Birthplace": "Hamburg, Arkansas",
		"Status": "Retired",
		"Debut": "1987-11-07",
		"Total Seasons": 17,
	}

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		axios.get(`/players/${playercode}`).then((response) => {
			if (response.status === 204) {
				navigate('/404-error', { state: { from: location }, replace: true });
			}
			setPlayer(response.data);
			setPlayerImage(`https://www.basketball-reference.com/req/202106291/images/headshots/${playercode}.jpg`);

			axios.get(`/entries/byPlayer/${response.data.id}`).then((response) => {
				setListOfEntries(response.data);
			})
		});
	}, [playercode]);

	const goToBFPage = (code) => {
		window.open(`https://www.basketball-reference.com/players/${code.charAt(0)}/${code}.html`)
	}

	return (
		<div className="profile-page">
			<div className="player-profile-container">
				<div className="player-profile-picture">
					{playerImage ? (
						<img className="player-image" src={playerImage} alt="Player headshot" />
					) : (
						<img className="player-image" src={default_profile_image} alt="Default headshot" />
					)}
				</div>
				<div className="player-profile-info">
					<div className="player-profile-name">
						<span className="player-name">{player.name}</span>
						<FontAwesomeIcon
							className="icon-ball"
							title="Go to Basketball Reference page"
							icon={faBasketball}
							onClick={() => goToBFPage(player.playerCode)}
						/>
					</div>
					{Object.entries(playerInfo).map(([key, value]) => {
						return (
							<div className="player-category">
								<span>{key}: </span>
								<span className="player-category-text">{value}</span>
							</div>
						);
					})}
				</div>
			</div>
			<div className="player-resume-container">
				<div className="player-resume-teams">
					<span>Teams: </span>
					<span className="player-category-text">CHI, HOU, POR</span>
				</div>
				<div className="player-resume-awards">
					<span>Accolades: </span>
					<span className="player-category-text">Hall of Fame, 7x All-Star, 1994-95 STL Champ, 6x NBA Champ, 7x All-NBA, 10x All-Defensive, 1993-94 AS MVP, NBA 75th Anniv. Team</span>
				</div>
				<div className="player-resume-stats">
					<div>Career Statistics</div>
					<table className="stats-table">
						<thead>
							<tr>
								<th>Games</th>
								<th>PTS</th>
								<th>REB</th>
								<th>AST</th>
								<th>STL</th>
								<th>BLK</th>
								<th>FG%</th>
								<th>3P%</th>
								<th>FT%</th>
								<th>TOV</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1178</td>
								<td>16.1</td>
								<td>6.4</td>
								<td>5.2</td>
								<td>2.0</td>
								<td>0.8</td>
								<td>47.3</td>
								<td>32.6</td>
								<td>70.4</td>
								<td>2.8</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<EntriesTable header="Mentioned Songs" entries={listOfEntires} />
		</div>
	)
}

export default Profile;
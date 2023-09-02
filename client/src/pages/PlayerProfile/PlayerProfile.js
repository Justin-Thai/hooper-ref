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
	const [playerInfo, setPlayerInfo] = useState({});
	const [playerStats, setPlayerStats] = useState({});
	const [listOfEntires, setListOfEntries] = useState([]);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		axios.get(`/players/${playercode}`).then((response) => {
			if (response.status === 204) {
				navigate('/404-error', { state: { from: location }, replace: true });
			}
			setPlayer(response.data?.playerKey);
			setPlayerImage(response.data?.bio?.image_src);
			setPlayerInfo(response.data?.bio);
			setPlayerStats(response.data?.stats);

			if (response.data.playerKey) {
				axios.get(`/entries/byPlayer/${response.data.playerKey.id}`).then((response) => {
					setListOfEntries(response.data);
				});
			}
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
					<div className="player-category">
						<span>Nicknames: </span>
						<span className="player-category-text">{playerInfo.nicknames}</span>
					</div>
					<div className="player-category">
						<span>Position(s): </span>
						<span className="player-category-text">{playerInfo.positions}</span>
					</div>
					<div className="player-category">
						<span>Height/Weight: </span>
						<span className="player-category-text">{playerInfo.bmi}</span>
					</div>
					<div className="player-category">
						<span>DOB: </span>
						<span className="player-category-text">{playerInfo.dob}</span>
					</div>
					<div className="player-category">
						<span>Birthplace: </span>
						<span className="player-category-text">{playerInfo.birthplace}</span>
					</div>
					<div className="player-category">
						<span>Debut: </span>
						<span className="player-category-text">{playerInfo.debut}</span>
					</div>
					<div className="player-category">
						<span>Total Seasons: </span>
						<span className="player-category-text">{playerInfo.seasons}</span>
					</div>
					<div className="player-category">
						<span>Status: </span>
						<span className="player-category-text">{playerInfo.status}</span>
					</div>
				</div>
			</div>
			<div className="player-resume-container">
				<div className="player-resume-teams">
					<span>Teams: </span>
					<span className="player-category-text">{playerInfo.teams}</span>
				</div>
				<div className="player-resume-awards">
					<span>Accolades: </span>
					<span className="player-category-text">{playerInfo.awards}</span>
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
								<td>{playerStats.g}</td>
								<td>{playerStats.pts_per_g}</td>
								<td>{playerStats.trb_per_g}</td>
								<td>{playerStats.ast_per_g}</td>
								<td>{playerStats.stl_per_g}</td>
								<td>{playerStats.blk_per_g}</td>
								<td>{playerStats.fg_pct}</td>
								<td>{playerStats.fg3_pct}</td>
								<td>{playerStats.ft_pct}</td>
								<td>{playerStats.tov_per_g}</td>
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
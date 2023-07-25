import './UserProfile.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import jwt_decode from 'jwt-decode';
import axios from '../../api/axios';
import EntriesTable from '../../components/EntriesTable/EntriesTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faScrewdriverWrench, faBasketball, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function Profile() {
	const { auth } = useAuth();
	const decodedUsername = auth?.accessToken
		? jwt_decode(auth.accessToken).UserInfo?.username
		: undefined;

	let { username } = useParams();
	const [user, setUser] = useState({});
	const [listOfEntries, setListOfEntries] = useState([]);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		axios.get(`/users/${username}`).then((response) => {
			if (response.status === 204) {
				navigate('/404-error', { state: { from: location }, replace: true });
			}
			response.data.createdAt = response.data.createdAt.split('T')[0];
			setUser(response.data);
		});

		axios.get(`/entries/byUser/${user.id}`).then((response) => {
			setListOfEntries(response.data);
		});
	}, [username, user]);

	return (
		<div className="profile-page">
			<div className="user-profile-container">
				<div className="user-profile-picture">
					<span className="image-placeholder"></span>
				</div>
				<div className="user-profile-info">
					<div className="user-profile-name">
						<span className="user-profile-username">{user.username}</span>
						<div className="user-profile-role">
							{user.role === "user"
								? <FontAwesomeIcon className="icon-role" title="User" icon={faBasketball} />
								: user.role === "mod"
									? <FontAwesomeIcon className="icon-role" title="Mod" icon={faHammer} />
									: <FontAwesomeIcon className="icon-role" title="Admin" icon={faScrewdriverWrench} />
							}
						</div>
					</div>
					<div className="user-profile-date">
						<span className="user-date-header">Member Since:</span>
						<span className="user-date-text">{user.createdAt}</span>
					</div>
					{(decodedUsername === username) &&
						<div className="user-profile-edit" onClick={() => console.log("Editing profile")}>
							<FontAwesomeIcon className="icon-edit" icon={faPenToSquare} />
							<span>Edit Profile</span>
						</div>
					}
				</div>
			</div>
			<EntriesTable header="Submitted Songs" entries={listOfEntries} />
		</div>
	)
}

export default Profile;
import './UserProfile.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import EntriesTable from '../../components/EntriesTable/EntriesTable';

function Profile() {
	let { username } = useParams();
	const [user, setUser] = useState({});
	const [listOfEntries, setListOfEntries] = useState([]);

	useEffect(() => {
		axios.get(`/users/${username}`).then((response) => {
			setUser(response.data);
		});

		axios.get(`/entries/byUser/${user.id}`).then((response) => {
			setListOfEntries(response.data);
		});
	}, [username, user.id]);

	return (
		<div className="profile-page">
			<div>{user.username}</div>
			<div>{user.role}</div>
			<div className="user-profile-container">
				
			</div>
			<EntriesTable header="Submitted Songs" entries={listOfEntries}/>
		</div>
	)
}

export default Profile;
import './Admin.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faScrewdriverWrench, faBasketball } from '@fortawesome/free-solid-svg-icons';

function Admin() {
	const effectRan = useRef(false);
	const [users, setUsers] = useState([]);
	const [success, setSuccess] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [changedUser, setChangedUser] = useState("");
	const [changedRole, setChangedRole] = useState("");
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getUsers = async () => {
			try {
				const response = await axiosPrivate.get('/users', {
					signal: controller.signal
				});

				console.log(response.data);
				isMounted && setUsers(response.data);
			}
			catch (err) {
				console.error(err);
				navigate('/login', { state: { from: location }, replace: true });
			}
		}

		if (effectRan.current) {
			getUsers();
		}

		return () => {
			isMounted = false;
			controller.abort();
			effectRan.current = true;
		}
	}, []);

	const handleIconClick = async (id) => {
		try {
			await axiosPrivate.put(`/users/mod/${id}`, {},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).then((response) => {
				setChangedUser(response.data.username);
				setChangedRole(response.data.role);
				setErrMsg("");
				setSuccess(true);
			});
		}
		catch (err) {
			if (!err?.response) {
				setErrMsg('No server response');
			}
			else {
				setErrMsg(err.response?.data?.message);
			}
		}
	};

	return (
		<div className="admin-page">
			{success ? (
				<>
                    <div className="success-text">{changedUser} has been assigned as a {changedRole}.</div>
                    <button className="navigate-button" onClick={() => navigate(0)}>Back to Admin</button>
				</>
			) : (
				<>
					<div className="admin-page-description">
						<div>This is the admin page.</div>
						<div>Check the list of users and assign them different roles.</div>
					</div>
					<p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
					<div className="users-table-header-container">
						<span className="users-table-header">Users</span>
						<button>Sort Button</button>
					</div>
					<table className="users-table">
						<thead>
							<tr>
								<th>#</th>
								<th className="users-table-name-header">Name</th>
								<th className="users-table-since-header">User Since</th>
								<th className="users-table-total-header">Total Entries</th>
								<th>Role</th>
							</tr>
						</thead>
						<tbody>
							{users.map((value) => {
								return (
									<tr key={value.id}>
										<td></td>
										<td>{value.username}</td>
										<td>{value.createdAt.split('T')[0]}</td>
										<td>0</td>
										<td>
											<div onClick={() => handleIconClick(value.id)}>
												{value.role === "user"
													? <FontAwesomeIcon className="icon-role" icon={faBasketball} />
													: value.role === "mod"
														? <FontAwesomeIcon className="icon-role" icon={faHammer} />
														: <FontAwesomeIcon className="icon-role" icon={faScrewdriverWrench} />
												}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</>
			)}
		</div>
	)
}

export default Admin;
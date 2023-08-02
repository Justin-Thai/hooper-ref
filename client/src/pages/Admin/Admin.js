import './Admin.css';
import Modal from '../../components/Modal/Modal';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { sortItemsByCat } from '../../util/Utils';
import useClickOutside from '../../hooks/useClickOutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faScrewdriverWrench, faBasketball } from '@fortawesome/free-solid-svg-icons';

function Admin() {
	const effectRan = useRef(false);
	const [success, setSuccess] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [users, setUsers] = useState([]);

	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	const [openModal, setOpenModal] = useState(false);
	const [changedId, setChangedId] = useState(-1);
	const [changedUser, setChangedUser] = useState("");
	const [changedRole, setChangedRole] = useState("");

	const categories = ["id", "username", "createdAt", "numEntries", "role"]
	const [sortDropdown, setSortDropdown] = useState(false);
	const sortElement = document.getElementById("dropdown-options");
	let domNode = useClickOutside(() => { setSortDropdown(false); });

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

	let sortHandler = (event) => {
		const option = event.target;
		if (option.matches("#dropdown-options li")) {
			const index = Array.prototype.indexOf.call(option.parentElement.children, option);
			const currentIsAscending = option.classList.contains("li-sort-asc");

			const sorted = sortItemsByCat(users, categories, index, !currentIsAscending);
			setUsers(sorted);

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

	const openConfirmation = (id) => {
		setOpenModal(true);
		setChangedId(id);
	}

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
						<span className="users-table-header">Users ({users.length})</span>
						<div ref={domNode} className="dropdown">
							<button className="dropbtn" onClick={openSortDropdown}>Sort By</button>
							<ul
								className={sortDropdown ? "dropdown-content-active" : "dropdown-content"}
								onClick={() => setSortDropdown(false)}
								id="dropdown-options"
							>
								<li className="li-sort-asc">Default</li>
								<li>Name</li>
								<li>User Since</li>
								<li>Total Entries</li>
								<li>Role</li>
							</ul>
						</div>
					</div>
					<table className="users-table">
						<thead>
							<tr>
								<th>#</th>
								<th className="users-table-name">Name</th>
								<th className="users-table-since">User Since</th>
								<th className="users-table-total">Total Entries</th>
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
										<td>{value.numEntries}</td>
										<td>
											<div onClick={() => openConfirmation(value.id)}>
												{value.role === "user"
													? <FontAwesomeIcon className="icon-role" title="User" icon={faBasketball} />
													: value.role === "mod"
														? <FontAwesomeIcon className="icon-role" title="Mod" icon={faHammer} />
														: <FontAwesomeIcon className="icon-role" title="Admin" icon={faScrewdriverWrench} />
												}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{openModal && <Modal closeModal={setOpenModal} continueAction={() => handleIconClick(changedId)} />}
				</>
			)}
		</div>
	)
}

export default Admin;
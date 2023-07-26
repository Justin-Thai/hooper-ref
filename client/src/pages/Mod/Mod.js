import './Mod.css';
import Modal from '../../components/Modal/Modal';
import FormModal from '../../components/FormModal/FormModal';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { sortItemsByCat } from '../../util/Utils';
import useClickOutside from '../../hooks/useClickOutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faCirclePlus, faCircleMinus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function Mod() {
    const effectRan = useRef(false);
    const [errMsg, setErrMsg] = useState("");
    const [subs, setSubs] = useState([]);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const [addModal, setAddModal] = useState(false);
    const [removeModal, setRemoveModal] = useState(false);
    const [added, setAdded] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [selectedId, setSelectedId] = useState(-1);
    const [formData, setFormData] = useState({});

    const categories = ["id", "song", "artist", "player", "user", "createdAt"];
    const [sortDropdown, setSortDropdown] = useState(false);
    const sortElement = document.getElementById("dropdown-options");
    let domNode = useClickOutside(() => { setSortDropdown(false); });

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getSubs = async () => {
            try {
                const response = await axiosPrivate.get('/submissions', {
                    signal: controller.signal
                });
                isMounted && setSubs(response.data);
            }
            catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        if (effectRan.current) {
            getSubs();
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

            const sorted = sortItemsByCat(subs, categories, index, !currentIsAscending);
            setSubs(sorted);

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

    const openAddModal = (value) => {
        setAddModal(true);
        setSelectedId(value.id);
        setFormData(value);
    };

    const handleAddClick = async (data) => {
        const playerData = { name: data.player, playerCode: data.playerCode };
        const entryData = {
            song: data.song,
            artist: data.artist,
            album: data.album,
            year: data.year,
            excerpt: data.excerpt,
            link: data.link,
            UserId: data.userId,
        };

        try {
            // Add player if not in database
            await axiosPrivate.post('/players', playerData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            ).then((response) => {
                entryData.PlayerId = response.data.id;

                // Add entry to database
                axiosPrivate.post('/entries', entryData,
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
            });

            // Remove submission from database
            await axiosPrivate.delete(`/submissions/${data.subId}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setErrMsg("");
            setAdded(true);
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

    const openRemoveModal = (id) => {
        setRemoveModal(true);
        setSelectedId(id);
    };

    const handleRemoveClick = async (id) => {
        try {
            await axiosPrivate.delete(`/submissions/${id}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            ).then((response) => {
                setErrMsg("");
                setRemoved(true);
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
        <div className="mod-page">
            {added
                ? (
                    <>
                        <div className="success-text">Submission has been added to archive.</div>
                        <button className="navigate-button" onClick={() => navigate(0)}>Back to Mod</button>
                    </>
                )
                : removed
                    ? (
                        <>
                            <div className="success-text">Submission has been removed.</div>
                            <button className="navigate-button" onClick={() => navigate(0)}>Back to Mod</button>
                        </>
                    )
                    : (
                        <>
                            <div className="mod-page-description">
                                <div>Hello moderators!</div>
                                <div>Review the list of submissions and approve/reject the submissions accordingly.</div>
                                <div>If you are unsure about a submission, please reach out to an admin.</div>
                            </div>
                            <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
                            <div className="subs-table-header-container">
                                <span className="subs-table-header">Submissions ({subs.length})</span>
                                <div ref={domNode} className="dropdown">
                                    <button className="dropbtn" onClick={openSortDropdown}>Sort By</button>
                                    <ul
                                        className={sortDropdown ? "dropdown-content-active" : "dropdown-content"}
                                        onClick={() => setSortDropdown(false)}
                                        id="dropdown-options"
                                    >
                                        <li className="li-sort-asc">Default</li>
                                        <li>Song</li>
                                        <li>Artist</li>
                                        <li>Player</li>
                                        <li>User</li>
                                        <li>Sent On</li>
                                    </ul>
                                </div>
                            </div>
                            <table className="subs-table">
                                <thead>
                                    <tr>
                                        <th className="subs-table-number">#</th>
                                        <th className="subs-table-song">Song</th>
                                        <th className="subs-table-artist">Artist(s)</th>
                                        <th className="subs-table-player">Player</th>
                                        <th className="subs-table-link">Link</th>
                                        <th className="subs-table-user">User</th>
                                        <th className="subs-table-date">Sent On</th>
                                        <th className="subs-table-action">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subs.map((value) => {
                                        return (
                                            <tr key={value.id}>
                                                <td></td>
                                                <td>{value.song}</td>
                                                <td>{value.artist}</td>
                                                <td>{value.player}</td>
                                                {value.link
                                                    ? (
                                                        <td className="subs-link">
                                                            <div onClick={() => {
                                                                window.open(value.link, "_blank");
                                                            }}>
                                                                <FontAwesomeIcon icon={faSpotify} className="icon-spotify" />
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <td className="subs-link">
                                                            <FontAwesomeIcon icon={faCircleXmark} className="icon-none" />
                                                        </td>
                                                    )}
                                                <td>{value.user}</td>
                                                <td>{value.createdAt.split('T')[0]}</td>
                                                <td className="subs-action">
                                                    <div onClick={() => openAddModal(value)}>
                                                        <FontAwesomeIcon icon={faCirclePlus} className="circle-button" />
                                                    </div>
                                                    <div onClick={() => openRemoveModal(value.id)}>
                                                        <FontAwesomeIcon icon={faCircleMinus} className="circle-button" />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {removeModal && <Modal closeModal={setRemoveModal} continueAction={() => handleRemoveClick(selectedId)} />}
                            {addModal && <FormModal closeModal={setAddModal} continueAction={(entryData) => handleAddClick(entryData)} parentToChild={formData} />}
                        </>
                    )
            }
        </div >
    )
}

export default Mod;
import './NavBar.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SidebarData } from './SidebarData';
import useClickOutside  from '../../hooks/useClickOutside';
import useAuth from '../../hooks/useAuth';
import NavButtonsAuth from './NavButtonsAuth';
import NavButtonsNoAuth from './NavButtonsNoAuth';

function NavBar() {
    const { auth } = useAuth();
    const [sidebar, setSidebar] = useState(false);

    const openSidebar = () => { setSidebar(!sidebar); }

    let domNode = useClickOutside(() => {
        setSidebar(false);
    });

    let navigate = useNavigate();

    return (
        <div>
            <div ref={domNode} className="navbarContainer">
                <Link to="#" className="menuBars">
                    <FontAwesomeIcon icon={faBars} onClick={openSidebar} />
                </Link>
                <span className="pageTitle" onClick={() => navigate(`/`)}>HooperRef</span>
                {auth?.accessToken ? <NavButtonsAuth /> : <NavButtonsNoAuth />}
            </div>
            <nav className={sidebar ? "navMenuActive" : "navMenu"}>
                <ul className="navMenuItems" onClick={openSidebar}>
                    <li className="navbarToggle">
                        <Link to="#" className="menuBars">
                            <FontAwesomeIcon icon={faXmark} />
                        </Link>
                    </li>
                    {SidebarData.map((value, index) => {
                        return (
                            <li key={index} className={value.cName}>
                                <Link to={value.path}>
                                    {value.icon}
                                    <span className="menuOptionTitle">{value.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    )
}

export default NavBar;



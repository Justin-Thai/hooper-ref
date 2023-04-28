import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faUser, faLightbulb, faBoxArchive, faHammer } from '@fortawesome/free-solid-svg-icons';

export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: <FontAwesomeIcon icon={faHouseChimney} />,
        cName: "navText",
    },
    {
        title: "Profile",
        path: "/",
        icon: <FontAwesomeIcon icon={faUser} />,
        cName: "navText",
    },
    {
        title: "Suggest",
        path: "/suggest",
        icon: <FontAwesomeIcon icon={faLightbulb} />,
        cName: "navText",
    },
    {
        title: "Archive",
        path: "/archive",
        icon: <FontAwesomeIcon icon={faBoxArchive} />,
        cName: "navText",
    },
    {
        title: "Admin",
        path: "/",
        icon: <FontAwesomeIcon icon={faHammer} />,
        cName: "navText",
    },
];
import './Archive.css';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import EntriesTable from '../../components/EntriesTable/EntriesTable';

function Archive() {
    const [listOfEntries, setListOfEntries] = useState([]);
    const [numPlayers, setNumPlayers] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3001/entries").then((response) => {
            setListOfEntries(response.data);
        });

        axios.get("http://localhost:3001/entries/playerCount").then((response) => {
            setNumPlayers(response.data[0].playerCounter);
        });
    }, []);


    return (
        <div className="archive-page">
            <div className="archive-description">
                <div>This is the complete HooperRef archive. </div>
                <div>
                    There are a total of {listOfEntries.length} song entries
                    and {numPlayers} players referenced.
                </div>
            </div>
            <EntriesTable header="Archive Entries" entries={listOfEntries} />
        </div>
    );
}

export default Archive;
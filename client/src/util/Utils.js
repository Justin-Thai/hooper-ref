import { useEffect, useRef } from 'react';

/* 
 * Checks if a click is inside or outside the HTML element
*/
const useClickOutside = (handler) => {
    let domNode = useRef();

    useEffect((event) => {
        let clickHandler = (event) => {
            if(!domNode.current.contains(event.target)) {
                handler();
            }
        };

        document.addEventListener("click", clickHandler);
        
        return () => {
            document.removeEventListener("click", clickHandler);
        };
    });

    return domNode;
}

/*
 * Sorts a list of entries based on the indicated category
 * 
 * @param {Array} entries The list to be sorted
 * @param {number} index The category (indicated by the index) used to sort the list
 * @param {boolean} asc Determines the sorting order
*/
function sortEntriesByCat(entries, index, asc = true) {
    const orderModifier = asc ? 1 : -1;
    const categories = ["id", "song", "artist", "album", "year", "player"];
    const cat = categories[index];

    entries.sort((a, b) => {
        const elementA = a[cat]; 
        const elementB = b[cat];

        return elementA > elementB ? (1 * orderModifier) : (-1 * orderModifier);
    });
}

export { useClickOutside, sortEntriesByCat };
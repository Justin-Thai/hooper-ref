import { useEffect, useRef } from 'react';

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

export default useClickOutside;
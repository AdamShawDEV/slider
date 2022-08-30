import { useState, useEffect } from 'react';

function getWindowDimentions() {
    const { innerHeight: height, innerWidth: width } = window;

    return { width, height };
}

function useWindowDimensions() {
    const [windowDimentions, setWindowDimentions] = useState(getWindowDimentions());

    useEffect(() => {
        function handleResize() {
            setWindowDimentions(getWindowDimentions);
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return { windowDimentions };
}

export default useWindowDimensions;
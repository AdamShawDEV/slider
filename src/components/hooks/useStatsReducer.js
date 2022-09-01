import { useReducer } from "react";

const initialStats = {
    gamesPlayed: 0,
    bestTimes: {},
};

function statsReducer(state, action) {

    const { type, time, picture, puzzleType, showNums, numMoves } = action;

    const key = `${picture}-${puzzleType}-${showNums ? 'nums' : 'noNums'}`;

    switch (type) {
        case 'logGame':
            if (state?.bestTimes[key] && state.bestTimes[key].time < time) {
                return state;
            }
            const newState = {
                gamesPlayed: state.gamesPlayed + 1,
                bestTimes: {
                    ...state.bestTimes, [key]: {
                        time,
                        picture,
                        puzzleType,
                        showNums,
                        numMoves,
                    }
                },
            };
            localStorage.setItem('statistics', JSON.stringify(newState));
            return newState;
        default:
            console.log('invalid action in stats');
    }


    return state;
}

function initStats(initialStats) {
    let stats = {};
    try {
        stats = JSON.parse(localStorage.getItem('statistics')) ?? initialStats;
    } catch {
        console.log('unable to parse statistics from local storage');
        stats = initialStats
    }
    return stats;
}

function useStatsReducer() {
    const [stats, statsDispatch] = useReducer(statsReducer, initialStats, initStats);

    return {stats, statsDispatch};
}

export default useStatsReducer;
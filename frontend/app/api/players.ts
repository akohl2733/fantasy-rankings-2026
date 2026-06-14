import { HistoricalPlayer } from "../interfaces/historical";
import { mainLogger } from "../lib/log";


export async function fetchPlayers(token: string){
    const logger = mainLogger.getSubLogger({ name: 'fetchPlayers' })
    try {
        const res = await fetch("http://localhost:8000/players", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            throw new Error(`There was an error on fetching: ${res.status}`);
        }

        const data = await res.json();

        logger.info("Players fetched from backend", data);

        return data;
    }
    catch (e: any) {
        logger.error("Fetching of players failed", e);
    }
};


export async function getPlayerByRank(rank: string) {
    const logger = mainLogger.getSubLogger({ name: "getPlayerByRank" });
    if (!rank) {
        logger.warn("No valid player rank provided to 'getPlayerByRank'");
        return
    }

    try {
        const res = await fetch(`http://localhost:8000/players/${rank}`);
        if (!res.ok) {
            throw new Error(`There was an error: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        const error = err as Error;
        logger.error("There was an error fetching player by ranking", error);
        console.error("There was an error fetching player by ranking", error);
    }
    return [];
}


// Hit `/search_results` endpoint for getting player by similar name
export async function getPlayersBySimilarName(playerName: string | null) {
    const logger = mainLogger.getSubLogger({ name: 'getPlayersBySimilarName' });
    if (!playerName) {
        logger.warn("No name provided to 'getPlayersBySimilarName'");
        return
    }
    try {
        const res = await fetch(`http://localhost:8000/search_results?name=${playerName}`)
        if (!res.ok) {
            throw new Error(`There was an Error: ${res.status}`);
        }
        const playerList = await res.json();

        logger.info("Players with similar names fetch successful", playerList);
        
        return playerList
    } catch (e: any) {
        logger.error("Error fetching players by similar names", e);
        console.error("Error on fetching.");
    }
}

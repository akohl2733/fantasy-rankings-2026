import { Player } from "../components/PlayerCard";
import { HistoricalPlayer } from "../historical/HistoricalPlayers";
import { mainLogger } from "../lib/log";


export async function fetchPlayers(){
    const logger = mainLogger.getSubLogger({ name: 'fetchPlayers' })
    try {
        const res = await fetch("http://localhost:8000/players");
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

// Hits the /historical endpoint for list of all player data
export async function getHistoricalPlayers(): Promise<HistoricalPlayer[]> {
    const logger = mainLogger.getSubLogger({ name: "getHistoricalPlayers" });
    try {
        const res = await fetch("http://localhost:8000/historical");
        if (!res.ok) {
            throw new Error(`There was a problem fetching historical player data: ${res.status}`);
        }

        const data = await res.json();

        logger.info("Historical player data fetched.", data.length);
        return data;
    } catch (error) {
        const err = error as Error;
        logger.error("Error fetching historical player data", err);
        console.error("Error fetching historical player data", err);
    }
    return [];
}

export async function getSimilarHistoricalPlayers(playerName: string | null): Promise<HistoricalPlayer[]> {
    const logger = mainLogger.getSubLogger({ name: "getSimilarHistoricalPlayers" });
    try {
        const res = await fetch(`http://localhost:8000/historical/similar_name?name=${playerName}`);
        if (!res.ok) {
            throw new Error(`There was a problem fetching historical player data: ${res.status}`);
        }

        const data = await res.json();

        logger.info("Similarly named historical players fetched.", data.length);
        return data;
    } catch (error) {
        const err = error as Error;
        logger.error("Error fetching similarly named historical player data", err);
        console.error("Error fetching similarly named historical player data", err);
    }
    return [];
}

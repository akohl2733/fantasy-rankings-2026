import { Player } from "../components/PlayerCard";


export async function fetchPlayers(){
    try {
        const res = await fetch("http://localhost:8000/players");
        if (!res.ok) {
            throw new Error(`There was an error on fetching: ${res.status}`);
        }
        const data = await res.json();
        return data;
    }
    catch (e: any) {
        console.error("There was an error:", e);
    }
};


// Hit `/search_results` endpoint for getting player by similar name
export async function getPlayersBySimilarName(playerName: string | null) {
    if (!playerName) {
        console.log("No name provided");
        return
    }
    try {
        const res = await fetch(`http://localhost:8000/search_results?name=${playerName}`)
        if (!res.ok) {
            throw new Error(`There was an Error: ${res.status}`);
        }
        const playerList = await res.json();
        
        return playerList
    } catch {
        console.error("Error on fetching.");
    }
}
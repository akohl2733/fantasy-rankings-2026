import { useEffect, useState } from "react";
import PlayerToken from "./PlayerToken";

interface Player {
    id: number;
    rank: number;
    name: string;
    position: string;
    position_rank: number;
    team: string;
    receptions: number;
    receiving_yards: number;
    receiving_tds: number;
    rushing_yards: number;
    rushing_tds: number;
    passing_yards: number;
    passing_tds: number;
    turnovers: number;
    total_points: number;
    tier: number;
}

export default function getPlayerInfo() {
    const [ players, setPlayers ] = useState<Player[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>("");

    useEffect(() => {
        async function getPlayers() {
            try {
                const response = await fetch("http://localhost:8000/players");
                if (!response.ok) {
                    throw new Error(`Error on fetching data: ${response.status}`)
                }
                const clean_response = await response.json();
                setPlayers(clean_response);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        getPlayers();
    }, [])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return <div>There was an error.</div>
    }

    return (
        <>
            <div>
                {players.map((value, index) => (
                    <PlayerToken key={index} player={value} />
                ))}
            </div>
        </>
    )
}
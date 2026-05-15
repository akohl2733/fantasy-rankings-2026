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

export default function PlayerInfo({id} : {id: number}) {
    const [ player, setPlayer ] = useState<Player | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>("");

    const wrNames = ["Justin Jefferson", "Jamarr Chase", "Ceedee Lamb"];

    const reduceName = (nameList: string[]) => {
        return nameList.reduce((accumulator: Record<string, number>, currVal: string, i) => {
            accumulator[currVal] = i + 1;
            return accumulator;
        }, {})
    }

    const newNames = reduceName(wrNames);


    useEffect(() => {
        async function getPlayer() {
            try {
                const response = await fetch(`http://localhost:8000/players/${id}`);
                if (!response.ok) {
                    throw new Error(`Error on fetching data: ${response.status}`)
                }
                const clean_response = await response.json();
                setPlayer(clean_response);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        getPlayer();
    }, [])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return <div>There was an error: {error}</div>
    }

    return (
        <>
            <div>
                {player && <PlayerToken player={player} />}
                <div className='bg-black'>
                    {Object.entries(newNames).map(([name, idx]) => (
                        <p key={idx}>{name}</p>
                    ))}
                </div>
            </div>
        </>
    )
}
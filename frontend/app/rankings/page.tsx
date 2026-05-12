'use client';
import { useState, useEffect } from 'react';
import PlayerCard from '../components/PlayerCard';

export default function allPlayers() {
    const [ players, setPlayers ] = useState<Player[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        
        async function fetchPlayers(){
            try {
                const res = await fetch("http://localhost:8000/players");
                if (!res.ok) {
                    throw new Error(`There was an error on fetching: ${res.status}`);
                }
                const data = await res.json();
                setPlayers(data);
            }
            catch (e: any) {
                console.error("There was an error:", e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayers();
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>There was an error.</div>
    }
    return (
        <>
            <div className="flex justify-center w-full">
                <PlayerCard players={players}/>
            </div>
        </>
    )
}
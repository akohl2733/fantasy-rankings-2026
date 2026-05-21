'use client';
import { useState, useEffect } from 'react';
import PlayerCard from '../components/PlayerCard';
import { fetchPlayers } from '../api/players';
import { Player } from '../components/PlayerCard';

export default function allPlayers() {
    const [ players, setPlayers ] = useState<Player[]>([]);


    useEffect(() => {
        const getPlayerData = async () => {
            const res = await fetchPlayers();
            setPlayers(res);
        }
        getPlayerData()
    }, [])

    
    return (
        <>
            <div className="flex justify-center w-full">
                <PlayerCard players={players}/>
            </div>
        </>
    )
}
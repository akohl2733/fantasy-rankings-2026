'use client';

import { useState, useEffect } from 'react';
import RankingCard from '../components/RankingCard';
import { fetchPlayers } from '../api/players';
import { Player } from '../interfaces/rankings';

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
                <RankingCard players={players}/>
            </div>
        </>
    )
}
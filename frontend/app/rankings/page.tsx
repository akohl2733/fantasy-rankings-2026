'use client';

import { useState, useEffect } from 'react';
import RankingCard from '../components/RankingCard';
import { fetchPlayers } from '../api/players';
import { Player } from '../interfaces/rankings';
import { useAuth } from '@clerk/nextjs';

export default function allPlayers() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [ players, setPlayers ] = useState<Player[]>([]);


    useEffect(() => {
        const getPlayerData = async () => {
            const token = await getToken();
            if (token) {
                const res = await fetchPlayers(token);
                setPlayers(res);
            }
        }
        getPlayerData()
    }, [isLoaded, isSignedIn, getToken])

    
    return (
        <>
            <div className="flex justify-center w-full">
                <RankingCard players={players}/>
            </div>
        </>
    )
}
'use client';

import { useEffect, useRef, useState } from 'react';
import { getPlayersBySimilarName } from '../api/players';
import PlayerCard, { Player } from '../components/PlayerCard';

export default function PlayerSearchBar() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [ playerName, setPlayerName ] = useState<string>("")
    const [ players, setPlayers ] = useState<Player[]>([])
    const [ selectedPlayer, setSelectedPlayer ] = useState<Player | null>(null)
    const [ isPending, setIsPending ] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const debouncedFetchRef = useRef<((name: string) => void) | null>(null)

    
    // initialize debounced function when component mounts
    useEffect(() => {
        debouncedFetchRef.current = (name: string) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (!name.trim()) {
                setPlayers([]);
                return;
            }

            timerRef.current = setTimeout(async() => {
                try {
                    const res = await getPlayersBySimilarName(name);
                    setPlayers(res);
                } catch (error) {
                    console.error("Failed to fetch players:", error);
                }
            }, 300)
        };
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, []);


    // call search_result endpoint if playerName changes
    useEffect(() => {
        if (debouncedFetchRef.current) {
            debouncedFetchRef.current(playerName);
        }
    }, [playerName])


    // when typing starts, remove pending field and setPlayerName to new input
    const handleInputChange = (e: string) => {
        setIsPending(false);
        setPlayerName(e);
    }


    // Focus to input if button is clicked
    const clickBehavior = () => {
        inputRef.current?.focus();
    }


    // when player is selected, prevent dropdown from showing
    const onSelectPlayerClick = (selectedPlayer: Player) => {
        setSelectedPlayer(selectedPlayer);
        setPlayers([]);
    }


    return (
        <>
            <div className='flex gap-10 justify-center'>
                <div>
                    <input 
                        ref={inputRef}
                        type='text'
                        value={playerName}
                        onChange={(e) => handleInputChange(e.target.value)} 
                        placeholder='ex. Justin Jettas'
                        className="border-md border-black rounded-md bg-sky-200 text-gray-600 p-5 min-w-90 max-h-15"/>
                    {players.length > 0 && <div className="border border-gray-400 rounded-md">
                        {!isPending && players.map((player, idx) => {
                            return <button key={idx} id={`${idx}`} onClick={() => onSelectPlayerClick(player)}>{player.name}</button>
                        })}
                    </div>
                    }
                </div>
                <button 
                    onClick={(e) => clickBehavior()}
                    className='border-md border-black rounded-md bg-gray-600 text-white px-3 text-sm max-h-15'
                >
                        Start typing a player's name...
                </button>
            </div>
            <div className='flex justify-center items-center w-full border-2 border-red-200'>
                <div className="flex items-center border border-green-200">
                    {selectedPlayer && <PlayerCard players={[selectedPlayer]} />}
                </div>
            </div>
        </>
    )
}
'use client';

import { useEffect, useRef, useState } from 'react';
import { getSimilarHistoricalPlayers } from '../api/players';
import { HistoricalPlayer } from '../Historical/HistoricalPlayers';
import { HistoricalPlayerCard } from '../components/HistoricalPlayerCard';

export default function PlayerSearchBar() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [ playerName, setPlayerName ] = useState<string>("")
    const [ players, setPlayers ] = useState<HistoricalPlayer[]>([])
    const [ selectedPlayer, setSelectedPlayer ] = useState<HistoricalPlayer | null>(null)
    const [ isPending, setIsPending ] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const debouncedFetchRef = useRef<((name: string) => void) | null>(null)

    
    // initialize debounced function when component mounts
    useEffect(() => {
        // set this function to debouncedFetchRef
        debouncedFetchRef.current = (name: string) => {

            // clear any existing timeout
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (!name.trim()) {
                setPlayers([]);
                return;
            }

            // try and get the players after 300 ms of no clicking
            timerRef.current = setTimeout(async() => {
                try {
                    const res = await getSimilarHistoricalPlayers(name);
                    setPlayers(res);
                } catch (error) {
                    console.error("Failed to fetch players:", error);
                }
            }, 300)
        };
        // lazy loaded callback - run cleanup function when finished (cannot use normal if block)
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, []); // do this on mount only


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
        setSelectedPlayer(null)
    }


    // Focus to input if button is clicked
    const clickBehavior = () => {
        inputRef.current?.focus();
    }


    // when player is selected, prevent dropdown from showing
    const onSelectPlayerClick = (selectedPlayer: HistoricalPlayer) => {
        setSelectedPlayer(selectedPlayer);
        setPlayers([]);
    }


return (
        <>
            <div className="flex flex-col gap-12 w-full py-6">
                
                <div className='flex gap-4 justify-center items-start w-full'>
                    <div className="relative">
                        <input 
                            ref={inputRef}
                            type='text'
                            value={playerName}
                            onChange={(e) => handleInputChange(e.target.value)} 
                            placeholder='ex. Justin Jefferson'
                            className="border border-gray-400 rounded-md bg-sky-200 text-gray-600 p-4 min-w-90 h-15 focus:outline-none"/>
                        {players.length > 0 && !isPending && (
                            <div className="absolute left-0 right-0 mt-1 border border-gray-400 rounded-md bg-white flex flex-col z-50 max-h-60 overflow-y-auto shadow-lg">
                                {players.map((player, idx) => (
                                    <button 
                                        key={player.id || idx} 
                                        id={`${idx}`} 
                                        onClick={() => onSelectPlayerClick(player)}
                                        className="w-full text-left p-3 text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-0 text-lg transition-colors"
                                    >
                                        {player.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => clickBehavior()}
                        className='border border-black rounded-md bg-gray-600 text-white px-4 h-15 text-sm font-medium hover:bg-gray-700 transition-colors'
                    >
                        Start typing a player's name...
                    </button>
                </div>
                    <div className='w-full flex justify-center'>
                    {selectedPlayer && <HistoricalPlayerCard players={[selectedPlayer]}/>}
                </div>

            </div>
        </>
    )
}
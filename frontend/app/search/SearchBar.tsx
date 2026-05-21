'use client';

import { useEffect, useRef, useState } from 'react';
import { getPlayersBySimilarName } from '../api/players';

export default function PlayerSearchBar() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [ playerName, setPlayerName ] = useState<string>("")
    const [ playerNames, setPlayerNames ] = useState<string[]>([])

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const debouncedFetchRef = useRef<((name: string) => void) | null>(null)

    
    // initialize debounced function when component mounts
    useEffect(() => {
        debouncedFetchRef.current = (name: string) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (!name.trim()) {
                setPlayerNames([]);
                return;
            }

            timerRef.current = setTimeout(async() => {
                try {
                    const res = await getPlayersBySimilarName(name);
                    setPlayerNames(res);
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


    // Focus to input if button is clicked
    const clickBehavior = () => {
        inputRef.current?.focus();
    }


    return (
        <>
            <div className='flex gap-10 justify-center'>
                    <input 
                        ref={inputRef}
                        type='text'
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)} 
                        placeholder='ex. Justin Jettas'
                        className="border-md border-black rounded-md bg-sky-200 text-gray-600 p-5 min-w-90"/>
                    <button 
                        onClick={(e) => clickBehavior()}
                        className='border-md border-black rounded-md bg-gray-600 text-white p-2 text-sm'
                    >
                            Start typing a player's name...
                    </button>
            </div>
            <div>
                {playerNames && playerNames.map((name, idx) => {
                    return <div key={idx} className='text-black'>{name}</div>
                })}
            </div>
        </>
    )
}
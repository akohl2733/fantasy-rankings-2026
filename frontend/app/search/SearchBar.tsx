'use client';

import React, { useRef, useState, useEffect } from 'react';
import PlayerInfo from './PlayerInfo';

export default function PlayerSearchBar() {
    const nameRef = useRef<HTMLInputElement>(null);
    const amtRenders = useRef(1);
    const [ playerId, setPlayerId ] = useState<string>("");
    const [ submittedId, setSubmittedId ] = useState<number | null>(null)

    const clickBehavior = () => {
        nameRef.current?.focus();
    }

    useEffect(() => {
        amtRenders.current = amtRenders.current + 1;
    })

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const playerIdNumber = parseInt(playerId);
        if (!isNaN(playerIdNumber)) {
            setSubmittedId(playerIdNumber)
        }
    }

    return (
        <>
            <div className='flex-grid'>
                <form onSubmit={handleSubmit}>
                    <input 
                        ref={nameRef}
                        value={playerId} 
                        type='text'
                        onChange={(e) => setPlayerId(e.target.value)} />
                    <button onClick={(e) => clickBehavior()}>Click Me</button>
                </form>
                <h1>{amtRenders.current}</h1>
                {submittedId && <PlayerInfo id={submittedId}/>}
            </div>
        </>
    )
}
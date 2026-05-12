'use client';

import { useRef, useState, useEffect } from 'react';

export default function PlayerSearchBar() {
    const nameRef = useRef<HTMLInputElement>(null);
    const amtRenders = useRef(1);
    const [ playerName, setPlayerName ] = useState<string>("");

    const clickBehavior = () => {
        nameRef.current?.focus();
    }

    useEffect(() => {
        amtRenders.current = amtRenders.current + 1;
    })

    return (
        <>
            <div className='flex-grid'>
                <input 
                    ref={nameRef}
                    value={playerName} 
                    type='text'
                    onChange={(e) => setPlayerName(e.target.value)}>
                </input>
                <button onClick={(e) => clickBehavior()}>Click Me</button>
                <h1>{amtRenders.current}</h1>
            </div>
        </>
    )
}
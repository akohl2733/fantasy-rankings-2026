'use client';
import React, { useEffect, useState } from "react";
import { getHistoricalPlayers } from "../api/players";
import HistoricalPlayerCard from "./HistoricalPlayerCard";
import { mainLogger } from "../lib/log";

export interface HistoricalPlayer {
    id: number,
    name: string,
    position: string,
    headshot_url: string,
    data: [season_data]
}

type season_data = {
    id: number,
    player_id: number,
    season: number,
    team: string,
    targets: number,
    target_share: number,
    receptions: number,
    receiving_yards: number,
    receiving_tds: number,
    carries: number,
    rushing_yards: number,
    rushing_tds: number,
    passing_yards: number,
    passing_tds: number,
    turnovers: number,
    points_per_game: number,
    total_points: number,
    rank_ppg: number,
    rank_total: number,
    position_tier: number,
}

export type position = 'All' | 'QB' | 'WR' | 'RB' | 'TE';

export default function HistoricalPlayers() {
    const [ historicalPlayers, setHistoricalPlayers ] = useState<HistoricalPlayer[]>([]);
    const [ positionSelect, setPositionSelect ] = useState<position>('All');

    useEffect(() => {
        async function getPlayers() {
            const players = await getHistoricalPlayers();
            setHistoricalPlayers(players);
        }

        getPlayers();
    }, []);

    const handleClick = (e: any) => {
        const value = e.currentTarget.textContent;
        console.log("button clicked", value);
        setPositionSelect(value);
    }

    return (
        <div>
            <div className="flex gap-10 p-10 text-xl font-semibold">
                <button onClick={handleClick}>All</button>
                <button onClick={handleClick}>QB</button>
                <button onClick={handleClick}>RB</button>
                <button onClick={handleClick}>WR</button>
                <button onClick={handleClick}>TE</button>
            </div>
            <HistoricalPlayerCard players={historicalPlayers} position={positionSelect}/>
        </div>
    )
}
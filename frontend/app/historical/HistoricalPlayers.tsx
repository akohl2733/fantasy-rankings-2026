'use client';
import { useEffect, useState } from "react";
import { getHistoricalPlayers } from "../api/players";
import HistoricalPlayerCard from "./HistoricalPlayerCard";

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

export default function HistoricalPlayers() {
    const [ historicalPlayers, setHistoricalPlayers ] = useState<HistoricalPlayer[]>([]);

    useEffect(() => {
        async function getPlayers() {
            const players = await getHistoricalPlayers();
            setHistoricalPlayers(players);
        }

        getPlayers();
    }, []);

    return (
        <div>
            {historicalPlayers.map((p, idx) => (
                <HistoricalPlayerCard key={idx} player={p}/>
            ))}
        </div>
    )
}
import { HistoricalPlayer, position } from "./historical";

export interface Player {
    id: number;
    rank: number;
    name: string;
    position: position;
    position_rank: number;
    team: string;
    receptions: number | null;
    receiving_yards: number | null;
    receiving_tds: number | null;
    rushing_yards: number | null;
    rushing_tds: number | null;
    passing_yards: number | null;
    passing_tds: number | null;
    turnovers: number | null;
    total_points: number | null;
    tier: number | null;
    historical_player_id: number | null;
    historical_profile: HistoricalPlayer | null;
}
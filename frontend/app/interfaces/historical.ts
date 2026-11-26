export interface HistoricalPlayer {
    id: number,
    name: string,
    position: position,
    headshot_url: string,
    data: season_data[]
}

export interface season_data {
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
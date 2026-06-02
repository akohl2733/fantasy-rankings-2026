export interface Player {
    id: number;
    rank: number;
    name: string;
    position: string;
    position_rank: number;
    team: string;
    receptions: number;
    receiving_yards: number;
    receiving_tds: number;
    rushing_yards: number;
    rushing_tds: number;
    passing_yards: number;
    passing_tds: number;
    turnovers: number;
    total_points: number;
    tier: number;
}

export default function PlayerCard({ players }: { players: Player[] }) {
    return (
        <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-18 justify-center">
            {players.map((p, id) => {
                return (
                    <div key={id} className="bg-sky-200 text-gray-600 text-2xl font-bold py-6 px-10 mb-2 rounded min-w-64">
                        <div>{p.rank}</div>
                        <div>{p.name}</div>
                        <div>{p.position}</div>
                        <div>{p.team}</div>
                        <div>{p.tier}</div>
                    </div>
                )
            })}
        </div>
    )
}
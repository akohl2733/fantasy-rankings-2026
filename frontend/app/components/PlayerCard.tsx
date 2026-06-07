export interface Player {
    id: number;
    rank: number;
    name: string;
    position: string;
    position_rank: number;
    team: string;
    receptions: number | undefined;
    receiving_yards: number | undefined;
    receiving_tds: number | undefined;
    rushing_yards: number | undefined;
    rushing_tds: number | undefined;
    passing_yards: number | undefined;
    passing_tds: number | undefined;
    turnovers: number | undefined;
    total_points: number | undefined;
    tier: number | undefined;
}

export default function PlayerCard({ players }: { players: Player[] }) {
    return (
        <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-18 justify-center">
            {players?.map((p, id) => {
                return (
                    <div key={id} className="bg-sky-200 text-gray-600 text-2xl font-bold py-6 px-10 mb-2 rounded min-w-64">
                        <div>Crick Rank: {p.rank}</div>
                        <div>{p.name}</div>
                        <div>{p.position}</div>
                        <div>{p.team}</div>
                        <div>Positional Tier: {p.tier}</div>
                    </div>
                )
            })}
        </div>
    )
}
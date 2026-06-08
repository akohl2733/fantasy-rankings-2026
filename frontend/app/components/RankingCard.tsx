import { HistoricalPlayer, position } from "../interfaces/historical";
import { Player } from "../interfaces/rankings";

export default function RankingCard({ players }: { players: Player[] }) {
    return (
        <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-18 justify-center">
            {players?.map((p, id) => {
                return (
                    <div key={id} className={`${getColor(p.position)} text-gray-600 text-2xl font-bold py-6 px-10 mb-2 rounded min-w-64 border border-1.5 rounded-lg shadow-2xl`}>
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

function getColor(position: position) {
    switch (position) {
        case "QB":
            return "bg-yellow-300";
        case "RB":
            return "bg-red-300";
        case "WR":
            return "bg-sky-300";
        case "TE":
            return "bg-green-300";
        default:
            return "bg-white";
    }
}
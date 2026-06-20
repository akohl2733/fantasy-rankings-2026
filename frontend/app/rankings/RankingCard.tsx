import { useEffect, useState } from "react";
import { position } from "../interfaces/historical";
import { Player } from "../interfaces/rankings";

export default function RankingCard({ players }: { players: Player[] }) {
    const [ selectedPosition, setSelectedPosition ] = useState<position>('All');

    function handleSelect(e: any) {
        console.log(e.target.value);
        setSelectedPosition(e.target.value as position);
    }

    const filteredPlayers = players?.filter(
        (p) => selectedPosition === 'All' || p.position === selectedPosition
    )

    return (
        <>
            <div className="mx-10 my-4 flex flex-col gap-2 max-w-xs">
                <label htmlFor="position" className="text-sm font-semibold text-gray-600">
                    Filter by Position:
                </label>
                {/* 3. Switched onSelect to onChange, set value to state anchor */}
                <select
                    id="position"
                    name="Pos"
                    value={selectedPosition}
                    onChange={handleSelect}
                    className="p-3 border rounded-md bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    <option value="All">All Players</option>
                    <option value="RB">RB</option>
                    <option value="WR">WR</option>
                    <option value="QB">QB</option>
                    <option value="TE">TE</option>
                </select>
            </div>
            <div className="flex-1 overflow-auto border border-gray-200 rounded-lg mx-10 my-5 max-h-[600px] shadow-xl bg-white">
                <table className='w-full border-collapse'>
                    <thead>
                        <tr className='bg-gray-200 text-gray-700 text-xl font-bold border-b border-gray-300'>
                            <th className="sticky top-0 z-10 bg-gray-200 text-left py-4 px-4 font-semibold shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]">Crick Rank</th>
                            <th className="sticky top-0 z-10 bg-gray-200 text-left py-4 px-4 font-semibold shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]">Name</th>
                            <th className="sticky top-0 z-10 bg-gray-200 text-left py-4 px-4 font-semibold shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]">Position</th>
                            <th className="sticky top-0 z-10 bg-gray-200 text-left py-4 px-4 font-semibold shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]">Team</th>
                            <th className="sticky top-0 z-10 bg-gray-200 text-left py-4 px-4 font-semibold shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]">Positional Tier</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPlayers?.map((p, id) => {
                            return (
                                /* 3. Removed invalid row margins/shadows, applied border-b for row separation */
                                <tr key={p.id || id} className={`${getColor(p.position)} text-gray-800 text-lg font-semibold hover:opacity-90 transition-opacity border-b border-gray-200/50`}>
                                    <td className="py-3 px-4 font-bold">{p.rank}</td>
                                    <td className='flex items-center gap-3 py-2 px-4'>
                                        <img 
                                            src={p.historical_profile?.headshot_url || "/fallback-player.png"} 
                                            alt={p.name}
                                            width={55} 
                                            height={55}
                                            className="object-contain rounded-full bg-white/20"
                                        /> 
                                        <span>{p.name}</span>
                                    </td>
                                    <td className="py-3 px-4">{p.position}</td>
                                    <td className="py-3 px-4">{p.team}</td>
                                    <td className="py-3 px-4 font-medium text-gray-700">Tier {p.tier}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

function getColor(position: position) {
    switch (position) {
        case "QB":
            return "bg-yellow-100 text-yellow-900";
        case "RB":
            return "bg-red-100 text-red-900";
        case "WR":
            return "bg-sky-100 text-sky-900";
        case "TE":
            return "bg-green-100 text-green-900";
        default:
            return "bg-white";
    }
}
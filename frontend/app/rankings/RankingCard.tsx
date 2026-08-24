import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { position } from "../interfaces/historical";
import { Player } from "../interfaces/rankings";

export default function RankingCard({ players }: { players: Player[] }) {
    const router = useRouter();
    const [ selectedPosition, setSelectedPosition ] = useState<position>('All');
    const [ selectedTier, setSelectedTier ] = useState(0);

    function handlePositionSelect(e: any) {
        console.log(e.target.value);
        setSelectedPosition(e.target.value as position);
    }

    function handleTierSelect(e: any) {
        const tier = Number(e.target.value)
        console.log(tier);
        setSelectedTier(tier)
    }

    const filteredPlayers = players?.filter(
        (p) => {
            const matchesPosition = selectedPosition === 'All' || p.position === selectedPosition;      
            const matchesTier = selectedTier === 0 || p.tier === selectedTier;

            return matchesPosition && matchesTier;
        }
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
                    onChange={handlePositionSelect}
                    className="p-3 border rounded-md bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    <option value="All">All Players</option>
                    <option value="RB">RB</option>
                    <option value="WR">WR</option>
                    <option value="QB">QB</option>
                    <option value="TE">TE</option>
                </select>
                <label htmlFor="position" className="text-sm font-semibold text-gray-600">
                    Filter by Player Tier:
                </label>
                <select
                    id="tier"
                    name="Tier"
                    value={selectedTier}
                    onChange={handleTierSelect}
                    className="p-3 border rounded-md bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    <option value={0}>All Tiers</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
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
                                <React.Fragment key={p.id || id}>
                                    {((p.rank === 1 || (p.rank - 1) % 12 === 0) && selectedPosition === 'All' && selectedTier === 0) &&
                                        <tr className={`${getColor(p.rank).header} font-bold text-center text-xl tracking-wide w-full`}>
                                            <td colSpan={5} className="py-2">
                                                --- Round {Math.round(p.rank / 12) + 1} ---
                                            </td>
                                        </tr>
                                    }
                                    <tr 
                                        onClick={() => router.push(`players/${p.rank}`)}
                                        className={`${getColor(p.rank).rows} text-gray-800 text-lg font-semibold hover:opacity-90 cursor-pointer transition-opacity border-b border-gray-200/50`}
                                    >
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
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

// function getColor(position: position) {
//     switch (position) {
//         case "QB":
//             return "bg-yellow-100 text-yellow-900";
//         case "RB":
//             return "bg-red-100 text-red-900";
//         case "WR":
//             return "bg-sky-100 text-sky-900";
//         case "TE":
//             return "bg-green-100 text-green-900";
//         default:
//             return "bg-white";
//     }
// }

function getColor(rank: number) {
    const round = Math.floor((rank - 1) / 12);
    switch (round) {
        case 0:
            return {
                header: "bg-sky-300 text-sky-900",
                rows: "bg-sky-100 text-sky-900"
            };
        case 1:
            return {
                header: "bg-red-300 text-red-900",
                rows: "bg-red-100 text-red-900"
            };
        case 2:
            return {
                header: "bg-pink-300 text-pink-900",
                rows: "bg-pink-100 text-pink-900"
            };
        case 3:
            return {
                header: "bg-green-300 text-green-900",
                rows: "bg-green-100 text-green-900"
            };
        case 4:
            return {
                header: "bg-orange-300 text-orange-900",
                rows: "bg-orange-100 text-orange-900"
            };
        case 5:
            return {
                header: "bg-purple-300 text-purple-900",
                rows: "bg-purple-100 text-purple-900"
            };
        case 6:
            return {
                header: "bg-yellow-300 text-yellow-900",
                rows: "bg-yellow-100 text-yellow-900"
            };
        default:
            return {
                header: "bg-gray-300 text-gray-900",
                rows: "bg-gray-100 text-gray-900"
            };
    }
}
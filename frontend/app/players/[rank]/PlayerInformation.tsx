
import { HistoricalPlayer } from "@/app/interfaces/historical";
import { Player } from "@/app/interfaces/rankings";

type PlayerType = {
    player: Player | null
}

export default function PlayerInformation(p: PlayerType) {

    return (
        <>
            <div className="grid justify-center">
                {p &&
                <div className="text-center">
                    <div className='flex items-center justify-center mb-6'>
                        <img 
                            src={p.player?.historical_profile?.headshot_url || "/fallback-player.png"} 
                            alt={p.player?.name}
                            width={205} 
                            height={205}
                            className="object-contain rounded-full bg-white/20"
                        /> 
                    </div>
                    <div className="text-3xl font-semibold">{p.player?.name}</div>
                    <div className="text-3xl font-semibold">{p.player?.position}&emsp;-&emsp;{p.player?.team}</div>
                    <br />
                    <div className="text-2xl text-gray-700">
                        <div><span className='font-bold'>Crick Rank: </span>{p.player?.rank}&emsp;&emsp;&emsp;<span className='font-bold'>Position Ranking: </span>{p.player?.position_rank}&emsp;&emsp;&emsp;<span className='font-bold'>Position Tier: </span>{p.player?.tier}</div>
                        <div><span className='font-bold'>Total Projected Points: </span> {p.player?.total_points}</div>
                        <div>
                            {returnSeasonData(p)}
                        </div>
                    </div>
                </div>
                }
            </div>
        </>
    )
}

function returnSeasonData(p: PlayerType) {
    if (!p.player?.historical_profile) {
        return <div className="text-2xl font-semibold">Rookie</div>
    }
    return (
        <div className="overflow-x-auto w-full mt-4 mb-8 border border-gray-200">
            <table className='w-full text-left border-collapse bg-white text-sm text-gray-500'>
                <thead className="bg-gray-50 font-medium text-xl text-gray-700 uppercase tracking-wider text-xs">
                    <tr>
                        <th className="px-10 py-6 border-b border-gray-200">Season</th>
                        <th className="px-10 py-6 border-b border-gray-200">HPPR PPG Finish</th>
                        <th className="px-10 py-6 border-b border-gray-200">HPPR Total Finish</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-lg">
                    {p.player?.historical_profile?.data.map((season, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-10 py-6 font-semibold text-gray-900 whitespace-nowrap">{season.season}</td>
                            <td className="px-10 py-6">#{season.rank_ppg}</td>
                            <td className="px-10 py-6">#{season.rank_total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        )
}
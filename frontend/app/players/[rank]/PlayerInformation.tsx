
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
                    <div className="text-3xl font-semibold">{p.player?.name}            {p.player?.position}</div>
                    <br />
                    <div className="text-xl text-gray-700">
                        <div>Rank: {p.player?.rank}</div>
                        <div>Position Ranking: {p.player?.position_rank}</div>
                        <div>Team: {p.player?.team}</div>
                        <div>Position Tier: {p.player?.tier}</div>
                        <div>Total Projected Points: {p.player?.total_points}</div>
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
        <div className="overflow-x-auto w-full mt-4 border border-gray-200">
            <table className='w-full text-left border-collapse bg-white text-sm text-gray-500'>
                <thead className="bg-gray-50 font-medium text-gray-700 uppercase tracking-wider text-xs">
                    <tr>
                        <th className="px-10 py-6 border-b border-gray-200">Season</th>
                        <th className="px-10 py-6 border-b border-gray-200">HPPR PPG Finish</th>
                        <th className="px-10 py-6 border-b border-gray-200">HPPR Total Finish</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
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
import { HistoricalPlayer } from "./historicalPlayers";

interface HistoricalPlayerCardProps {
    player: HistoricalPlayer,
}

export default function HistoricalPlayerCard({player}: HistoricalPlayerCardProps){

    return (
        <div>
            <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-18 justify-center">
                <div className="bg-sky-200 text-gray-600 text-2xl font-bold py-6 px-10 mb-2 rounded min-w-64">
                    <h1>
                        {player.name} - {player.position}
                    </h1>
                    <h3>
                        {player.data.map((szn, id) => (
                            <div key={id}>
                                <div>{szn.season}</div>
                                <div>{szn.rank_ppg}</div>
                                <div>{szn.rank_total}</div>
                                <div>{szn.position_tier}</div>
                            </div>
                        ))}
                    </h3>
                </div>
            </div>
        </div>
    )
}
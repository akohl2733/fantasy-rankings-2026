import { HistoricalPlayer, position } from "./HistoricalPlayers";

interface HistoricalPlayerCardProps {
    players: HistoricalPlayer[],
    position: position,
}

export default function HistoricalPlayerCard({players, position}: HistoricalPlayerCardProps){

    const filteredPlayers = players.filter(p => p.position == 'All' || p.position === position);

    return (
        <div>
            <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-18 justify-center">
                {filteredPlayers.map((p, idx) => {
                return (
                    <div key={idx}>
                    <div className="bg-sky-200 text-gray-600 text-2xl font-bold py-6 px-10 mb-2 rounded min-w-64">
                    <h1>
                        {p.name} - {p.position}
                    </h1>
                    <br />
                    <h3>
                        {p.data.map((szn, id) => (
                            <div key={id}>
                                <div>Season: {szn.season}</div>
                                <div>Ranking (PPG): {szn.rank_ppg}</div>
                                <div>Ranking (Total Points): {szn.rank_total}</div>
                                <div>Positional Tier: {p.position}{szn.position_tier}</div>
                                <br />
                            </div>
                        ))}
                    </h3>
                </div>
                </div>
                )}
            )}
            </div>
        </div>
    )
}
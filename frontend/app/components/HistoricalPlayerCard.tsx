import { HistoricalPlayer, position } from "../historical/HistoricalPlayers";

export interface HistoricalPlayerCardProps {
    players: HistoricalPlayer[],
    position?: position,
}

export function HistoricalPlayerCard({players, position}: HistoricalPlayerCardProps){

    let filteredPlayers: HistoricalPlayer[];

    if (position) { 
        filteredPlayers = players.filter(p => position == 'All' || p.position === position); 
    }
    else { 
        filteredPlayers = players; 
    }
        
    return (
        <div>
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
    )
}
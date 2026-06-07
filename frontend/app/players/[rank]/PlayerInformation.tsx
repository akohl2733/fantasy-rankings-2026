
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
                    <div className="text-3xl font-semibold">{p.player?.name}</div>
                    <br />
                    <div className="text-xl">
                        <div>Rank: {p.player?.rank}</div>
                        <div>Position: {p.player?.position}</div>
                        <div>Position Ranking: {p.player?.position_rank}</div>
                        <div>Team: {p.player?.team}</div>
                        <div>Position Tier: {p.player?.tier}</div>
                        <div>Total Projected Points: {p.player?.total_points}</div>
                    </div>
                </div>
                }
            </div>
        </>
    )
}
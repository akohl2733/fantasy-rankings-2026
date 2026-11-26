'use client';
import { getPlayerByRank } from "@/app/api/players";
import PlayerInformation from "./PlayerInformation"
import { Player } from "@/app/interfaces/rankings";

import { use, useEffect, useState } from "react"

type PageProps = { params: Promise<{ rank: string }> }

export default function PlayerPage({ params }: PageProps) {
    const unwrappedParams = use(params);
    const rank = unwrappedParams.rank;

    const [ player, setPlayer ] = useState<Player | null>(null);

    useEffect(() => {
        try {
            async function getPlayer() {
                const player = await getPlayerByRank(rank);
                if (player) {
                    setPlayer(player);
                }
            }
            getPlayer();
        } catch (e) {
            const err = e as Error;
            console.error("Issue in client fetching the data for single player.")
        }
    }, [rank])

    return (
        <>
            <PlayerInformation player={player} />
        </>
    )
}
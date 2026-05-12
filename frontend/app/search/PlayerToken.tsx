export default function PlayerToken({player} : { player: Player}) {
    return (
        <div className="grid grid-cols-3 gap-y-4 gap-x-8">
            <div className="bg-red-500 text-white py-4 px-8 mb-2 rounded">
                <div>{player.rank}</div>
                <div>{player.name}</div>
                <div>{player.position}</div>
                <div>{player.team}</div>
                <div>{player.tier}</div>
            </div>
        </div>
    )
}
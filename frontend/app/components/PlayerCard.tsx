export default function PlayerCard({players} : { players: Player[]}) {
    return (
        <div className="grid grid-cols-3 gap-y-4 gap-x-8">
            {players.map((p, id) => {
                return (
                    <div key={id} className="bg-red-500 text-white py-4 px-8 mb-2 rounded">
                        <div>{p.rank}</div>
                        <div>{p.name}</div>
                        <div>{p.position}</div>
                        <div>{p.team}</div>
                        <div>{p.tier}</div>
                    </div>
                )
            })}
        </div>
    )
}
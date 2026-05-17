export default function PlayerCard({players} : { players: Player[]}) {
    return (
        <div className="grid grid-cols-3 gap-y-8 gap-x-18">
            {players.map((p, id) => {
                return (
                    <div key={id} className="bg-sky-200 text-gray-600 text-2xl font-bold py-6 px-10 mb-2 rounded">
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
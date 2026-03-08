export default function PlayerCard({players} : { players: Player[]}) {
    return (
        <div>
            {players.map((p, id) => {
                return (
                    <div key={id} className="border-solid">
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
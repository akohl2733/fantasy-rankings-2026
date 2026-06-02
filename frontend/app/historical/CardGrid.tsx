import {HistoricalPlayerCard, HistoricalPlayerCardProps} from "../components/HistoricalPlayerCard";


export default function CardGrid({players, position}: HistoricalPlayerCardProps) {

    return (
        <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-18 justify-center">
            <HistoricalPlayerCard players={players} position={position}/>
        </div>
    )
}
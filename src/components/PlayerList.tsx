import { useRef, useState } from "react";
import { PositionColors, Positions, type PlayerStats } from "../model/stats";
import "../Style/PlayerList.css";

interface PlayerListProps {
    players: PlayerStats[];
    selectedPlayer: PlayerStats | null;
    onSelectPlayer: (player: PlayerStats) => void;
    onDeletePlayer: (playerName: string) => void;
    onEditPlayer: (player: PlayerStats) => void;
    onImportPlayers?: (players: PlayerStats[]) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
    players,
    selectedPlayer,
    onSelectPlayer,
    onDeletePlayer,
    onEditPlayer,
}) => {
    const [filter, setFilter] = useState<keyof typeof Positions | "">("");

    const filteredPlayers = filter
        ? players.filter((player) => player.position === filter)
        : players;
    const handleExportJSON = () => {
        const dataStr = JSON.stringify(players, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `players-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };




    return (
        <div className="player-list-container">
            <div className="player-list-header">
                <div className="import-export-buttons">
                    <h2>Saved players</h2>
                    <button
                        className="btn-export"
                        onClick={handleExportJSON}
                        disabled={players.length === 0}
                        title="Exportar jugadores a JSON"
                    >
                        ⬇ Export
                    </button>
                </div>

                <div className="filter-container">
                    <button
                        className={`filter-button ${filter === "" ? "active" : ""}`}
                        onClick={() => setFilter("")}
                        title="Show All Positions"
                    >
                        All
                    </button>
                    {Object.keys(Positions).map((posKey) => (
                        <button
                            key={posKey}
                            className={`filter-button ${filter === posKey ? "active" : ""}`}
                            style={{ backgroundColor: PositionColors[posKey as keyof typeof Positions] }}
                            onClick={() => setFilter(posKey as keyof typeof Positions)}
                            title={`Filter by ${Positions[posKey as keyof typeof Positions]}`}
                        >
                            {posKey}
                        </button>
                    ))}
                </div>

                <div className="filter-summary">
                    {filter === ""
                        ? "Showing all positions"
                        : ` ${filter} - ${Positions[filter]}`}
                    {` (${filteredPlayers.length})`}
                </div>

            </div>

            {players.length === 0 ? (
                <p className="empty-message">No saved players. Add one!</p>
            ) : (
                <div className="player-list">
                    {filteredPlayers.length === 0 && (
                        <p className="empty-message">No players in this filter.</p>
                    )}
                    {filteredPlayers.map((player) => (
                        <div
                            key={player.name}
                            className={`player-item ${selectedPlayer?.name === player.name ? "active" : ""
                                }`}
                            onClick={() => onSelectPlayer(player)}
                        >
                            <div className="player-info">
                                <h3>{player.name}</h3>

                                <h3 style={{ color: PositionColors[player.position as keyof typeof Positions] }}>{Positions[player.position]}</h3>
                                <p className="player-stats">

                                    Score: {(
                                        (
                                            (
                                                Number(player.mental) +
                                                Number(player.coachability) +
                                                Number(player.availability) +
                                                Number(player.communication) +
                                                Number(player.maturity) +
                                                Number(player.passing) +
                                                Number(player.positioning) +
                                                Number(player.decisionMaking) +
                                                Number(player.mechanics) +
                                                Number(player.awareness)
                                            ) / 10
                                        ) * 20
                                    ).toFixed(0)
                                    }%
                                </p>
                            </div>
                            <div className="player-actions">
                                <button
                                    className="btn-edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditPlayer(player);
                                    }}
                                    title="Editar jugador"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeletePlayer(player.name);
                                    }}
                                    title="Eliminar jugador"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlayerList;

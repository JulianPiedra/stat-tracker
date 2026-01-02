import { useRef } from "react";
import type { PlayerStats } from "../model/stats";
import "../Style/PlayerList.css";

interface PlayerListProps {
    players: PlayerStats[];
    selectedPlayer: PlayerStats | null;
    onSelectPlayer: (player: PlayerStats) => void;
    onDeletePlayer: (playerName: string) => void;
    onEditPlayer: (player: PlayerStats) => void;
    onImportPlayers: (players: PlayerStats[]) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
    players,
    selectedPlayer,
    onSelectPlayer,
    onDeletePlayer,
    onEditPlayer,
    onImportPlayers,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileRead = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                if (Array.isArray(importedData)) {
                    onImportPlayers(importedData);
                } else {
                    alert("Not a valid JSON format for players.");
                }
            } catch (error) {
                alert("Error reading the JSON file. Please ensure the format is correct.");
            }
        };
        reader.readAsText(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileRead(files[0]);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="player-list-container">
            <div className="player-list-header">
                <h2>Saved players</h2>
                <div className="import-export-buttons">
                    <button 
                        className="btn-export" 
                        onClick={handleExportJSON}
                        disabled={players.length === 0}
                        title="Exportar jugadores a JSON"
                    >
                        ⬇ Export
                    </button>
                </div>
            </div>

            {players.length === 0 ? (
                <p className="empty-message">No saved players. Add one!</p>
            ) : (
                <div className="player-list">
                    {players.map((player) => (
                        <div
                            key={player.name}
                            className={`player-item ${selectedPlayer?.name === player.name ? "active" : ""
                                }`}
                            onClick={() => onSelectPlayer(player)}
                        >
                            <div className="player-info">
                                <h3>{player.name}</h3>
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

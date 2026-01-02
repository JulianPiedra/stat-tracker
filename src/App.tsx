import { useState, useEffect } from 'react'
import './App.css'
import AddModal from './components/AddModal'
import PlayerList from './components/PlayerList'
import Chart from './components/Chart'
import type { PlayerStats } from './model/stats'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [players, setPlayers] = useState<PlayerStats[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<PlayerStats | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Cargar jugadores del localStorage al iniciar
  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    setPlayers(savedPlayers);
  }, []);

  const handleSavePlayer = (playerStats: PlayerStats) => {
    const updatedPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    setPlayers(updatedPlayers);
    setSelectedPlayer(playerStats);
    setEditingPlayer(null);
  };

  const handleEditPlayer = (player: PlayerStats) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleDeletePlayer = (playerName: string) => {
    const updatedPlayers = players.filter(p => p.name !== playerName);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    setPlayers(updatedPlayers);
    if (selectedPlayer?.name === playerName) {
      setSelectedPlayer(null);
    }
  };

  const handleImportPlayers = (importedPlayers: PlayerStats[]) => {
    // Create a map of existing players by name (lowercase for comparison)
    const existingPlayersMap = new Map(
      players.map(p => [p.name.toLowerCase(), p])
    );
    
    let updatedCount = 0;
    let addedCount = 0;
    
    // Process each imported player
    const processedPlayers = [...players];
    
    importedPlayers.forEach(importedPlayer => {
      const nameLower = importedPlayer.name.toLowerCase();
      const existingIndex = processedPlayers.findIndex(
        p => p.name.toLowerCase() === nameLower
      );
      
      if (existingIndex !== -1) {
        // Update existing player
        processedPlayers[existingIndex] = importedPlayer;
        updatedCount++;
      } else {
        // Add new player
        processedPlayers.push(importedPlayer);
        addedCount++;
      }
    });
    
    localStorage.setItem("players", JSON.stringify(processedPlayers));
    setPlayers(processedPlayers);
    
    // Show summary message
    const messages = [];
    if (addedCount > 0) messages.push(`${addedCount} new player(s) added`);
    if (updatedCount > 0) messages.push(`${updatedCount} player(s) updated`);
    
    if (messages.length > 0) {
      alert(messages.join(', '));
    } else {
      alert("No players were imported");
    }
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          handleImportPlayers(importedData);
        } else {
          alert("Not a valid JSON format for players.");
        }
      } catch (error) {
        alert("Error reading the JSON file. Please ensure the format is correct.");
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        handleFileRead(file);
      } else {
        alert("Please drop a valid JSON file");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  return (
    <>
      <div 
        className={`app-container ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="global-drop-overlay">
            <div className="drop-message">
              📁 Drop JSON file to import players
            </div>
          </div>
        )}
        
        <header className="app-header">
          <h1>Stat Tracker</h1>
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
            + Add Player
          </button>
        </header>

        <div className="app-content">
          <div className="sidebar">
            <PlayerList
              players={players}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedPlayer}
              onDeletePlayer={handleDeletePlayer}
              onEditPlayer={handleEditPlayer}
              onImportPlayers={handleImportPlayers}
            />
          </div>

          <div className="main-content">
            <Chart playerStats={selectedPlayer} />
          </div>
        </div>

        <AddModal
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
          onSave={handleSavePlayer}
          editingPlayer={editingPlayer}
        />
      </div>
    </>
  )
}

export default App

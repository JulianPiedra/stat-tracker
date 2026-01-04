import { use, useEffect, useState } from "react";
import "../Style/Modal.css"
import { PositionColors, Positions, type PlayerStats } from "../model/stats";

interface AddModalProps {
    isOpen: boolean;
    closeModal?: () => void;
    onSave?: (playerStats: PlayerStats) => void;
    editingPlayer?: PlayerStats | null;
}



const AddModal: React.FC<AddModalProps> = ({ isOpen, closeModal, onSave, editingPlayer }) => {
    const [formData, setFormData] = useState<PlayerStats>({
        name: "",
        position: "CB",
        mental: 0,
        coachability: 0,
        availability: 0,
        communication: 0,
        maturity: 0,
        passing: 0,
        positioning: 0,
        decisionMaking: 0,
        mechanics: 0,
        awareness: 0,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            if (editingPlayer) {
                // Si estamos editando, cargar los datos del jugador
                setFormData(editingPlayer);
            } else {
                // Si estamos agregando, limpiar el formulario
                setFormData({
                    name: "",
                    position: "CB",
                    mental: 0,
                    coachability: 0,
                    availability: 0,
                    communication: 0,
                    maturity: 0,
                    passing: 0,
                    positioning: 0,
                    decisionMaking: 0,
                    mechanics: 0,
                    awareness: 0,
                });
            }
            setErrors({});
        }
    }, [isOpen, editingPlayer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "value" ? parseFloat(value) || 0 : value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir/seleccionar
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Player name is required";
        }

        // Validar que al menos un campo tenga calificación
        const statsFields = Object.keys(formData).filter(key => key !== "name");
        const allRated = statsFields.every(key => (formData[key as keyof PlayerStats] as number));

        if (!allRated) {
            newErrors.general = "You must rate all skills before saving";
        }

        // Validar que los nombres no estén duplicados (solo si no estamos editando o si cambiamos el nombre)
        const players = JSON.parse(localStorage.getItem("players") || "[]");
        const isDuplicateName = players.some((p: PlayerStats) =>
            p.name.toLowerCase() === formData.name.trim().toLowerCase() &&
            (!editingPlayer || p.name.toLowerCase() !== editingPlayer.name.toLowerCase())
        );

        if (isDuplicateName) {
            newErrors.name = "A player with this name already exists";
        }

        // Si hay errores, no continuar
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Guardar en localStorage
        if (editingPlayer) {
            // Modo edición: actualizar el jugador existente
            const updatedPlayers = players.map((p: PlayerStats) =>
                p.name.toLowerCase() === editingPlayer.name.toLowerCase() ? formData : p
            );
            localStorage.setItem("players", JSON.stringify(updatedPlayers));
        } else {
            // Modo agregar: añadir nuevo jugador
            players.push(formData);
            localStorage.setItem("players", JSON.stringify(players));
        }

        // Llamar callback si existe
        if (onSave) {
            onSave(formData);
        }

        // Cerrar modal
        closeModal?.();
    };


    if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Player Name"
                                    value={formData.name}
                                    name="name"
                                    onChange={handleChange}
                                    className={`input ${errors.name ? 'input-error' : ''}`}
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>
                            <div className="input-wrapper">
                                <select
                                    id="position"
                                    value={formData.position}
                                    name="position"
                                    style={{ color: PositionColors[formData.position as keyof typeof Positions] }}
                                    onChange={handleChange}
                                    className={`input ${errors.position ? 'input-error' : ''}`}
                                >
                                    {Object.keys(Positions).map((posKey) => (

                                        <option key={posKey} value={posKey}
                                            style={{ color: PositionColors[posKey as keyof typeof Positions] }}>

                                            {Positions[posKey as keyof typeof Positions]}
                                        </option>
                                    ))}
                                </select>
                                {errors.position && <span className="error-message">{errors.position}</span>}
                            </div>
                            <button className="modal-close" aria-label="Cerrar modal" onClick={closeModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            {errors.general && (
                                <div className="general-error">
                                    {errors.general}
                                </div>
                            )}

                            {Object.keys(formData).slice(2, 12).map((key) => (
                                <div className="form-group" key={key}>
                                    <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                    <div className="rating-container">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <label key={i} className="rating-box">
                                                <input
                                                    type="radio"
                                                    value={String(i + 1)}
                                                    name={key}
                                                    onChange={handleChange}
                                                    checked={String(formData[key as keyof typeof formData]) === String(i + 1)}
                                                />
                                                <span className="rating-number">{i + 1}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors[key] && <span className="error-message">{errors[key]}</span>}
                                </div>
                            ))}

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    {editingPlayer ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddModal;
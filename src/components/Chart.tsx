import { useEffect, useState } from "react";
import type { PlayerStats } from "../model/stats";
import "../Style/Chart.css";

interface ChartProps {
    playerStats: PlayerStats | null;
}

const Chart: React.FC<ChartProps> = ({ playerStats }) => {
    const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([]);

    useEffect(() => {
        if (!playerStats) return;

        const canvas1 = document.getElementById("radarChart1") as HTMLCanvasElement;
        const canvas2 = document.getElementById("radarChart2") as HTMLCanvasElement;

        if (canvas1) drawRadarChart(canvas1, playerStats, "mental");
        if (canvas2) drawRadarChart(canvas2, playerStats, "passing");
    }, [playerStats]);

    const drawRadarChart = (
        canvas: HTMLCanvasElement,
        stats: PlayerStats,
        type: "mental" | "passing"
    ) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const data =
            type === "mental"
                ? {
                    labels: ["Mental", "Coachability", "Availability", "Communication", "Maturity"],
                    values: [stats.mental, stats.coachability, stats.availability, stats.communication, stats.maturity],
                    color: "rgba(79, 70, 229, 0.3)",
                    strokeColor: "#4f46e5",
                }
                : {
                    labels: ["Passing", "Positioning", "Decision Making", "Mechanics", "Awareness"],
                    values: [stats.passing, stats.positioning, stats.decisionMaking, stats.mechanics, stats.awareness],
                    color: "rgba(124, 58, 237, 0.3)",
                    strokeColor: "#7c3aed",
                };
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        const numAxes = data.labels.length;
        const angleSlice = (Math.PI * 2) / numAxes;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar rejilla
        for (let i = 1; i <= 5; i++) {
            const currentRadius = (radius / 5) * i;
            ctx.beginPath();
            ctx.strokeStyle = "#e0e0e0";
            ctx.lineWidth = 1;

            for (let j = 0; j < numAxes; j++) {
                const angle = angleSlice * j - Math.PI / 2;
                const x = centerX + currentRadius * Math.cos(angle);
                const y = centerY + currentRadius * Math.sin(angle);

                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Dibujar ejes
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        for (let i = 0; i < numAxes; i++) {
            const angle = angleSlice * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // Dibujar datos
        ctx.fillStyle = data.color;
        ctx.strokeStyle = data.strokeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < numAxes; i++) {
            const angle = angleSlice * i - Math.PI / 2;
            const value = Math.min(data.values[i] || 0, 5);
            const r = (radius / 5) * value;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dibujar puntos
        ctx.fillStyle = data.strokeColor;
        for (let i = 0; i < numAxes; i++) {
            const angle = angleSlice * i - Math.PI / 2;
            const value = Math.min(data.values[i] || 0, 5);
            const r = (radius / 5) * value;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dibujar etiquetas
        ctx.fillStyle = "#333";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < numAxes; i++) {
            const angle = angleSlice * i - Math.PI / 2;
            const x = centerX + (radius + 30) * Math.cos(angle);
            const y = centerY + (radius + 30) * Math.sin(angle);

            ctx.fillText(data.labels[i], x, y);
        }

        // Dibujar escala
        ctx.fillStyle = "#999";
        ctx.font = "10px Arial";
        ctx.textAlign = "right";
        for (let i = 1; i <= 5; i++) {
            const currentRadius = (radius / 5) * i;
            const y = centerY - currentRadius;
            ctx.fillText(String(i), centerX - 10, y);
        }
    };

    if (!playerStats) {
        return (
            <div className="chart-container">
                <p>Select a player to view their radar charts</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h2>{playerStats.name}</h2>
            <div className="charts-grid">
                <div className="chart-wrapper">
                    <h3>Mental Skills</h3>
                    <canvas id="radarChart1" width="350" height="350"></canvas>
                </div>
                <div className="chart-wrapper">
                    <h3>Technical Skills</h3>
                    <canvas id="radarChart2" width="350" height="350"></canvas>
                </div>
            </div>
        </div>
    );
};

export default Chart;

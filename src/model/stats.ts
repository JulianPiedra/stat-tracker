
export interface PlayerStats {
  name: string;
  position: keyof typeof Positions;
  mental: number;
  coachability: number;
  availability: number;
  communication: number;
  maturity: number;
  passing: number;
  positioning: number;
  decisionMaking: number;
  mechanics: number;
  awareness: number;
}
export const Positions = {
  CB: 'Center Back',
  CDM: 'Central Defensive Midfielder',
  CAM: 'Central Attacking Midfielder',
  GK: 'Goalkeeper',
  ST: 'Striker',
}
export const PositionColors: { [key in keyof typeof Positions]: string } = {
  CB: "#f87171",
  CDM: "#60a5fa",
  CAM: "#34d399",
  GK: "#fbbf24",
  ST: "#a78bfa",
};


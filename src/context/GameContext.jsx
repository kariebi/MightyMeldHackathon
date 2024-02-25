import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState({ minutes: 0, seconds: 0 });
  const [currentScore, setCurrentScore] = useState(0);
  const [restart, setRestart] = useState(false);
  const [bgMute, setbgMute] = useState(false)
  const [SFXMute, setSFXMute] = useState(false)

  return (
    <GameContext.Provider value={{ currentTime, setCurrentTime, currentScore, setCurrentScore, restart, setRestart, bgMute, setbgMute, SFXMute, setSFXMute }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

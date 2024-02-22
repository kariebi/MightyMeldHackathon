import { useState } from "react";
import { StartScreen, PlayScreen, RestartModal } from "./Screens";

function App() {
  const [gameState, setGameState] = useState("start");
  const [showRestartModal, setShowRestartModal] = useState(false);

  const handleRestart = () => {
    setGameState("play");
    setShowRestartModal(false);
  };

  const handleMainMenu = () => {
    setGameState("start");
    setShowRestartModal(false);
  };

  const handleEnd = () => {
    setShowRestartModal(true);
  };

  return (
    <>
      <navbar className="flex justify-between items-center w-full h-16 bg-blue-500 text-white px-6 fixed top-0 left-0 z-50"></navbar>
      <div className="flex justify-center items-center w-screen h-screen">
        {gameState === "start" && (
          <StartScreen
            start={() => setGameState("play")}
            className="I cannot convert any existing Tailwind styles since there is no specific class or element provided."
          />
        )}
        {gameState === "play" && <PlayScreen end={handleEnd} />}
        <div
          className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 transition-all duration-200 ${
            showRestartModal
              ? "opacity-1 bg-opacity-70 scale-1"
              : "opacity-0 scale-0"
          } z-50`}
        >
          <div className={`${showRestartModal ? "scale-1" : "scale-0"}`}>
            <RestartModal
              onRestart={handleRestart}
              onMainMenu={handleMainMenu}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

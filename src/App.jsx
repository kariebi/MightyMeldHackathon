import { useState } from "react";
import { StartScreen, PlayScreen, RestartModal } from "./Screens";
import useSound from 'use-sound';
import backgroundSong from './sounds/bg_music.mp3';
import { useGame } from "./context/GameContext";

function App() {
  const { bgMute , setCurrentTime } = useGame()
  const [gameState, setGameState] = useState("start"); 
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [restartstate, setRestartState] = useState(false);
  const [playBackgroundSong, { stop, isPlaying }] = useSound(backgroundSong, { volume:!bgMute? 0.5:0, loop: true });
  const [intropage, setintropage] = useState(true)

  const handleRestart = () => {
    playBackgroundSong();
    setGameState("play");
    setShowRestartModal(false);
    setRestartState((prev) => !prev);
  };

  const handleMainMenu = () => {
    stop();
    setGameState("start");
    setShowRestartModal(false);
  };

  const handleStart = () => {
    stop()
    setCurrentTime({ minutes: 0, seconds: 0 })
    if (!isPlaying) {
      playBackgroundSong();
    }
    setGameState("play")
  }

  const handleEnd = () => {
    setShowRestartModal(true);
    stop();
  };

  return (
    <>
      <div className="flex justify-center bg-blue-600 items-center w-screen h-screen">
        {gameState === "start" && (
          <StartScreen
            start={handleStart}
            intropage={intropage}
            setintropage={setintropage}
            PlayBackgroundSound={playBackgroundSong}
            className="I cannot convert any existing Tailwind styles since there is no specific class or element provided."
          />
        )}
        {gameState === "play" && <PlayScreen end={handleEnd} restartstate={restartstate} toMainMenu={handleMainMenu} />}
        <>
          <div className={`${showRestartModal ? "block" : "hidden"} absolute bg-black bg-opacity-70 w-screen h-screen duration-0`}></div>
          <div className={`transition duration-500 ${showRestartModal ? "scale-1" : "scale-0"} absolute`}>
            <RestartModal
              onRestart={handleRestart}
              onMainMenu={handleMainMenu}
              restartstate={restartstate}
              RestartModalVisible={showRestartModal}
              stopbgMusic={stop}
            />
          </div>
        </>
      </div>
    </>
  );
}

export default App;

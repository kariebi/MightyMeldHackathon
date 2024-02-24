import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import Navbar from "./Navbar";
import { Tile } from "./Tile";
import goodSound from "./sounds/good.mp3";
import successSound from "./sounds/success.mp3";
import useSound from "use-sound";
import { useGame } from "./context/GameContext";
import { GiCardRandom } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex flex-col bg-pink-100 text-pink-500 justify-center text-center items-center rounded-xl w-[300px] sm:w-[400px]  sm:text-lg sm:h-[400px] font-semibold h-[300px] gap-[16px]">
      <h1 className="font-semibold text-3xl sm:text-[40px]">
        Memory
      </h1>
      <span className="font-normal">
        Flip over tiles looking for pairs
      </span>
      <button
        onClick={start}
        className="mt-[28px] text-lg text-white px-12 py-2 rounded-full bg-gradient-to-b from-pink-300 to-pink-600"
      >
        Play
      </button>
    </div>
  );
}

export function PlayScreen({ end, toMainMenu }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [playGoodSound] = useSound(goodSound);
  const [playSuccessSound] = useSound(successSound);
  const showTimer = Boolean(tiles)
  const { setCurrentTime, currentScore, setCurrentScore, restart, setRestart } = useGame();

  const calculateSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      return "60px";
    } else {
      return "100px";
    }
  };

  useEffect(() => {
    setCurrentScore(tryCount)
  }, [tryCount])

  useEffect(() => {
    if (restart) {
      reset();
      setRestart(false);
    }
  }, [restart]);

  const reset = () => {
    setTiles(null);
    setTryCount(0);
    setTimerResetKey((prevKey) => prevKey + 1);
    setCurrentTime({ minutes: 0, seconds: 0 });
  };

  useEffect(() => {
    if (tiles && tiles.every((tile) => tile.state === "matched")) {
      confetti({
        ticks: 1000,
      });
      setTimeout(() => {
        handleGameEnd();
      }, 1000);
    }
  }, [tiles]);

  const getTiles = (tileCount) => {
    // Throw an error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 300,
        });
        newState = "matched";
        playGoodSound();
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(() => {
              end();
              // Play 'success' sound on all tiles matched
              playSuccessSound();
            }, 1000);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  const handleGameEnd = () => {
    end();
    playSuccessSound();
  };

  function Timer() {
    const { currentTime } = useGame();

    return (
      <div className="text-blue-600 flex gap-1 items-center font-semibold text-xl">
        <IoMdTime />
        <span>
          {String(currentTime.minutes).padStart(2, "0")}:
          {String(currentTime.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }


  useEffect(() => {
    let interval;
    if (showTimer) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newSeconds = prevTime.seconds === 59 ? 0 : prevTime.seconds + 1;
          const newMinutes = newSeconds === 0 ? prevTime.minutes + 1 : prevTime.minutes;

          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [showTimer, setCurrentTime, restart]);

  return (
    <div className="flex justify-center flex-col items-center gap-6">
      <Navbar
        onRestart={() => reset()}
        onMainMenu={() => setShowConfirmationModal(true)}
        key={timerResetKey}
      />
      <div className="font-semibold items-center flex text-[18px] text-blue-600 sm:text-xl">
        <GiCardRandom />
        <span className="ml-2 bg-blue-300 px-2.5 py-[0.5px] rounded-[6px]">
          {tryCount}
        </span>
      </div>
      <div>
        {showTimer && <Timer />}
      </div>
      <div className="flex gap-2 rounded-xl sm:rounded-2xl flex-wrap bg-blue-100 py-[10px] sm:py-[20px] justify-center w-[285px] sm:w-[460px]">
        {getTiles(16).map((tile, i) => (
          <div
            key={i}
            style={{
              animation: `fadeIn 500ms ease-out ${i * 0.1}s forwards`,
              opacity: 0,
              scale: 0,
              transition: "0.5s ease-in-out",
            }}
          >
            <Tile
              key={i}
              flip={() => flip(i)}
              {...tile}
              size={calculateSize()}
            />
          </div>
        ))}
      </div>
      <button onClick={end}>End game</button>

      {/* Confirmation Modal */}
      <>
        <div className={`${showConfirmationModal ? "block" : "hidden"} absolute bg-black bg-opacity-70 w-screen h-screen duration-0`}></div>

        <div className={`transition duration-500 bg-white p-8 rounded-lg fixed text-center ${showConfirmationModal ? " scale-1" : "scale-0"}`}>
          <h2 className="text-2xl font-bold mb-4">Exit Game</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to exit the game?</p>
          <button
            onClick={() => {
              setShowConfirmationModal(false);
              toMainMenu();
            }}
            className="text-white px-4 py-2 rounded mr-4 bg-gradient-to-b from-blue-300 to-blue-600"
          >
            Yes
          </button>
          <button
            onClick={() => setShowConfirmationModal(false)}
            className="text-white px-4 py-2 rounded bg-gradient-to-b from-pink-300 to-pink-600"
          >
            No
          </button>
        </div>
      </>
    </div>
  );
}

export function RestartModal({ onRestart, onMainMenu, RestartModalVisible, setRestartState }) {
  const { setRestart, currentTime, currentScore } = useGame();

  const [message, setMessage] = useState({ header: "Congrats! 🥳", comment: "You won!" });
  const storedBestTime = parseInt(localStorage.getItem("bestTime"));
  const storedHighScore = parseInt(localStorage.getItem("highScore"));

  const didBeatBestTime = currentTime.minutes * 60 + currentTime.seconds < storedBestTime || isNaN(storedBestTime);
  const didBeatBestScore = currentScore < storedHighScore || isNaN(storedHighScore);

  useEffect(() => {
    if (RestartModalVisible) {
      if (didBeatBestTime && didBeatBestScore) {
        setMessage({ header: "Congratulations! 🥳", comment: "You're the fastest and most brilliant!" });
        localStorage.setItem("bestTime", currentTime.minutes * 60 + currentTime.seconds);
        localStorage.setItem("highScore", currentScore);
      } else if (didBeatBestTime) {
        localStorage.setItem("bestTime", currentTime.minutes * 60 + currentTime.seconds);
        setMessage({ header: "Congratulations! 🥳", comment: "You set a new best time" });
      } else if (didBeatBestScore) {
        localStorage.setItem("highScore", currentScore);
        setMessage({ header: "Congratulations! 🥳", comment: "You set a new best score!" });
      }
    }
  }, [RestartModalVisible, didBeatBestTime, didBeatBestScore, currentTime, currentScore]);

  const handleRestart = () => {
    onRestart();
    setRestart(true);
  };

  return (
    <div className={`bg-white p-8 rounded-lg text-center`}>
      <h2 className="text-2xl font-bold mb-4">{message.header}</h2>
      <p className="text-gray-600 mb-6">{message.comment}</p>
      <button
        onClick={handleRestart}
        className="text-white px-4 py-2 rounded mr-4 bg-gradient-to-b from-blue-300 to-blue-600"
      >
        Restart
      </button>
      <button
        onClick={onMainMenu}
        className="text-white px-4 py-2 rounded bg-gradient-to-b from-pink-300 to-pink-600"
      >
        Main Menu
      </button>
    </div>
  );
}

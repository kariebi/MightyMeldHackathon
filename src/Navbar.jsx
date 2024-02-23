import React, { useState, useEffect } from "react";

function Timer({ seconds, minutes }) {
  return (
    <div className="text-blue-600 font-semibold text-xl">
      Time: {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}

function Navbar({ onRestart, onMainMenu, showTimer, restartstate, setRestartState }) {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    let interval;

    if (showTimer) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds === 59 ? 0 : prevSeconds + 1;
          setMinutes((prevMinutes) => (newSeconds === 0 ? prevMinutes + 1 : prevMinutes));
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showTimer]);

  const resetTimer = () => {
    setSeconds(0);
    setMinutes(0);
  };

  useEffect(() => {
    if (restartstate) {
      resetTimer();
      setRestartState(false); // Ensure to set restartstate back to false after resetting the timer
    }
  }, [restartstate, setRestartState]);

  return (
    <div className="flex fixed top-0 justify-between items-center p-4 bg-blue-100 w-screen">
      <button onClick={onRestart} className="bg-blue-400 text-white px-4 py-2 rounded">
        Restart
      </button>
      <Timer seconds={seconds} minutes={minutes} />
      <button onClick={onMainMenu} className="bg-red-500 text-white px-4 py-2 rounded">
        Main Menu
      </button>
    </div>
  );
}

export default Navbar;

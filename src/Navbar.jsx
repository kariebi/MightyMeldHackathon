import { FaCrown } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";

function Navbar({ onRestart, onMainMenu }) {

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  return (
    <div className="flex fixed top-0 justify-between items-center p-4 bg-blue-100 w-screen">
      <button onClick={onRestart} className="bg-blue-400 text-white px-4 py-2 rounded">
        Restart
      </button>
      <div className="flex flex-col flex-grow">
        <div className="font-semibold flex justify-center items-center text-lg text-blue-600 sm:text-xl">
          <FaCrown />
          <span className="ml-2">
            {parseInt(localStorage.getItem("highScore")) || "--"}
          </span>
        </div>
        <div className="font-semibold flex justify-center items-center text-lg text-blue-600 sm:text-xl">
          <MdAccessTimeFilled />
          <span className="ml-2">
            {
              isNaN(parseInt(localStorage.getItem("bestTime"))) ?
                "--:--" :
                formatTime(parseInt(localStorage.getItem("bestTime")))
            }
          </span>
        </div>
      </div>
      <button onClick={onMainMenu} className="bg-red-500 text-white px-4 py-2 rounded">
        Main Menu
      </button>
    </div>
  );
}

export default Navbar;

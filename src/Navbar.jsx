import { FaCrown } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import mouseclickSound from "./sounds/mouse_click.mp3"
import useSound from "use-sound";

function Navbar({ onRestart, onMainMenu }) {
  const [PlayClickSound] = useSound(mouseclickSound, { volume: 0.5 })

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  return (
    <div className="flex fixed top-0 justify-between items-center  bg-white/85 backdrop-blur-md w-screen">
      <button onClick={() => {
        PlayClickSound();
        onRestart();
      }} className="bg-blue-600 text-white px-4 py-2 m-2 rounded">
        Restart
      </button>
      <div className="flex flex-col flex-grow text-blue-600">
        <div className="font-semibold flex justify-center items-center text-lg  sm:text-xl">
          <FaCrown />
          <span className="ml-2">
            {parseInt(localStorage.getItem("highScore")) || "--"}
          </span>
        </div>
        <div className="font-semibold flex justify-center items-center text-lg  sm:text-xl">
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
      <button onClick={() => {
        PlayClickSound();
        onMainMenu();
      }} className="bg-red-500 m-2 text-white px-4 py-2 rounded">
        Main Menu
      </button>
    </div>
  );
}

export default Navbar;

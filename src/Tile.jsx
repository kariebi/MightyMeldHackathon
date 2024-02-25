import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import useSound from "use-sound";
import mouseclickSound from "./sounds/mouse_click.mp3"
import wooshSound from "./sounds/woosh.mp3";
import { useGame } from "./context/GameContext";

export function Tile({ content: Content, flip, state, size }) {
  const { SFXMute } = useGame();
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();
  const [PlayClickSound] = useSound(mouseclickSound, { volume: !SFXMute? 0.2:0 })
  const [playWoosh] = useSound(wooshSound, { volume: !SFXMute? 0.5:0 });

  const handleFlip = () => {
    if (!isAnimating && state !== "flipped" && state !== "matched") {
      flip();
      setIsAnimating(true);
      playWoosh();
      PlayClickSound()
      controls.start({ rotateY: state === "flipped" ? 0 : 180 });
    }
  };

  const commonStyles = {
    display: "inline-block",
    width: size,
    height: size,
    verticalAlign: "top",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div onClick={handleFlip} style={{ ...commonStyles, perspective: "1000px" }}>
      <motion.div
        style={{
          ...commonStyles,
          rotateY: state === "flipped" ? 0 : 180,
          transition: "transform 0.6s",
          transformStyle: "preserve-3d",
        }}
        initial={false}
        animate={controls}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {state === "start" && (
          <Back className={`flex rounded-md p-2.5 justify-center items-center w-full h-full bg-blue-400 text-center`} />
        )}
        {state === "flipped" && (
          <Front className={`flex justify-center p-2.5  rounded-md items-center w-full h-full bg-blue-500 text-white`}>
            <Content style={commonStyles} />
          </Front>
        )}
      </motion.div>
      {state === "matched" && (
        <Matched
          className={`flex translate-y-[-60px] p-2.5 sm:translate-y-[-100px] justify-center rounded-md items-center w-full h-full text-blue-600/20`}
          style={{
            ...commonStyles,
            transition: "opacity 0.6s",
            opacity: state === "matched" ? 1 : 0,
          }}
          state={state}
        >
          <Content style={commonStyles} />
        </Matched>
      )}
    </div>
  );
}

function Back({ className }) {
  return <motion.div className={className} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />;
}

function Front({ className, children }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

function Matched({ className, children, state }) {
  return (
    <div
      className={className}
      style={{
        transition: "opacity 1s",
        opacity: state === "matched" ? 1 : 0,
      }}
    >
      {children}
    </div >
  );
}

import { useState } from "react";
import "./App.scss";

function App() {
  const [debugText, setDebugText] = useState("");

  // Mapping of indexes to icons: start from banana in middle of initial position and then upwards
  const iconMap = [
      "banana",
      "seven",
      "cherry",
      "plum",
      "orange",
      "bell",
      "bar",
      "lemon",
      "melon",
    ],
    // Height of one icon in the strip
    icon_height = 79,
    // Number of icons in the strip
    num_icons = 9,
    // Max-speed in ms for animating one icon down
    time_per_icon = 100,
    // Holds icon indexes
    indexes = [0, 0, 0];

  /**
   * Roll one reel
   */
  const roll = (reel: HTMLElement, offset = 0) => {
    // Minimum of 2 + the reel offset rounds
    const delta =
      (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

    // Return promise so we can wait for all reels to finish
    return new Promise((resolve) => {
      const style = getComputedStyle(reel),
        // Current background position
        backgroundPositionY = parseFloat(
          style.getPropertyValue("background-position-y")
        ),
        // Target background position
        targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
        // Normalized background position, for reset
        normTargetBackgroundPositionY =
          targetBackgroundPositionY % (num_icons * icon_height);

      // Delay animation with timeout, for some reason a delay in the animation property causes stutter
      setTimeout(() => {
        // Set transition properties ==> https://cubic-bezier.com/#.41,-0.01,.63,1.09
        reel.style.transition = `background-position-y ${
          (8 + 1 * delta) * time_per_icon
        }ms cubic-bezier(.41,-0.01,.63,1.09)`;
        // Set background position
        reel.style.backgroundPositionY = `${
          backgroundPositionY + delta * icon_height
        }px`;
      }, offset * 150);

      // After animation
      setTimeout(() => {
        // Reset position, so that it doesn't get higher without limit
        reel.style.transition = `none`;
        reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
        // Resolve this promise
        resolve((delta % num_icons) as number);
      }, (8 + 1 * delta) * time_per_icon + offset * 150);
    });
  };

  const doSpin = () => {
    setDebugText("rolling...");

    const reelsList = document.querySelectorAll<HTMLElement>(".slots > .reel");

    Promise

      // Activate each reel, must convert NodeList to Array for this with spread operator
      .all([...reelsList].map((reel, i) => roll(reel, i)))

      // When all reels done animating (all promises solve)
      .then((deltas) => {
        // add up indexes
        deltas.forEach(
          (delta, i) =>
            (indexes[i] = (indexes[i] + (delta as number)) % num_icons)
        );
        setDebugText(indexes.map((i) => iconMap[i]).join(" - "));

        // Win conditions
        if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
          const winCls = indexes[0] == indexes[2] ? "win2" : "win1";
          document.querySelector(".slots")?.classList.add(winCls);
          setTimeout(
            () => document.querySelector(".slots")?.classList.remove(winCls),
            2000
          );
        }

        // // Again!
        // setTimeout(rollAll, 3000);
      });
  };

  return (
    <>
      <div className="slots">
        <div className="reel"></div>
        <div className="reel"></div>
        <div className="reel"></div>
      </div>

      <button type="button" id="spin-button" onClick={doSpin}>
        Spin
      </button>

      <div id="debug" className="debug">
        {debugText}
      </div>

      <img
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "auto",
        }}
        src="https://assets.codepen.io/439000/slotreel.webp"
      />
    </>
  );
}

export default App;

import React, { useState } from "react";
import MazeControl from "./mazeControl";

const MazeConfigControl = ({ type, width, height, delay }) => {
  const [state, setState] = useState({
    type: type || "grid",
    width: width || 10,
    height: height || 10,
    delay: delay || 100,
  });

  const onWidth = (e) => {
    setState({ ...state, width: e.target.value });
  };

  const onHeight = (e) => {
    setState({ ...state, height: e.target.value });
  };

  const onDelay = (e) => {
    setState({ ...state, delay: e.target.value });
  };

  const onRedraw = () => {
    setState({ ...state, grid: [] }); // Re-rendering is triggered by state update
  };

  return (
    <div className="maze-controller">
      <form>
        <fieldset>
          <label htmlFor="width">Width</label>
          <input
            type="text"
            placeholder="Columns"
            id="width"
            value={state.width}
            onChange={onWidth}
          />
          <label htmlFor="height">Height</label>
          <input
            type="text"
            placeholder="Rows"
            id="height"
            value={state.height}
            onChange={onHeight}
          />
          <label htmlFor="delay">Step Delay: {state.delay}ms</label>
          <input
            type="range"
            min="1"
            max="1000"
            value={state.delay}
            onChange={onDelay}
            class="slider"
            id="delay"
          />
          <div className="center">
            <input
              className="button button-outline"
              type="button"
              value="Redraw"
              disabled={!state.width || !state.height}
              onClick={onRedraw}
            />
          </div>
        </fieldset>
      </form>

      <MazeControl
        width={state.width}
        height={state.height}
        grid={state.grid}
        type={state.type}
        delay={state.delay}
      />
    </div>
  );
};

export default MazeConfigControl;

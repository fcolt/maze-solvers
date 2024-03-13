import React, { useState } from "react";
import MazeControl from "./mazeControl";

const MazeConfigControl = ({ type, width, height }) => {
  const [state, setState] = useState({
    type: type || "grid",
    width: width || 10,
    height: height || 10,
  });

  const onWidth = (e) => {
    setState({ ...state, width: e.target.value });
  };

  const onHeight = (e) => {
    setState({ ...state, height: e.target.value });
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
      />
    </div>
  );
};

export default MazeConfigControl;

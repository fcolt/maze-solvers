import React, { useState, useEffect } from "react";
import { MazeManager } from "./managers/mazeManager.js";

const CELL_TYPE_TO_JSX = {
  [MazeManager.CELL.OPEN]: <div className="cell open"></div>,
  [MazeManager.CELL.CLOSED]: <div className="cell closed"></div>,
  [MazeManager.CELL.CLEAR]: <div className="clear"></div>,
};

const MazeControl = (props) => {
  const [grid, setGrid] = useState([]);
  const [width, setWidth] = useState(props.width);
  const [height, setHeight] = useState(props.height);

  const redraw = () => {
    MazeManager.initialize(width, height);

    if (!props.type) {
      return;
    }

    if (props.type.toLowerCase() === "ascii") {
      setGrid(MazeManager.toString());
    } else {
      setGrid(
        MazeManager.gridElements().map((cell) => {
          return CELL_TYPE_TO_JSX[cell];
        })
      );
    }
  };

  useEffect(() => {
    MazeManager.initialize(width, height);
    redraw();
  }, [props.grid, props.type]);

  useEffect(() => {
    setWidth(props.width);
    setHeight(props.height);
  }, [props.width, props.height]);

  return (
    <div className="maze center">
      <div
        className={
          props.type && props.type.toLowerCase() === "ascii" ? "pre" : ""
        }
      >
        {grid}
      </div>
    </div>
  );
};

export default MazeControl;

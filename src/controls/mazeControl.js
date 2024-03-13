import React, { useState, useEffect } from "react";
import MazeGenerator from "./managers/mazeGenerator.js";
import MazeSolver from "./managers/mazeSolver.js";

const CELL_TYPE_TO_JSX = {
  [MazeGenerator.CELL.OPEN]: <div className="cell open"></div>,
  [MazeGenerator.CELL.CLOSED]: <div className="cell closed"></div>,
  [MazeGenerator.CELL.CLEAR]: <div className="clear"></div>,
  [MazeGenerator.CELL.PATH]: <div className="cell path"></div>,
};

const MazeControl = (props) => {
  const [grid, setGrid] = useState([]);
  const [width, setWidth] = useState(props.width);
  const [height, setHeight] = useState(props.height);

  const redraw = () => {
    MazeGenerator.initialize(width, height);

    if (!props.type) {
      return;
    }

    if (props.type.toLowerCase() === "ascii") {
      setGrid(MazeGenerator.toString());
    } else {
      setGrid(
        MazeGenerator.gridElements().map((cell) => {
          return CELL_TYPE_TO_JSX[cell];
        })
      );
    }
  };


  const carveSolution = async (solutionPath, delay) => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const gridElements = MazeGenerator.gridElements();
    const gridElementsSolved = MazeGenerator.gridElements(solutionPath);

    for (const coords of solutionPath.reverse()) {
      gridElementsSolved
        .map((el, idx) => {
          return { el, idx };
        })
        .filter(({ el }) => el.x === coords.x && el.y === coords.y)
        .forEach(({ idx }) => {
          gridElements[idx] = MazeGenerator.CELL.PATH;
        });
      if (delay) {
        await wait(10);
        setGrid(gridElements.map((el) => CELL_TYPE_TO_JSX[el]));
      }
    }

    if (!delay) {
      setGrid(gridElements.map((el) => CELL_TYPE_TO_JSX[el]));
    }
  };

  useEffect(() => {
    MazeGenerator.initialize(width, height);
    redraw();
  }, [props.grid, props.type]);

  useEffect(() => {
    setWidth(props.width);
    setHeight(props.height);
  }, [props.width, props.height]);

  return (
    <div>
      <div className="center">
        <input
          className="button button-outline"
          type="button"
          value="Solve with DFS"
          onClick={() => carveSolution(MazeSolver.solveDfs(), false)}
        />
        <input
          className="button button-outline"
          type="button"
          value="Watch DFS"
          onClick={() => carveSolution(MazeSolver.solveDfs(), true)}
        />
      </div>
      <div className="maze center">
        <div
          className={
            props.type && props.type.toLowerCase() === "ascii" ? "pre" : ""
          }
        >
          {grid}
        </div>
      </div>
    </div>
  );
};

export default MazeControl;

import React, { useState, useEffect } from "react";
import { MazeManager } from "./managers/mazeManager.js";

const MazeControl = (props) => {
  const [grid, setGrid] = useState([]);
  const [width, setWidth] = useState(props.width);
  const [height, setHeight] = useState(props.height);

  const gridElements = () => {
    const elements = [];

    // Top border.
    for (let i = 0; i <= MazeManager.grid[0].length * 2; i++) {
      elements.push(<div className="cell closed"></div>);
    }

    elements.push(<div className="clear"></div>);

    // Main grid.
    for (let y = 0; y < MazeManager.grid.length; y++) {
      const passageRow = [];

      // Left border column.
      elements.push(<div className="cell closed"></div>);
      passageRow.push(<div className="cell closed"></div>);

      // Rooms. Note, we only need to check south and east (because north and west have borders already included).
      for (let x = 0; x < MazeManager.grid[0].length; x++) {
        // Add a cell for the room.
        elements.push(<div className="cell open"></div>);

        if (
          (MazeManager.grid[y][x] & MazeManager.DIRECTION.BOTTOM) ===
          MazeManager.DIRECTION.BOTTOM
        ) {
          // Open a passage to the south.
          passageRow.push(<div className="cell open"></div>);
        } else {
          // Close a passage to the south.
          passageRow.push(<div className="cell closed"></div>);
        }

        // Add closed passage to next row between rooms.
        passageRow.push(<div className="cell closed"></div>);

        if (
          (MazeManager.grid[y][x] & MazeManager.DIRECTION.RIGHT) ===
          MazeManager.DIRECTION.RIGHT
        ) {
          // Open a passage to the east.
          elements.push(<div className="cell open"></div>);
        } else {
          // Close a passage to the east.
          elements.push(<div className="cell closed"></div>);
        }
      }

      elements.push(<div className="clear"></div>);
      passageRow.push(<div className="clear"></div>);

      // Append passages row to elements.
      elements.push.apply(elements, passageRow);
    }

    return elements;
  };

  const redraw = () => {
    MazeManager.initialize(width, height);

    if (!props.type) {
      return;
    }

    if (props.type.toLowerCase() === "ascii") {
      setGrid(MazeManager.toString());
    } else {
      setGrid(gridElements());
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

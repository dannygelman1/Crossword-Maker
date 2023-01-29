import { Box } from "models/Box";
import { ReactElement, useEffect, useState } from "react";

export const Editor = (): ReactElement => {
  const [selected, setSelected] = useState<number>(0);
  const [boxes, setBoxes] = useState<Box[]>([new Box(500, 250, "")]);
  const [neighbors, setNeighbors] = useState<Box[]>([]);
  const [textMode, setTextMode] = useState<boolean>(false);

  useEffect(() => {
    setNeighbors(getNeighbors(boxes[selected], boxes));
  }, [selected]);

  return (
    <div className="flex items-start justify-center h-full w-full bg-red-400 absolute">
      <div className="mt-5 w-[1000px] h-[500px] border-8 border-green-500 relative">
        {boxes.map((box, i) => (
          <div
            key={i}
            className="w-5 h-5 border-2 border-black absolute flex items-center justify-center"
            style={{ left: `${box.x}px`, bottom: `${box.y}px` }}
            onClick={() => {
              if (textMode) return;
              setSelected(i);
            }}
          >
            <input
              className="w-4 h-4 bg-transparent outline-none capitalize p-[2px]"
              disabled={!textMode}
              defaultValue={box.letter}
            />
          </div>
        ))}
        {!textMode &&
          neighbors.map((box, i) => (
            <div
              key={i}
              className="w-5 h-5 border-2 border-black/30 absolute"
              style={{ left: `${box.x}px`, bottom: `${box.y}px` }}
              onClick={() => {
                if (textMode) return;
                boxes.push(box);
                setBoxes(boxes);
                const fileted = neighbors.filter(
                  (n) => n.x !== box.x || n.y !== box.y
                );
                setNeighbors(fileted);
              }}
            />
          ))}
      </div>
      <button
        className="bg-green-500 rounded-md p-2 w-[150px]"
        onClick={() => setTextMode(!textMode)}
      >
        {textMode ? "text mode" : "square mode"}
      </button>
    </div>
  );
};

const getNeighbors = (pos: Box, existing: Box[]): Box[] => {
  const neighbors = [
    new Box(pos.x - 18, pos.y, ""),
    new Box(pos.x + 18, pos.y, ""),
    new Box(pos.x, pos.y - 18, ""),
    new Box(pos.x, pos.y + 18, ""),
  ];
  const existingString = existing.map((e) => JSON.stringify(e));
  return neighbors.filter((n) => !existingString.includes(JSON.stringify(n)));
};

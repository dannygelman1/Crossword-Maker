import { Box, Clues } from "@/models/Box";
import { ReactElement, useEffect, useState, useRef } from "react";
import { isEqual, uniqueId } from "lodash";
import cn from "classnames";
import { Input } from "./Input";
import { getBoxes } from "@/lib/BoxService";
import { CluesSection } from "./CluesSection";
import { Viewport } from "./Viewport";

interface PlayProps {
  gameId: string;
}
export const Play = ({ gameId }: PlayProps): ReactElement => {
  const [selectedTextMode, setSelectedTextMode] = useState<Box | undefined>(
    undefined
  );
  const boxSize = 30;
  const boxSpace = 1;
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    const newBoxes = setNumbersAndClues(boxes);
    setBoxes(newBoxes);
  }, [boxes.length]);

  useEffect(() => {
    loadBoxes();
  }, []);

  const loadBoxes = async () => {
    const boxesFromDB = await getBoxes(gameId);
    setLoading(false);
    const boxModels = boxesFromDB.boxes.map(
      (box) =>
        new Box(
          box.id,
          500 + box.x * (boxSize + boxSpace),
          250 + box.y * (boxSize + boxSpace),
          box.x,
          box.y,
          box.letter ?? "",
          box.isblock,
          box.horiz_clue ?? "",
          box.vert_clue ?? ""
        )
    );
    const newBoxes = setNumbersAndClues(boxModels);
    setBoxes(newBoxes);
  };

  return (
    <div className="flex flex-row space-x-2 pt-5 items-start justify-center h-full w-full bg-[#ce9583] absolute">
      <div className="flex flex-col space-y-2">
        <Viewport
          scale={scale}
          setScale={setScale}
          position={position}
          setPosition={setPosition}
        >
          {loading && (
            <div
              className="absolute origin-center top-0 left-0 w-full h-full"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
            >
              {[-2, -1, 0, 1, 2].map((num, i) => {
                return (
                  <div
                    key={i}
                    className={cn(
                      "absolute flex items-center justify-center z-10 bg-[#8f8eb4] animate-pulse"
                    )}
                    style={{
                      left: `${500 + num * (boxSize + boxSpace)}px`,
                      bottom: `${250}px`,
                      width: `${boxSize}px`,
                      height: ` ${boxSize}px`,
                    }}
                  />
                );
              })}
            </div>
          )}
          {!loading && (
            <div
              ref={contentRef}
              className="absolute origin-center top-0 left-0 w-full h-full"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
            >
              {boxes.map((box) => {
                return (
                  <div
                    key={box.id}
                    className={cn(
                      "border-2 absolute flex items-center justify-center z-10",
                      {
                        "border-[#3b3987] bg-[#3b3987]": box.isBlock,
                        "border-black": !box.isBlock,
                      }
                    )}
                    style={{
                      left: `${box.x}px`,
                      bottom: `${box.y}px`,
                      width: `${boxSize}px`,
                      height: ` ${boxSize}px`,
                    }}
                  >
                    {box?.number && (
                      <div className="text-[8px] absolute top-0 left-[1px]">
                        {box.number}
                      </div>
                    )}
                    {!box.isBlock && (
                      <Input
                        className={cn(
                          "outline-none capitalize p-[2px] text-center",
                          {
                            "bg-[#8f8eb4]": isEqual(selectedTextMode, box),
                            "bg-transparent": !isEqual(selectedTextMode, box),
                            "bg-[#d45f5f]":
                              box.letter !== box.input &&
                              box.input !== "" &&
                              checked,
                            "text-[#3b3987]": box.correct,
                          }
                        )}
                        style={{
                          width: `${boxSize - 4}px`,
                          height: `${boxSize - 4}px`,
                          caretColor: "transparent",
                        }}
                        box={box}
                        disabled={box.correct}
                        onFocus={() => setSelectedTextMode(box)}
                        onBlur={() => setSelectedTextMode(undefined)}
                        updateBox={(letter: string | null) => {
                          console.log(letter);
                          box.setInput(letter ?? "");
                        }}
                        onChange={() => {
                          setChecked(false);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Viewport>
        <CluesSection boxes={boxes} loading={loading} editOrPlay="play" />
      </div>
      <div className="flex flex-col space-y-1">
        <button
          className="rounded-md p-2 w-[150px] bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white"
          onClick={() => {
            setChecked(true);
            boxes.forEach((box) => {
              if (box.letter === box.input) box.setCorrect();
            });
          }}
        >
          check puzzle
        </button>
      </div>
    </div>
  );
};

const shouldHaveNumber = (box: Box, existing: Box[]): Clues => {
  let above = [];
  let left = [];
  let below = [];
  let right = [];
  if (box.isBlock) return "none";
  for (const existingBox of existing) {
    if (existingBox.isBlock) continue;
    if (box.x === existingBox.x && box.y < existingBox.y)
      above.push(existingBox.gridY);
    if (box.y === existingBox.y && box.x > existingBox.x)
      left.push(existingBox.gridX);
    if (box.x === existingBox.x && box.y > existingBox.y)
      below.push(existingBox.gridY);
    if (box.y === existingBox.y && box.x < existingBox.x)
      right.push(existingBox.gridX);
  }
  const verticalClue =
    !above.includes(box.gridY + 1) && below.includes(box.gridY - 1);
  const horizontalClue =
    !left.includes(box.gridX - 1) && right.includes(box.gridX + 1);
  if (verticalClue && !horizontalClue) return "vertical";
  else if (!verticalClue && horizontalClue) return "horizontal";
  else if (verticalClue && horizontalClue) return "both";
  else return "none";
};

const setNumbersAndClues = (boxes: Box[]): Box[] => {
  const copy = [...boxes];
  const sortedBoxes = copy.sort((a, b) => {
    if (a.y !== b.y) return b.y - a.y;
    return a.x - b.x;
  });
  let i = 1;
  let newBoxes: Box[] = [];
  for (const sortedBox of sortedBoxes) {
    const clue = shouldHaveNumber(sortedBox, copy);
    if (["both", "vertical", "horizontal"].includes(clue)) {
      sortedBox?.setNumber(i);
      sortedBox.setClues(clue);
      i += 1;
    } else {
      sortedBox?.unsetNumber();
      sortedBox.setClues("none");
    }
    newBoxes.push(sortedBox);
  }
  return newBoxes;
};

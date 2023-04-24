import { Box, Clues } from "@/models/Box";
import { ReactElement, useEffect, useState, useRef } from "react";
import { isEqual, uniqueId } from "lodash";
import cn from "classnames";
import { Input } from "./Input";
import { Viewport } from "./Viewport";
import { CluesSection } from "./CluesSection";
import useClipboard from "react-use-clipboard";
import { ClueInput } from "./CluesSection";
import {
  getBoxes,
  deleteBox,
  updateBox,
  createBox,
  createGame,
  getGame,
} from "@/lib/BoxService";

interface EditorProps {
  gameId: string;
}
export const Editor = ({ gameId }: EditorProps): ReactElement => {
  const [selected, setSelected] = useState<Box | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTextMode, setSelectedTextMode] = useState<Box | undefined>(
    undefined
  );
  const boxSize = 30;
  const boxSpace = 1;
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [neighbors, setNeighbors] = useState<Box[]>([]);
  const [mode, setMode] = useState<"create" | "delete" | "text" | "block">(
    "create"
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isGameCodeCopied, setGameCodeCopied] = useClipboard(
    `https://crossword-sepia.vercel.app/game/edit/${gameId}`,
    {
      successDuration: 3000,
    }
  );

  useEffect(() => {
    if (selected) {
      setNeighbors(
        getNeighbors(selected, boxes, boxSize, boxSpace, mode === "block")
      );
    } else {
      setNeighbors([]);
    }
  }, [selected, mode]);

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
            <div className="absolute origin-center top-0 left-0 w-full h-full">
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
                        "border-[#3b3987]":
                          (isEqual(selected, box) &&
                            (mode === "create" || mode === "block")) ||
                          box.isBlock,
                        "border-black": !isEqual(selected, box) && !box.isBlock,
                        "hover:border-[#3b3987]":
                          !isEqual(selected, box) &&
                          (mode === "create" || mode === "block"),
                        "hover:border-[#d45f5f]":
                          mode === "delete" && boxes.length > 1,
                        "bg-[#3b3987]": box.isBlock,
                      }
                    )}
                    style={{
                      left: `${box.x}px`,
                      bottom: `${box.y}px`,
                      width: `${boxSize}px`,
                      height: ` ${boxSize}px`,
                    }}
                    onClick={() => {
                      if (mode === "text") return;
                      if (mode === "create" || mode === "block")
                        setSelected(box);
                      if (mode === "delete" && boxes.length > 1) {
                        setBoxes(boxes.filter((b) => b.id !== box.id));
                        deleteBox(box.id);
                      }
                    }}
                  >
                    {box?.number && (
                      <div className="text-[8px] absolute top-0 left-[1px]">
                        {box.number}
                      </div>
                    )}
                    {!box.isBlock && (
                      <Input
                        isEditing
                        className={cn(
                          "outline-none capitalize p-[2px] text-center",
                          {
                            "bg-[#8f8eb4]": isEqual(selectedTextMode, box),
                            "bg-transparent": !isEqual(selectedTextMode, box),
                          }
                        )}
                        style={{
                          width: `${boxSize - 4}px`,
                          height: ` ${boxSize - 4}px`,
                          caretColor: "transparent",
                        }}
                        box={box}
                        disabled={mode !== "text"}
                        onFocus={() => setSelectedTextMode(box)}
                        onBlur={() => setSelectedTextMode(undefined)}
                        updateBox={(letter: string | null) => {
                          updateBox(box.id, letter, null, null);
                        }}
                      />
                    )}
                  </div>
                );
              })}
              {(mode === "create" || mode === "block") &&
                neighbors.map((box, i) => (
                  <div
                    key={i}
                    className="border-2 border-black/40 hover:border-[#3b3987]/70 absolute z-5"
                    style={{
                      left: `${box.x}px`,
                      bottom: `${box.y}px`,
                      width: `${boxSize}px`,
                      height: ` ${boxSize}px`,
                    }}
                    onClick={async () => {
                      const boxData = await createBox(
                        box.gridX,
                        box.gridY,
                        box.isBlock,
                        gameId
                      );
                      box.setId(boxData.createBox.id);
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
          )}
        </Viewport>
        <CluesSection boxes={boxes} loading={loading} editOrPlay="edit" />
      </div>
      <div className="flex flex-col space-y-16">
        <div className="flex flex-col space-y-1">
          <button
            className={cn("rounded-md p-2 w-[150px]", {
              "bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white":
                mode === "create",
              "bg-[#59586d] text-gray-200 hover:bg-[#73718d] hover:text-white":
                mode !== "create",
            })}
            onClick={() => setMode("create")}
          >
            create
          </button>
          <button
            className={cn("rounded-md p-2 w-[150px]", {
              "bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white":
                mode === "text",
              "bg-[#59586d] text-gray-200 hover:bg-[#73718d] hover:text-white":
                mode !== "text",
            })}
            onClick={() => {
              setMode("text");
              setSelected(undefined);
            }}
          >
            text
          </button>
          <button
            className={cn("rounded-md p-2 w-[150px]", {
              "bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white":
                mode === "delete",
              "bg-[#59586d] text-gray-200 hover:bg-[#73718d] hover:text-white":
                mode !== "delete",
            })}
            onClick={() => {
              setMode("delete");
              setSelected(undefined);
            }}
          >
            delete
          </button>
          <button
            className={cn("rounded-md p-2 w-[150px]", {
              "bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white":
                mode === "block",
              "bg-[#59586d] text-gray-200 hover:bg-[#73718d] hover:text-white":
                mode !== "block",
            })}
            onClick={() => {
              setMode("block");
            }}
          >
            block
          </button>
        </div>
        <button
          className={cn("rounded-md p-2 w-[150px]", {
            "bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white":
              mode === "create",
            "bg-[#59586d] text-gray-200 hover:bg-[#73718d] hover:text-white":
              mode !== "create",
          })}
          onClick={() => setGameCodeCopied()}
        >
          {!isGameCodeCopied ? "Copy link" : "Copied!"}
        </button>
      </div>
    </div>
  );
};

const getNeighbors = (
  box: Box,
  existing: Box[],
  boxSize: number,
  boxSpace: number,
  isBlock: boolean
): Box[] => {
  const neighbors = [
    new Box(
      uniqueId(),
      box.x - (boxSize + boxSpace),
      box.y,
      box.gridX - 1,
      box.gridY,
      "",
      isBlock
    ),
    new Box(
      uniqueId(),
      box.x + (boxSize + boxSpace),
      box.y,
      box.gridX + 1,
      box.gridY,
      "",
      isBlock
    ),
    new Box(
      uniqueId(),
      box.x,
      box.y - (boxSize + boxSpace),
      box.gridX,
      box.gridY - 1,
      "",
      isBlock
    ),
    new Box(
      uniqueId(),
      box.x,
      box.y + (boxSize + boxSpace),
      box.gridX,
      box.gridY + 1,
      "",
      isBlock
    ),
  ];
  const existingString = existing.map((e) => `${e.gridX},${e.gridY}`);
  return neighbors.filter(
    (n) => !existingString.includes(`${n.gridX},${n.gridY}`)
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

const copyToClipboard = (text: string) => {
  const input = document.createElement("input");
  input.setAttribute("value", text);
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
};

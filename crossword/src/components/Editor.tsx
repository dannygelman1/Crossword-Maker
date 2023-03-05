import { Box, Clues } from "@/models/Box";
import { ReactElement, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { isEqual, uniqueId } from "lodash";
import cn from "classnames";
import { Input } from "./Input";
import { ClueInput } from "./ClueInput";
import { useRouter } from "next/router";
import { randomUUID } from "node:crypto";
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
  const firstBox = new Box(uniqueId(), 500, 250, 0, 0, "", false);
  const [selected, setSelected] = useState<Box | undefined>(firstBox);
  const [selectedTextMode, setSelectedTextMode] = useState<Box | undefined>(
    undefined
  );
  const boxSize = 30;
  const boxSpace = 1;
  const [boxes, setBoxes] = useState<Box[]>([firstBox]);
  const [neighbors, setNeighbors] = useState<Box[]>([]);
  const [mode, setMode] = useState<"create" | "delete" | "text" | "block">(
    "create"
  );
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startCoordinates, setStartCoordinates] = useState({ x: 0, y: 0 });

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
          box.clue ?? ""
        )
    );
    const newBoxes = setNumbersAndClues(boxModels);
    setBoxes(newBoxes);
  };

  useEffect(() => {
    const preventDefault = (event: MouseEvent) => {
      event.preventDefault();
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const newScale = event.deltaY < 0 ? scale + 0.01 : scale - 0.01;

      setScale(newScale);
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        event.preventDefault();
        setIsDragging(true);
        setStartCoordinates({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: position.x + (event.clientX - startCoordinates.x) * 0.5,
          y: position.y + (event.clientY - startCoordinates.y) * 0.5,
        });
        setStartCoordinates({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    const editor = editorRef.current;

    if (editor) {
      editor.addEventListener("wheel", handleWheel);
      editor.addEventListener("contextmenu", preventDefault);
      editor.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (editor) {
        editor.removeEventListener("wheel", handleWheel);
        editor.removeEventListener("contextmenu", preventDefault);
        editor.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [scale, position, isDragging, startCoordinates]);

  return (
    <div className="flex flex-row space-x-2 pt-5 items-start justify-center h-full w-full bg-red-400 absolute">
      <div className="flex flex-col space-y-2">
        <div
          className="w-[1000px] h-[500px] border-8 border-green-500 relative overflow-scroll"
          ref={editorRef}
        >
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
                    "border-2 absolute flex items-center justify-center z-10 ",
                    {
                      "border-blue-800":
                        isEqual(selected, box) &&
                        (mode === "create" || mode === "block"),
                      "border-black":
                        !isEqual(selected, box) || mode === "text",
                      "hover:border-blue-800":
                        !isEqual(selected, box) &&
                        (mode === "create" || mode === "block"),
                      "border-black hover:border-red-600":
                        mode === "delete" && boxes.length > 1,
                      "border-black bg-black": box.isBlock,
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
                    if (mode === "create" || mode === "block") setSelected(box);
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
                      className={cn(
                        "outline-none capitalize p-[2px] text-center",
                        {
                          "bg-yellow-300": isEqual(selectedTextMode, box),
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
                        updateBox(box.id, letter, null);
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
                  className="border-2 border-black/40 hover:border-blue-800/40 absolute z-5"
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
        </div>
        <div className="flex flex-row space-x-2 h-[210px] w-[1000px] border-8 border-green-500 overflow-auto">
          <div className="flex flex-col space-y-1 w-1/2">
            <span className="flex p-1 items-center justify-center">Across</span>
            {boxes.map((box) => {
              if (box.clues == "horizontal" || box.clues == "both")
                return <ClueInput key={`${box.id}_2`} box={box} />;
            })}
          </div>
          <div className="flex flex-col space-y-1 w-1/2">
            <span className="flex p-1 items-center justify-center">Down</span>
            {boxes.map((box) => {
              if (box.clues == "vertical" || box.clues == "both")
                return <ClueInput key={`${box.id}_2`} box={box} />;
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <button
          className={cn("rounded-md p-2 w-[150px]", {
            "bg-green-500": mode === "create",
            "bg-green-500/50": mode !== "create",
          })}
          onClick={() => setMode("create")}
        >
          create
        </button>
        <button
          className={cn("rounded-md p-2 w-[150px]", {
            "bg-green-500": mode === "text",
            "bg-green-500/50": mode !== "text",
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
            "bg-green-500": mode === "delete",
            "bg-green-500/50": mode !== "delete",
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
            "bg-green-500": mode === "block",
            "bg-green-500/50": mode !== "block",
          })}
          onClick={() => {
            setMode("block");
          }}
        >
          block
        </button>
        <button
          className={cn("rounded-md p-2 w-[150px]")}
          onClick={async () => {
            await createGame("hi");
          }}
        >
          create game mutation
        </button>
        <button
          className={cn("rounded-md p-2 w-[150px]")}
          onClick={async () => {
            const game = await getGame("hi");
          }}
        >
          get game query
        </button>
        <button
          className={cn("rounded-md p-2 w-[150px]")}
          onClick={async () => {
            const boxes = await getBoxes(gameId);
          }}
        >
          get boxes query
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
  const existingString = existing.map((e) => JSON.stringify(e));
  return neighbors.filter((n) => !existingString.includes(JSON.stringify(n)));
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

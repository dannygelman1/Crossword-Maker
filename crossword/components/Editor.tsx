import { Box } from "models/Box";
import {
  ReactElement,
  useEffect,
  useState,
  KeyboardEvent,
  useRef,
} from "react";
import { isEqual } from "lodash";
import cn from "classnames";
import { Input } from "./Input";
export const Editor = (): ReactElement => {
  const firstBox = new Box(1, 500, 250, 0, 0, "", false, "center");
  const [selected, setSelected] = useState<Box | undefined>(firstBox);
  const [numBoxesAdded, setNumBoxesAdded] = useState<number>(1);
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
        getNeighbors(
          selected,
          boxes,
          boxSize,
          boxSpace,
          numBoxesAdded,
          mode === "block"
        )
      );
    } else {
      setNeighbors([]);
    }
  }, [selected, mode, numBoxesAdded]);

  useEffect(() => {
    const copy = [...boxes];
    const sortedBoxes = copy.sort((a, b) => {
      if (a.y !== b.y) return b.y - a.y;
      return a.x - b.x;
    });
    let i = 1;
    let newBoxes: Box[] = [];
    for (const sortedBox of sortedBoxes) {
      if (shouldHaveNumber(sortedBox, boxes)) {
        sortedBox?.setNumber(i);
        i += 1;
      } else sortedBox?.unsetNumber();
      newBoxes.push(sortedBox);
      setBoxes(newBoxes);
    }
  }, [boxes.length]);

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
    <div className="flex items-start justify-center h-full w-full bg-red-400 absolute">
      <div
        className="mt-5 w-[1000px] h-[500px] border-8 border-green-500 relative overflow-scroll"
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
                    "border-black": !isEqual(selected, box) || mode === "text",
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
                  if (mode === "delete" && boxes.length > 1)
                    setBoxes(boxes.filter((b) => b.id !== box.id));
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
                    disabled={mode !== "text"}
                    onFocus={() => setSelectedTextMode(box)}
                    onBlur={() => setSelectedTextMode(undefined)}
                    onKeyDown={(e) => {
                      if (mode !== "text") return;
                      const val = (e.target as HTMLInputElement).value;
                      (e.target as HTMLInputElement).value = "";
                      box.setLetter(val);
                    }}
                    onChange={(event) => {
                      if (mode !== "text") return "";
                      if (!/^[a-zA-Z]$/.test(event.target.value)) {
                        event.target.value =
                          box.letter === "" ? "" : box.letter;
                      }
                      box.setLetter(event.target.value);
                      return event.target.value;
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
                onClick={() => {
                  setNumBoxesAdded(numBoxesAdded + 1);
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
      <div className="flex flex-col">
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
      </div>
    </div>
  );
};

const getNeighbors = (
  box: Box,
  existing: Box[],
  boxSize: number,
  boxSpace: number,
  numBoxesAdded: number,
  isBlock: boolean
): Box[] => {
  const neighbors = [
    new Box(
      numBoxesAdded + 1,
      box.x - (boxSize + boxSpace),
      box.y,
      box.gridX - 1,
      box.gridY,
      "",
      isBlock,
      "left"
    ),
    new Box(
      numBoxesAdded + 1,
      box.x + (boxSize + boxSpace),
      box.y,
      box.gridX + 1,
      box.gridY,
      "",
      isBlock,
      "right"
    ),
    new Box(
      numBoxesAdded + 1,
      box.x,
      box.y - (boxSize + boxSpace),
      box.gridX,
      box.gridY - 1,
      "",
      isBlock,
      "bottom"
    ),
    new Box(
      numBoxesAdded + 1,
      box.x,
      box.y + (boxSize + boxSpace),
      box.gridX,
      box.gridY + 1,
      "",
      isBlock,
      "top"
    ),
  ];
  const existingString = existing.map((e) => JSON.stringify(e));
  return neighbors.filter((n) => !existingString.includes(JSON.stringify(n)));
};

const shouldHaveNumber = (box: Box, existing: Box[]): boolean => {
  let above = [];
  let left = [];
  let below = [];
  let right = [];
  if (box.isBlock) return false;
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

  return (
    (!above.includes(box.gridY + 1) && below.includes(box.gridY - 1)) ||
    (!left.includes(box.gridX - 1) && right.includes(box.gridX + 1))
  );
};

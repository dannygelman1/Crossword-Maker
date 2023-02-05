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

export const Editor = (): ReactElement => {
  const firstBox = new Box(0, 500, 250, 0, 0, "", "center");
  const [selected, setSelected] = useState<Box>(firstBox);
  const [selectedTextMode, setSelectedTextMode] = useState<Box | undefined>(
    undefined
  );
  const boxSize = 30;
  const boxSpace = 1;
  // const [boxes, setBoxes] = useState<Box[]>(
  //   Array.from(Array(20)).map(
  //     (val, i) =>
  //       new Box(
  //         500 - i * (boxSize + boxSpace),
  //         250 - i * (boxSize + boxSpace),
  //         "",
  //         "center"
  //       )
  //   )
  // );
  const [boxes, setBoxes] = useState<Box[]>([firstBox]);
  const [neighbors, setNeighbors] = useState<Box[]>([]);
  const [textMode, setTextMode] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startCoordinates, setStartCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setNeighbors(getNeighbors(selected, boxes, boxSize, boxSpace));
  }, [selected]);

  useEffect(() => {
    const sortedBoxes = boxes.sort((a, b) => {
      if (a.y !== b.y) return b.y - a.y;
      return a.x - b.x;
    });
    let i = 1;
    for (const box of sortedBoxes) {
      if (shouldHaveNumber(box, boxes)) {
        box.setNumber(i);
        i += 1;
      } else box.unsetNumber();
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
          {boxes.map((box, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "border-2 absolute flex items-center justify-center z-10",
                  {
                    "border-blue-800": isEqual(selected, box),
                    "border-black": !isEqual(selected, box),
                    // "border-t-0": box.relPos === "bottom",
                    // "border-b-0": box.relPos === "top",
                    // "border-l-0": box.relPos === "right",
                    // "border-r-0": box.relPos === "left",
                  }
                )}
                style={{
                  left: `${box.x}px`,
                  bottom: `${box.y}px`,
                  width: `${boxSize}px`,
                  height: ` ${boxSize}px`,
                }}
                onClick={() => {
                  if (textMode) return;
                  setSelected(box);
                }}
              >
                {box?.number && (
                  <div className="text-[8px] absolute top-0 left-[1px]">
                    {box.number}
                  </div>
                )}
                <input
                  ref={inputRef}
                  className={cn("outline-none capitalize p-[2px] text-center", {
                    "bg-yellow-300": isEqual(selectedTextMode, box),
                    "bg-transparent": !isEqual(selectedTextMode, box),
                  })}
                  style={{
                    width: `${boxSize - 4}px`,
                    height: ` ${boxSize - 4}px`,
                    caretColor: "transparent",
                  }}
                  disabled={!textMode}
                  defaultValue={box.letter}
                  type="text"
                  pattern="[a-zA-Z]{1}"
                  maxLength={1}
                  onFocus={() => setSelectedTextMode(box)}
                  onBlur={() => setSelectedTextMode(undefined)}
                  onKeyDown={(e) => {
                    const val = (e.target as HTMLInputElement).value;
                    (e.target as HTMLInputElement).value = "";
                    box.setLetter(val);
                  }}
                  onChange={(event) => {
                    if (!/^[a-zA-Z]$/.test(event.target.value)) {
                      event.target.value = box.letter === "" ? "" : box.letter;
                    }
                    box.setLetter(event.target.value);
                  }}
                />
              </div>
            );
          })}
          {!textMode &&
            neighbors.map((box, i) => (
              <div
                key={i}
                className={cn("border-2 border-black/30 absolute z-5", {
                  // "border-t-0": box.relPos === "bottom",
                  // "border-b-0": box.relPos === "top",
                  // "border-l-0": box.relPos === "right",
                  // "border-r-0": box.relPos === "left",
                })}
                style={{
                  left: `${box.x}px`,
                  bottom: `${box.y}px`,
                  width: `${boxSize}px`,
                  height: ` ${boxSize}px`,
                }}
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

const getNeighbors = (
  box: Box,
  existing: Box[],
  boxSize: number,
  boxSpace: number
): Box[] => {
  const neighbors = [
    new Box(
      existing.length + 1,
      box.x - (boxSize + boxSpace),
      box.y,
      box.gridX - 1,
      box.gridY,
      "",
      "left"
    ),
    new Box(
      existing.length + 2,
      box.x + (boxSize + boxSpace),
      box.y,
      box.gridX + 1,
      box.gridY,
      "",
      "right"
    ),
    new Box(
      existing.length + 3,
      box.x,
      box.y - (boxSize + boxSpace),
      box.gridX,
      box.gridY - 1,
      "",
      "bottom"
    ),
    new Box(
      existing.length + 4,
      box.x,
      box.y + (boxSize + boxSpace),
      box.gridX,
      box.gridY + 1,
      "",
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
  console.log(existing);
  for (const existingBox of existing) {
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

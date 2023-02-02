import { Box } from "models/Box";
import {
  ReactElement,
  useEffect,
  useState,
  KeyboardEvent,
  useRef,
} from "react";
import cn from "classnames";

export const Editor = (): ReactElement => {
  const [selected, setSelected] = useState<number>(0);
  const [selectedTextMode, setSelectedTextMode] = useState<number>(-1);
  const [boxes, setBoxes] = useState<Box[]>(
    Array.from(Array(20)).map(
      (val, i) => new Box(500 - i * 22, 250 - i * 22, "")
    )
  );
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
    setNeighbors(getNeighbors(boxes[selected], boxes));
  }, [selected]);

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
      console.log(position, event.clientX, event.clientY, startCoordinates);
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
                  "w-5 h-5 border-2 absolute flex items-center justify-center z-10",
                  {
                    "border-blue-800": selected === i,
                    "border-black": selected !== i,
                  }
                )}
                style={{ left: `${box.x}px`, bottom: `${box.y}px` }}
                onClick={() => {
                  if (textMode) return;
                  setSelected(i);
                }}
              >
                <input
                  ref={inputRef}
                  className={cn(
                    "w-4 h-4 outline-none capitalize p-[2px] text-center",
                    {
                      "bg-yellow-300": selectedTextMode === i,
                      "bg-transparent": selectedTextMode !== i,
                    }
                  )}
                  disabled={!textMode}
                  defaultValue={box.letter}
                  type="text"
                  pattern="[a-zA-Z]{1}"
                  maxLength={1}
                  style={{ caretColor: "transparent" }}
                  onFocus={() => setSelectedTextMode(i)}
                  onBlur={() => setSelectedTextMode(-1)}
                  onKeyDown={(e) => {
                    const val = (e.target as HTMLInputElement).value;
                    (e.target as HTMLInputElement).value = "";
                    boxes[i].setLetter(val);
                    setBoxes(boxes);
                  }}
                  onChange={(event) => {
                    console.log(event.target.value);
                    if (!/^[a-zA-Z]$/.test(event.target.value)) {
                      event.target.value = box.letter === "" ? "" : box.letter;
                    }
                    box.setLetter(event.target.value);
                    boxes[i] = box;
                    setBoxes(boxes);
                  }}
                />
              </div>
            );
          })}
          {!textMode &&
            neighbors.map((box, i) => (
              <div
                key={i}
                className="w-5 h-5 border-2 border-black/30 absolute z-5"
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
    new Box(pos.x - 22, pos.y, ""),
    new Box(pos.x + 22, pos.y, ""),
    new Box(pos.x, pos.y - 22, ""),
    new Box(pos.x, pos.y + 22, ""),
  ];
  const existingString = existing.map((e) => JSON.stringify(e));
  return neighbors.filter((n) => !existingString.includes(JSON.stringify(n)));
};

import {
  ReactElement,
  useEffect,
  useState,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ViewportProps {
  children: ReactNode;
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  position: { x: number; y: number };
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
}

export const Viewport = ({
  children,
  scale,
  setScale,
  position,
  setPosition,
}: ViewportProps): ReactElement => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startCoordinates, setStartCoordinates] = useState({ x: 0, y: 0 });
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
    <div
      className="w-[1000px] h-[500px] border-4 border-[#3b3987] rounded-lg relative overflow-scroll"
      ref={editorRef}
    >
      {children}
    </div>
  );
};

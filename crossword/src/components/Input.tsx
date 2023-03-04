import { updateBoxData } from "@/lib/gqlClient";
import { Box } from "@/models/Box";
import { ReactElement, useState, ChangeEvent, CSSProperties } from "react";

interface InputProps {
  className: string;
  style: CSSProperties;
  disabled: boolean;
  onFocus: () => void;
  onBlur: () => void;
  box: Box;
  updateBox: (letter: string | null) => void;
}

export const Input = ({
  className,
  style,
  disabled,
  onFocus,
  onBlur,
  box,
  updateBox,
}: InputProps): ReactElement => {
  const [value, setValue] = useState<string>(box.letter);
  return (
    <input
      className={className}
      style={style}
      disabled={disabled}
      value={value}
      type="text"
      pattern="[a-zA-Z]{1}"
      maxLength={1}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          setValue("");
          updateBox(null);
        }
        (e.target as HTMLInputElement).value = "";
      }}
      onChange={(event) => {
        let letter = event.target.value;
        if (!/^[a-zA-Z]$/.test(letter)) {
          letter = box.letter === "" ? "" : box.letter;
        }
        box.setLetter(letter);
        setValue(letter);
        updateBox(letter === "" ? null : letter);
      }}
    />
  );
};

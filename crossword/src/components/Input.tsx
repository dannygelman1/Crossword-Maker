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
  isEditing?: boolean;
  onChange?: () => void;
}

export const Input = ({
  className,
  style,
  disabled,
  onFocus,
  onBlur,
  box,
  updateBox,
  isEditing,
  onChange,
}: InputProps): ReactElement => {
  const [value, setValue] = useState<string>(
    isEditing ? box.letter : box.input
  );
  return (
    <input
      autoComplete="off"
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
        if (isEditing) box.setLetter(letter);
        setValue(letter);
        updateBox(letter === "" ? null : letter);
        if (onChange) onChange();
      }}
    />
  );
};

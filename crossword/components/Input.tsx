import {
  ReactElement,
  useState,
  ChangeEvent,
  KeyboardEvent,
  CSSProperties,
  RefObject,
} from "react";

interface InputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => string;
  className: string;
  style: CSSProperties;
  disabled: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
}

export const Input = ({
  onChange,
  className,
  style,
  disabled,
  onFocus,
  onBlur,
  onKeyDown,
}: InputProps): ReactElement => {
  const [value, setValue] = useState<string>("");
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
      onKeyDown={(e) => onKeyDown(e)}
      onChange={(event) => {
        const val = onChange(event);
        setValue(val);
      }}
    />
  );
};

type RelPos = "top" | "bottom" | "right" | "left" | "center";
export class Box {
  id: number;
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  letter: string;
  relPos: RelPos;
  isBlock: boolean;
  number?: number;

  constructor(
    id: number,
    x: number,
    y: number,
    gridX: number,
    gridY: number,
    letter: string,
    isBlock: boolean,
    relPos: RelPos
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    this.letter = letter;
    this.relPos = relPos;
    this.isBlock = isBlock;
  }

  setId(number: number) {
    this.number = number;
  }

  setIsBlock(number: number) {
    this.number = number;
  }

  setLetter(letter: string) {
    this.letter = letter;
  }

  setNumber(number: number) {
    this.number = number;
  }

  unsetNumber() {
    this.number = undefined;
  }
}

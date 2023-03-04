export type Clues = "vertical" | "horizontal" | "both" | "none";
export class Box {
  id: string;
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  letter: string;
  isBlock: boolean;
  clues: Clues = "none";
  number?: number;

  constructor(
    id: string,
    x: number,
    y: number,
    gridX: number,
    gridY: number,
    letter: string,
    isBlock: boolean
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    this.letter = letter;
    this.isBlock = isBlock;
  }

  // setId()
  setId(id: string) {
    this.id = id;
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

  setClues(clues: Clues) {
    this.clues = clues;
  }
}

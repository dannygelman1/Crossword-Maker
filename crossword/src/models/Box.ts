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
  clue?: string = "";
  number?: number;

  constructor(
    id: string,
    x: number,
    y: number,
    gridX: number,
    gridY: number,
    letter: string,
    isBlock: boolean,
    clue?: string
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    this.letter = letter;
    this.isBlock = isBlock;
    this.clue = clue;
  }

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

  setClue(clue: string) {
    this.clue = clue;
  }
}

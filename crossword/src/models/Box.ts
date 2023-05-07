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
  horizClue?: string = "";
  vertClue?: string = "";
  number?: number;
  input: string = "";
  userBoxId: string = "";
  playState: "correct" | "wrong" | "unchecked" = "unchecked";

  constructor(
    id: string,
    x: number,
    y: number,
    gridX: number,
    gridY: number,
    letter: string,
    isBlock: boolean,
    horizClue?: string,
    vertClue?: string
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    this.letter = letter;
    this.isBlock = isBlock;
    this.horizClue = horizClue;
    this.vertClue = vertClue;
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

  setInput(input: string) {
    this.input = input;
  }

  setUserBoxId(id: string) {
    this.userBoxId = id;
  }

  setPlayState(playState: "correct" | "wrong" | "unchecked") {
    this.playState = playState;
  }

  setClues(clues: Clues) {
    this.clues = clues;
  }

  setHorizClue(clue: string) {
    this.horizClue = clue;
  }

  setVertClue(clue: string) {
    this.vertClue = clue;
  }
}

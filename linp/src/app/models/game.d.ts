
export interface Game {
  host : string;
  name: string;
  players? : {[uid : string] :  GamePlayer};
}

export interface GamePlayer {
  uid : string;
  name : string;
  status : string;
  firstWord? : string;
}

export type GameStatus = "joining" | "waiting" | "FIRST_WORD_GIVEN";

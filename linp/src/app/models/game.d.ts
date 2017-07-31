
export interface Game {
  host : string;
  name: string;
  players? : {[uid : string] :  GamePlayer};
}

export interface GamePlayer {
  uid : string;
  name : string;
  status : string;
  firstSynonym? : string;
  wordOrRole? : string;
}

export type GameStatus = "joining" | "waiting" | "ROLE_OR_WORD_GIVEN" | "FIRST_WORD_GIVEN";


export interface Game {
  name: string;
  host : string;
  players? : {[uid : string] :  GamePlayer};
}

export interface GamePlayer {
  uid : string;
  name : string;
  wordOrRole? : string;
  status : string;
  firstSynonym? : string;
  firstTeamTip? : TeamTip;
}

export type GameStatus = "joining" | "waiting" | "ROLE_OR_WORD_GIVEN" | "FIRST_WORD_GIVEN";

export interface TeamTip{
  firstPartner : TeamPartner;
  secondPartner : TeamPartner;
}

export interface TeamPartner{
  uid : string;
}

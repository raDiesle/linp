
export interface Game {
  name: string;
  host : string;
  // alternative type possible?
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

export type GameStatus = "CREATED" | "JOINED" | "ROLE_OR_WORD_GIVEN" | "FIRST_WORD_GIVEN";

export interface TeamTip{
  firstPartner : TeamPartner;
  secondPartner : TeamPartner;
}

export interface TeamPartner{
  uid : string;
}

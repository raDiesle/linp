import {LANGUAGE} from "./context";

export interface Game {
  name: string;
  host: string;
  status: GameStatus; // TODO routes
  // alternative type possible?
  players?: GamePlayer[];
  round: number;
  createdAt: number;
  language: LANGUAGE;
  pointsScored?: PointsScored;
}

export interface PointsScored {
  firstTeamTip: number;
  secondTeamTip: number;
  total: number;
  totalRounds: number;
  indirect: number;
}


export interface GamePlayer {
  uid?: string;
  pos?: number;
  name?: string;
  isHost?: boolean;
  questionmarkOrWord?: string;
  status?: GamePlayerStatus;
  firstSynonym?: string;
  firstTeamTip?: TeamTip;
  secondSynonym?: string;
  secondTeamTip?: TeamTip;
  pointsScored?: PointsScored;
  totalRanking?: number;
}


export type GamePlayerStatus = 'JOINED_GAME' | 'READY_TO_START' | 'FIRST_SYNONYM_GIVEN'
  | 'FIRST_GUESS_GIVEN' | 'SECOND_SYNONYM_GIVEN' | 'SECOND_GUESS_GIVEN';

export type GameStatus =
  'welcome'
  | 'createaccount'
  | 'playerprofile'
  | 'gamerules'
  | 'joingame'
  | 'creategame'
  | 'gamelobby'
  | 'preparegame'
  | 'firsttip'
  | 'firstguess'
  | 'secondtip'
  | 'secondguess'
  | 'evaluation'
  | 'simulation'
  | 'createword';

export interface TeamTip {
  firstPartner: TeamPartner;
  secondPartner: TeamPartner;
}

export interface TeamPartner {
  uid: string;
  name: string;
}

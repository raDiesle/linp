export interface Game {
  name: string;
  host: string;
  status: GameStatusRoutes; // TODO routes
  // alternative type possible?
  players?: GamePlayer[];
  round: number;
}

export interface PointsScored {
  firstTeamTip: number;
  secondTeamTip: number;
  total: number;
  totalRounds: number;
  indirect: number;
}


export interface GamePlayer {
  uid: string;
  name: string;
  questionmarkOrWord?: string;
  status: GamePlayerStatus;
  firstSynonym?: string;
  firstTeamTip?: TeamTip;
  secondSynonym?: string;
  secondTeamTip?: TeamTip;
  pointsScored?: PointsScored;
}


export type GamePlayerStatus = 'JOINED_GAME' | 'READY_TO_START' | 'FIRST_SYNONYM_GIVEN'
  | 'FIRST_GUESS_GIVEN' | 'SECOND_SYNONYM_GIVEN' | 'SECOND_GUESS_GIVEN';

export type GameStatusRoutes = string;

export interface TeamTip {
  firstPartner: TeamPartner;
  secondPartner: TeamPartner;
}

export interface TeamPartner {
  uid: string;
  name: string;
}

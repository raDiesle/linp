export interface Game {
  name: string;
  host: string;
  status: GameStatus;
  // alternative type possible?
  players?: { [uid: string]: GamePlayer };
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
  status: string;
  firstSynonym?: string;
  firstTeamTip?: TeamTip;
  secondSynonym?: string;
  secondTeamTip?: TeamTip;
  pointsScored?: PointsScored;
}

export type GameStatus = 'CREATED' | 'JOINED' | 'ROLE_OR_WORD_GIVEN' | 'FIRST_WORD_GIVEN' | 'SECOND_WORD_GIVEN' | 'EVALUATE';

export interface TeamTip {
  firstPartner: TeamPartner;
  secondPartner: TeamPartner;
}

export interface TeamPartner {
  uid: string;
  name: string;
}

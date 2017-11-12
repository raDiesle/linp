export interface Game {
  name: string;
  host: string;
  status: GameStatus;
  // alternative type possible?
  players?: { [uid: string]: GamePlayer };
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
  status: string;
  firstSynonym?: string;
  firstTeamTip?: TeamTip;
  secondSynonym?: string;
  secondTeamTip?: TeamTip;
  pointsScored?: PointsScored;
}

// CREATE_GAME
// JOIN_GAME

// GAME_LOBBY
// PREPARE_GAME
// FIRST_WORD
// FIRST_GUESS
// SECOND_WORD
// SECOND_GUESS
// EVALUATE_POINTS
// PREPARE_GAME

export type GameStatus = 'GAME_LOBBY' | 'PREPARE_GAME' | 'ROLE_OR_WORD_GIVEN' | 'FIRST_WORD_GIVEN'
  | 'FIRST_GUESS_GIVEN' | 'SECOND_WORD_GIVEN' | 'SECOND_GUESS_GIVEN' | 'EVALUATED';

export interface TeamTip {
  firstPartner: TeamPartner;
  secondPartner: TeamPartner;
}

export interface TeamPartner {
  uid: string;
  name: string;
}

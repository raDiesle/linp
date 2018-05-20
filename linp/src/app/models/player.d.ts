export interface PlayerProfile {
  uid?: string,
  name?: string;
  uistates? : UiStates;
}

export interface UiStates{
  showHelpPopover: boolean;
  showShortDescription: boolean;
}

export interface PlayerFriendlist {
  uid: string;
  name: string;
  isOnline: boolean;
  lastOnline: number;
}

export interface ActivePlayerGame {
  name: string;
  isActionRequired: boolean;
  since: number;
}

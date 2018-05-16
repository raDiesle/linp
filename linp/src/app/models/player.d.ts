export interface PlayerProfile {
  uid?: string,
  name?: string;
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
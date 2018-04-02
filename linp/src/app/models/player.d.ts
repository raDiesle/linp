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
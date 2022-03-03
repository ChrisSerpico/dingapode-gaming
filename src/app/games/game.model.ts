export interface Game {
  id?: string;
  name: string;
  price: number;
  platform: string;
  favorability: number;
  blueMoonFavorability: number;
  numRatings: number;
  usersRated: string[];
}

export interface TeamStructure {
  _id: string;
  name: string;
  ridersNames: string[];
  championshipTitles: number;
  imageUrl: string;
  altImageText: string;
  description: string;
  debutYear: number;
  isOfficialTeam: boolean;
}

export type TeamWithoutId = Omit<TeamStructure, "_id">;

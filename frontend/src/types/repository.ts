export interface Repository {
  id: number;
  name: string;
  owner: string;
  version: string;
  releaseNotes: string;
  seenByUser: boolean;
  releaseDate?: string | null;
}
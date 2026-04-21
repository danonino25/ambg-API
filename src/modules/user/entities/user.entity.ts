export class User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  password?: string;
  hash?: string | null;
  create_at: Date;
}
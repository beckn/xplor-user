export interface SignJwtDto {
  userId: string;
  role: any; // Consider specifying a more specific type if possible
  expiresIn: string;
}

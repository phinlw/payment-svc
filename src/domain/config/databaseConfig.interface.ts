/* eslint-disable prettier/prettier */
  export interface DatabaseConfigInterface {
  getDBHost(): string;
  getDBName(): string;
  getDBPort(): number;
  getDBUser(): string;
  getDBPass(): string;
}
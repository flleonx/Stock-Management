
interface IdbCredentials{
  host:string;
  user:string;
  password:string;
  database:string;
}

import payload from "./config/credenciales.json"
const dbCredentials: IdbCredentials = payload;

export default dbCredentials;

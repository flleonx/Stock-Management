import routerStatement from 'express';
import {MysqlError} from 'mysql';
import bcrypt from 'bcryptjs';

//PERSONAL MODULES:
import database from '../config/dbConfig';

const router = routerStatement.Router();

interface IUser {
  user: string;
  password: string;
  idRol: string;
}

router.post('/api/register', async (req, res) => {
  const password: string = req.body.user.password;
  const encryptedPassword: string = await bcrypt.hash(password, 10);
  const userData: IUser = {
    user: req.body.user.username,
    password: encryptedPassword,
    idRol: req.body.user.idRol,
  };

  //VALIDATION OF THE USERNAME:
  let usernamesQuery: string =
    'SELECT * FROM InventoryManagement.USUARIOS WHERE user = ?';
  let usernamesDB = database.query(
    usernamesQuery,
    userData.user,
    (err: MysqlError | null, usernames: string) => {
      if (err) throw err;

      if (usernames.length > 0) {
        //THE NUMBER ONE INDICATES THAT THE USERNAME EXISTS
        res.end(JSON.stringify('1'));
      } else {
        //SAVE THE USER INFORMATION IN THE DB:
        let registerQuery: string = 'INSERT INTO USUARIOS SET ?';
        let query = database.query(
          registerQuery,
          userData,
          (err: MysqlError | null, result: any) => {
            if (err) throw err;
          }
        );
        //THE NUMBER TWO INDICATES THAT THE USERNAME DOESN'T EXISTS
        res.end(JSON.stringify('2'));
      }
    }
  );
});

export default router;

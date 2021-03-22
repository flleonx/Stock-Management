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
  let registerQuery = 'INSERT INTO USUARIOS SET ?';
  let query = database.query(
    registerQuery,
    userData,
    (err: MysqlError | null, result: any) => {
      if (err) throw err;
    }
  );
});

export default router;

import routerStatement from 'express';
import {MysqlError} from 'mysql';
import passport from 'passport';
import bcrypt from 'bcryptjs';

//PERSONAL MODULES:
import database from '../config/dbConfig';

const router = routerStatement.Router();

//REGISTER USERS IN THE DATABASE:
interface IUser {
  user: string;
  password: string;
  idRol: string;
}

router.post('/api/register', async (req: any, res: any) => {
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

//LOGIN PART:
router.post('/api/login', (req: any, res: any, next: any) => {
  console.log(req.body);
  passport.authenticate('local.login', (err: any, user: any, info: any) => {
    if (err) throw err;
    if (user) {
      req.login(user, (err: any) => {
        if (err) throw err;
        res.end(JSON.stringify('EXITO: EL USUARIO ESTÁ AUTENTICADO'));
      });
    } else {
      res.end(JSON.stringify('ERROR'));
    }
    console.log(err);
    console.log(user);
  })(req, res, next);
});

//ROUTE TO KNOW IF THE USER IS AUTH OR NOT:
router.get('/api/isAuth', (req: any, res: any) => {
  console.log(req.isAuthenticated());
  res.end(JSON.stringify(req.isAuthenticated()));
});

//LOG OUT
router.post('/api/logout', (req: any, res: any) => {
  req.logout();
  req.session.destroy((err: any) => {
    res.clearCookie('connect.sid');
    // Don't redirect, just print text
    res.send('Logged out');
  });
});

export default router;

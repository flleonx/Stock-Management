import passport from 'passport';
import bcrypt from 'bcryptjs';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

//PERSONAL MODULES:
import database from '../config/dbConfig';

// LOGIN:
passport.use(
  'local.login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req: any, username: any, password: any, done) => {
      database.query(
        'SELECT * FROM InventoryManagement.USUARIOS WHERE user = ?',
        [username],
        async (err, result) => {
          if (err) throw err;
          const userInfo = await result[0];
          const user = {
            id: userInfo.id,
            user: userInfo.user,
            idRol: userInfo.idRol,
          };
          if (result[0] == null) {
            console.log('Ese usuario NO existe');
            done(null, false);
          } else {
            console.log('SI EXISTE EL USUARIO');
            const validPassword = await bcrypt.compare(
              password,
              result[0].password
            );
            if (validPassword) {
              console.log('Las contraseñas coinciden');
              done(null, user);
            } else {
              console.log('No coinciden');
              done(null, false);
            }
          }
        }
      );
    }
  )
);

passport.serializeUser(function (user: any, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

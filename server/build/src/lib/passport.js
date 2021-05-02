"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = __importDefault(require("passport-local"));
const LocalStrategy = passport_local_1.default.Strategy;
//PERSONAL MODULES:
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
// LOGIN:
passport_1.default.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, username, password, done) => {
    dbConfig_1.default.query('SELECT * FROM InventoryManagement.USUARIOS WHERE user = ?', [username], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        const userInfo = yield result[0];
        if (result[0] == null) {
            console.log('Ese usuario NO existe');
            done(null, false);
        }
        else {
            console.log('SI EXISTE EL USUARIO');
            const validPassword = yield bcryptjs_1.default.compare(password, result[0].password);
            if (validPassword) {
                console.log('Las contraseñas coinciden');
                const user = {
                    id: userInfo.id || '',
                    user: userInfo.user,
                    idRol: userInfo.idRol,
                };
                done(null, user);
            }
            else {
                console.log('No coinciden');
                done(null, false);
            }
        }
    }));
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});

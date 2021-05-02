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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//PERSONAL MODULES:
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const router = express_1.default.Router();
router.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.user.password;
    const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
    const userData = {
        user: req.body.user.username,
        password: encryptedPassword,
        idRol: req.body.user.idRol,
    };
    //VALIDATION OF THE USERNAME:
    let usernamesQuery = 'SELECT * FROM InventoryManagement.USUARIOS WHERE user = ?';
    let usernamesDB = dbConfig_1.default.query(usernamesQuery, userData.user, (err, usernames) => {
        if (err)
            throw err;
        if (usernames.length > 0) {
            //THE NUMBER ONE INDICATES THAT THE USERNAME EXISTS
            res.end(JSON.stringify('1'));
        }
        else {
            //SAVE THE USER INFORMATION IN THE DB:
            let registerQuery = 'INSERT INTO USUARIOS SET ?';
            let query = dbConfig_1.default.query(registerQuery, userData, (err, result) => {
                if (err)
                    throw err;
            });
            //THE NUMBER TWO INDICATES THAT THE USERNAME DOESN'T EXISTS
            res.end(JSON.stringify('2'));
        }
    });
}));
//LOGIN PART:
router.post('/api/login', (req, res, next) => {
    console.log(req.body);
    passport_1.default.authenticate('local.login', (err, user, info) => {
        if (err)
            throw err;
        if (user) {
            req.login(user, (err) => {
                if (err)
                    throw err;
                res.end(JSON.stringify('EXITO: EL USUARIO ESTÁ AUTENTICADO'));
            });
        }
        else {
            res.end(JSON.stringify('ERROR'));
        }
    })(req, res, next);
});
//ROUTE TO KNOW IF THE USER IS AUTH OR NOT:
router.get('/api/isAuth', (req, res) => {
    res.end(JSON.stringify(req.user));
    // res.end(JSON.stringify(req.isAuthenticated()));
});
//LOG OUT
router.post('/api/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        // Don't redirect, just print text
        res.send('Logged out');
    });
});
exports.default = router;

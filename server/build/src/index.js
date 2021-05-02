"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const MySQLStore = require('express-mysql-session')(express_session_1.default);
//PERSONAL MODULES:
const dbCredentials_1 = __importDefault(require("./dbCredentials"));
// STATEMENTS
const app = express_1.default();
// MIDDfrom
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default({
    origin: 'http://localhost:51000',
    credentials: true,
}));
app.use(express_session_1.default({
    secret: 'asdf33g4w4hghjkuil8saef345',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(dbCredentials_1.default),
}));
app.use(cookie_parser_1.default('asdf33g4w4hghjkuil8saef345'));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
require("./lib/passport");
//GLOBAL VARIABLES:
app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
});
// ROUTES
// GET
const getDesignReq_1 = __importDefault(require("./querys/getRequests/getDesignReq"));
const getDressMakingReq_1 = __importDefault(require("./querys/getRequests/getDressMakingReq"));
const getWareHouseReq_1 = __importDefault(require("./querys/getRequests/getWareHouseReq"));
const getWareHouseProductsReq_1 = __importDefault(require("./querys/getRequests/getWareHouseProductsReq"));
const getShopsReq_1 = __importDefault(require("./querys/getRequests/getShopsReq"));
//POST
const postDressMakingReq_1 = __importDefault(require("./querys/postRequests/postDressMakingReq"));
const postDesignReq_1 = __importDefault(require("./querys/postRequests/postDesignReq"));
const postDesignReqConsumption_1 = __importDefault(require("./querys/postRequests/postDesignReqConsumption"));
const postWareHouseReq_1 = __importDefault(require("./querys/postRequests/postWareHouseReq"));
const postShopsReq_1 = __importDefault(require("./querys/postRequests/postShopsReq"));
const postWareHouseProductsReq_1 = __importDefault(require("./querys/postRequests/postWareHouseProductsReq"));
// AUTH ROUTES
const authRequest_1 = __importDefault(require("./querys/authRequest"));
// GET APP.USE
app.use(getDesignReq_1.default);
app.use(getDressMakingReq_1.default);
app.use(getWareHouseReq_1.default);
app.use(getWareHouseProductsReq_1.default);
app.use(getShopsReq_1.default);
// POST APP.USE
app.use(postDressMakingReq_1.default);
app.use(postDesignReq_1.default);
app.use(postDesignReqConsumption_1.default);
app.use(postWareHouseReq_1.default);
app.use(postShopsReq_1.default);
app.use(postWareHouseProductsReq_1.default);
// AUTH ROUTES APP.USE
app.use(authRequest_1.default);
// PORT STATEMENT
app.listen(52000, () => {
    console.log('Running on port 52000');
});

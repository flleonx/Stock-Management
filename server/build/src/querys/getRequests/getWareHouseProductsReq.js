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
const router = express_1.default.Router();
const dbConfig_1 = __importDefault(require("../../config/dbConfig"));
router.get("/api/getwarehouseproducts", (req, res) => {
    let queryWareHouseProducts = "SELECT bp.*, mp.nombre_imagen FROM BODEGA_PRODUCTOS bp, MUESTRAS_PRODUCCION mp WHERE cantidad NOT IN (0) AND bp.referencia = mp.referencia";
    dbConfig_1.default.query(queryWareHouseProducts, (err, wareHouseProducts) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        console.log(wareHouseProducts);
        res.end(JSON.stringify(wareHouseProducts));
    }));
});
router.get("/api/getactualshoprequests", (req, res) => {
    let queryShopsRequests = "SELECT pa.*, t.nombre_tienda, t.direccion FROM PETICIONES_ACTIVAS_TIENDAS pa, tienda t WHERE pa.idTienda = t.idTienda";
    dbConfig_1.default.query(queryShopsRequests, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(result));
    }));
});
exports.default = router;

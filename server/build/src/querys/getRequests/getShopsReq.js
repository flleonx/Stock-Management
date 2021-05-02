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
router.get("/api/shopsinformation", (req, res) => {
    let queryShopsInfo = "SELECT * FROM InventoryManagement.tienda";
    dbConfig_1.default.query(queryShopsInfo, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(result));
    }));
});
router.get("/api/deliverystate", (req, res) => {
    let queryShopsInfo = "SELECT it.*, es.nombre_estado, SUM(cantidad) as cantidadTotal FROM INVENTARIO_TIENDAS it, estados es WHERE it.id_estado = 0 AND it.id_estado = es.id_estado GROUP BY numero_de_orden";
    dbConfig_1.default.query(queryShopsInfo, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(result));
    }));
});
router.get("/api/getactualinventory", (req, res) => {
    let queryShopsInfo = "SELECT it.*, es.nombre_estado, SUM(cantidad) as cantidadTotal FROM INVENTARIO_TIENDAS it, estados es WHERE it.id_estado = 1 AND it.id_estado = es.id_estado GROUP BY numero_de_orden";
    dbConfig_1.default.query(queryShopsInfo, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(result));
    }));
});
exports.default = router;

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
router.get('/api/warehousecodes', (req, res) => {
    let referencesQuery = 'SELECT * FROM InventoryManagement.BODEGA_INSUMOS';
    let dbQuery = dbConfig_1.default.query(referencesQuery, (err, references) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(references));
    }));
});
router.get('/api/production', (req, res) => {
    let sampleQuery = 'SELECT m.referencia, t.talla, m.descripcion, m.color, m.nombre_imagen FROM MUESTRAS_PRODUCCION m, TALLA t WHERE m.id_talla=t.id_talla';
    let dbQuery = dbConfig_1.default.query(sampleQuery, (err, references) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(references));
    }));
});
exports.default = router;

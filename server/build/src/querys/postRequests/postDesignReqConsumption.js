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
router.post('/api/getreferenceconsumption', (req, res) => {
    const reference = req.body.referenceSelection;
    console.log(reference);
    var enable = true;
    // RETURN CODES AND AMOUNT OF GOODS IN "CONSUMO_DE_INSUMOS"
    let consumptionQuery = 'SELECT codigoycantidad FROM InventoryManagement.MUESTRAS_PRODUCCION WHERE referencia = ?';
    // ROW DATA PACKET ? TPYE
    dbConfig_1.default.query(consumptionQuery, [reference], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        let data = result[0].codigoycantidad.split(',');
        var suppliesCodes = []; // CODES OF REQUIRES ITEMS.
        var amountConsumption = []; // AMOUT FOR EACH ITEM 1-->1 RELATION.
        data.map((dato) => {
            if (enable) {
                suppliesCodes.push(dato);
                enable = !enable;
            }
            else {
                amountConsumption.push(parseFloat(dato));
                enable = !enable;
            }
        });
        let j = 0;
        let consumptionSupplies = [];
        suppliesCodes.map((code) => {
            let querySuppliesConsumption = `SELECT * FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
            dbConfig_1.default.query(querySuppliesConsumption, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    throw err;
                }
                consumptionSupplies.push(Object.assign(Object.assign({}, result[0]), { consumptionAmount: amountConsumption[j] }));
                if (j + 1 == suppliesCodes.length) {
                    res.end(JSON.stringify(consumptionSupplies));
                }
                j += 1;
            }));
        });
    }));
});
exports.default = router;

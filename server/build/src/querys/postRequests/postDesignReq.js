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
router.post('/api/savenewreference', (req, res) => {
    console.log(req.body);
    let enable1 = false;
    let enable2 = true;
    let CodesAndConsumption = '';
    var x = 0;
    // BUILD STRING FOR THE COLUMN: codigoycantidad
    req.body.addedInformationFromModal.map((piece) => {
        if (x + 1 < req.body.addedInformationFromModal.length &&
            piece.supplyCode != '' &&
            piece.supplyAmount != '') {
            CodesAndConsumption =
                CodesAndConsumption + piece.supplyCode + ',' + piece.supplyAmount + ',';
        }
        else if (x + 1 == req.body.addedInformationFromModal.length &&
            piece.supplyCode != '' &&
            piece.supplyAmount != '') {
            CodesAndConsumption =
                CodesAndConsumption + piece.supplyCode + ',' + piece.supplyAmount;
            enable1 = true;
        }
        else {
            res.end(JSON.stringify('FAILED_REQUEST'));
        }
        x = x + 1;
    });
    let queryVerifyReference = `SELECT referencia FROM InventoryManagement.MUESTRAS_PRODUCCION`;
    dbConfig_1.default.query(queryVerifyReference, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
        }
        result.map((reference) => {
            if (reference.referencia == req.body.addReference) {
                console.log('DESACTIVAR ENABLE 2');
                enable2 = false;
                res.end(JSON.stringify('INVALID_REFERENCE'));
            }
        });
        if (enable1 && enable2) {
            const referenceObject = {
                referencia: req.body.addReference,
                id_talla: req.body.addSize,
                descripcion: req.body.addDescription,
                color: req.body.addColor,
                nombre_imagen: req.body.addImageName,
                codigoycantidad: CodesAndConsumption,
            };
            let querySaveNewReference = `INSERT INTO InventoryManagement.MUESTRAS_PRODUCCION SET ?`;
            dbConfig_1.default.query(querySaveNewReference, referenceObject, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    throw err;
                }
                // triggerFunction();
                res.end(JSON.stringify('SUCCESSFUL_REQUEST'));
            }));
            // const triggerFunction = () => {
            //   let queryReferenceConsumption = `INSERT INTO InventoryManagement.CONSUMO_DE_INSUMO (referencia, codigoycantidad) VALUES(${req.body.addReference},"${CodesAndConsumption}")`;
            //   database.query(
            //     queryReferenceConsumption,
            //     async (err: MysqlError | null, result: any) => {
            //       if (err) {
            //         throw err;
            //       }
            //       res.end(JSON.stringify('SUCCESSFUL_REQUEST'));
            //     }
            //   );
            // };
        }
    }));
    console.log(enable1, enable2);
});
exports.default = router;

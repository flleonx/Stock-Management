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
//PERSONAL MODULES:
const dbConfig_1 = __importDefault(require("../../config/dbConfig"));
const router = express_1.default.Router();
//SAVE THE INFORMATION OF BODEGA
router.post('/api/savecloth', (req, res) => {
    let newCode = true;
    // console.log(req.body.newCloth);
    let queryVerifyCodes = 'SELECT codigo FROM BODEGA_INSUMOS';
    dbConfig_1.default.query(queryVerifyCodes, (err, result) => {
        if (err) {
            throw err;
        }
        result.map((code) => {
            if (code.codigo == req.body.newCloth.code) {
                newCode = false;
            }
        });
        if (newCode) {
            addNewCode();
        }
        else {
            res.end(JSON.stringify('EXISTING_CODE'));
        }
    });
    const addNewCode = () => {
        if (req.body.newCloth.type === 'Tela') {
            const newCloth = {
                codigo: req.body.newCloth.code,
                color: req.body.newCloth.color,
                metros: req.body.newCloth.amount,
                descripcion: req.body.newCloth.description,
                nombre_imagen: req.body.newCloth.img,
            };
            console.log(newCloth);
            let newClothQuery = 'INSERT INTO BODEGA_INSUMOS SET ?';
            let query = dbConfig_1.default.query(newClothQuery, newCloth, (err, result) => {
                if (err)
                    throw err;
                res.end(JSON.stringify('SUCCESSFUL_ADDING'));
            });
        }
        if (req.body.newCloth.type === 'Insumo') {
            const newCloth = {
                codigo: req.body.newCloth.code,
                color: req.body.newCloth.color,
                cantidad: req.body.newCloth.amount,
                descripcion: req.body.newCloth.description,
                nombre_imagen: req.body.newCloth.img,
            };
            console.log(newCloth);
            let newClothQuery = 'INSERT INTO BODEGA_INSUMOS SET ?';
            let query = dbConfig_1.default.query(newClothQuery, newCloth, (err, result) => {
                if (err)
                    throw err;
                res.end(JSON.stringify('SUCCESSFUL_ADDING'));
            });
        }
    };
});
router.post('/api/updatewarehouseinventory', (req, res) => {
    let queryVerifyField = `SELECT metros, cantidad FROM BODEGA_INSUMOS WHERE codigo = ${req.body.code}`;
    let field = '';
    let addition = 0;
    dbConfig_1.default.query(queryVerifyField, (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0].metros === null) {
            field = 'cantidad';
            addition = result[0].cantidad + parseFloat(req.body.amount);
        }
        else {
            field = 'metros';
            addition = result[0].metros + parseFloat(req.body.amount);
        }
        let queryUpdateAmount = `UPDATE BODEGA_INSUMOS SET ${field} = ${addition} WHERE codigo = ${req.body.code}`;
        dbConfig_1.default.query(queryUpdateAmount, (err, result) => {
            if (err) {
                throw err;
            }
            res.end(JSON.stringify('SUCCESSFUL_UPDATE'));
        });
    });
});
router.post('/api/suppliesrequest', (req, res) => {
    const reference = req.body.referenceSelection;
    const amount = parseInt(req.body.actualAmount);
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
        var amountProduction = []; // AMOUT FOR EACH ITEM 1-->1 RELATION.
        data.map((dato) => {
            if (enable) {
                suppliesCodes.push(dato);
                enable = !enable;
            }
            else {
                amountProduction.push(parseFloat(dato) * amount);
                enable = !enable;
            }
        });
        var i = 0;
        var x = 0;
        let checkSupplies = true;
        let insufficientCodes = [];
        let remainingAmount = [];
        // RETURN THE AMOUNT FOR EACH CODE IN "BODEGA_INSUMOS"
        suppliesCodes.map((code) => {
            let suppliesQuery = `SELECT metros, cantidad FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
            dbConfig_1.default.query(suppliesQuery, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    throw err;
                }
                let diff;
                if (result[0].metros != null) {
                    diff = parseFloat(result[0].metros) - amountProduction[i];
                    if (diff < 0) {
                        checkSupplies = false;
                        insufficientCodes.push(code);
                        remainingAmount.push((diff * -1).toString());
                    }
                }
                if (result[0].cantidad != null) {
                    diff = parseFloat(result[0].cantidad) - amountProduction[i];
                    if (diff < 0) {
                        checkSupplies = false;
                        insufficientCodes.push(code);
                        remainingAmount.push((diff * -1).toString());
                    }
                }
                if (i + 1 == suppliesCodes.length && checkSupplies == true) {
                    let x = 0;
                    suppliesCodes.map((code) => {
                        // SAVE THE DIFFERENCE BETWEEN THE REQUIRE COMPONENTS AND THE ACTUAL AMOUNT OF COMPONENTS IN "BODEGA_INSUMOS'"
                        let suppliesQuery = `SELECT metros, cantidad FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
                        dbConfig_1.default.query(suppliesQuery, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                throw err;
                            }
                            const triggerF = (diff, type) => {
                                let saveDifference = `UPDATE InventoryManagement.BODEGA_INSUMOS SET ${type} = ${diff} WHERE codigo = ${code}`;
                                dbConfig_1.default.query(saveDifference, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                                    if (err) {
                                        throw err;
                                    }
                                }));
                            };
                            // SEND THE DIFF AND THE TYPE (METROS OR CANTIDAD)
                            if (result[0].metros != null) {
                                const diff = parseFloat(result[0].metros) - amountProduction[x];
                                const type = 'metros';
                                triggerF(diff, type);
                            }
                            if (result[0].cantidad != null) {
                                const diff = parseFloat(result[0].cantidad) - amountProduction[x];
                                const type = 'cantidad';
                                triggerF(diff, type);
                            }
                            if (x + 1 == suppliesCodes.length) {
                                res.end(JSON.stringify('SUCCESSFUL_REQUEST'));
                            }
                            x = x + 1;
                        }));
                    });
                    // res.end(JSON.stringify('SUCCESSFUL_REQUEST'));
                }
                else if (i + 1 == suppliesCodes.length &&
                    checkSupplies == false) {
                    let j = 0;
                    let insufficientSupplies = [];
                    insufficientCodes.map((code) => {
                        let queryInsufficientSupplies = `SELECT * FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
                        dbConfig_1.default.query(queryInsufficientSupplies, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                throw err;
                            }
                            insufficientSupplies.push(Object.assign(Object.assign({}, result[0]), { remainingAmount: remainingAmount[j] }));
                            if (j + 1 == insufficientCodes.length) {
                                res.end(JSON.stringify(insufficientSupplies));
                            }
                            j += 1;
                        }));
                    });
                }
                i = i + 1;
            }));
        });
    }));
});
router.post('/api/savewarehousedecision', (req, res) => {
    let saveData = {
        referencia: req.body.referencia,
        cantidad: req.body.cantidad,
        timestamp: req.body.timestamp,
        idDecision: req.body.idDecision,
    };
    console.log(req.body.timestamp);
    let deleteData = req.body;
    let queryInsertDecision = 'INSERT INTO PETICIONES_PROCESADAS_CONFECCION SET ?';
    dbConfig_1.default.query(queryInsertDecision, [saveData], (err, result) => {
        if (err) {
            throw err;
        }
    });
    if (req.body.idDecision == 1) {
        let saveDataDressMaking = {
            referencia: req.body.referencia,
            cantidad: req.body.cantidad,
            timestamp: req.body.timestamp,
        };
        let queryInsertDressMaking = 'INSERT INTO PROCESO_CONFECCION SET ?';
        dbConfig_1.default.query(queryInsertDressMaking, [saveDataDressMaking], (err, result) => {
            if (err) {
                throw err;
            }
        });
    }
    let queryDeleteApproval = `DELETE FROM PETICIONES_ACTIVAS_CONFECCION WHERE id = ${deleteData.id}`;
    dbConfig_1.default.query(queryDeleteApproval, (err, result) => {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify('SUCCESSFUL_SAVING'));
    });
});
router.post('/api/temporal', (req, res) => {
    let enable = true;
    const reference = req.body.referenceSelection;
    const amount = parseInt(req.body.actualAmount);
    let consumptionQuery = 'SELECT codigoycantidad FROM InventoryManagement.MUESTRAS_PRODUCCION WHERE referencia = ?';
    dbConfig_1.default.query(consumptionQuery, [reference], (err, result) => {
        if (err) {
            throw err;
        }
        let data = result[0].codigoycantidad.split(',');
        var suppliesCodes = []; // CODES OF REQUIRES ITEMS.
        var amountProduction = []; // AMOUT FOR EACH ITEM 1-->1 RELATION.
        data.map((dato) => {
            if (enable) {
                suppliesCodes.push(dato);
                enable = !enable;
            }
            else {
                amountProduction.push(parseFloat(dato) * amount);
                enable = !enable;
            }
        });
        let codesString = suppliesCodes.join();
        let suppliesQuery = `SELECT * FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo IN (${codesString}) ORDER BY FIND_IN_SET(codigo,'${codesString}')`;
        dbConfig_1.default.query(suppliesQuery, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw err;
            }
            console.log(result);
            amountProduction.map((amount, i) => {
                result[i] = Object.assign(Object.assign({}, result[i]), { amount });
            });
            res.end(JSON.stringify(result));
        }));
    });
});
exports.default = router;

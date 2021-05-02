"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//PERSONAL MODULES:
const dbConfig_1 = __importDefault(require("../../config/dbConfig"));
const router = express_1.default.Router();
router.post("/api/savewarehouseproductsdecision", (req, res) => {
    let date = new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" });
    let arrDate = date.split(" ");
    let s1 = arrDate[0].split("/");
    if (s1[0].length < 2)
        s1[0] = "0" + s1[0];
    if (s1[1].length < 2)
        s1[1] = "0" + s1[1];
    let dateFormat = s1.join("-");
    let s2 = arrDate[1].split(":");
    if (s2[0].length < 2)
        s2[0] = "0" + s2[0];
    if (s2[1].length < 2)
        s2[1] = "0" + s2[1];
    if (s2[2].length < 2)
        s2[2] = "0" + s2[2];
    let hour = s2.join(":");
    let timestamp = dateFormat + " " + hour;
    let saveData = {
        numero_de_orden: req.body.numero_de_orden,
        referencia: req.body.referencia,
        cantidad: req.body.cantidad,
        timestamp: timestamp,
        idDecision: req.body.idDecision,
        idTienda: req.body.idTienda,
    };
    console.log(`EEEEEEEEEEE: ${req.body.timestamp}`);
    let deleteData = req.body;
    console.log(deleteData);
    let queryInsertDecision = "INSERT INTO PETICIONES_PROCESADAS_TIENDAS SET ?";
    dbConfig_1.default.query(queryInsertDecision, [saveData], (err) => {
        if (err) {
            throw err;
        }
    });
    if (req.body.idDecision === 1) {
        let staticData = {
            referencia: req.body.referencia,
            numero_de_orden: req.body.numero_de_orden,
            idTienda: req.body.idTienda,
        };
        req.body.neededStock.map((entry) => {
            let saveDataDressMaking = Object.assign(Object.assign({}, staticData), { cantidad: entry.cantidad, numero_lote: entry.numero_de_orden, timestamp });
            if (entry.cantidad !== 1) {
                for (let i = 0; i < entry.cantidad; i++) {
                    saveDataDressMaking = Object.assign(Object.assign({}, saveDataDressMaking), { cantidad: 1 });
                    let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
                    dbConfig_1.default.query(queryInsertDressMaking, [saveDataDressMaking], (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            else {
                let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
                dbConfig_1.default.query(queryInsertDressMaking, [saveDataDressMaking], (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
            let value = entry.restante ? entry.restante : 0;
            let queryUpdateWareHouseP = `UPDATE BODEGA_PRODUCTOS SET cantidad = ${value} WHERE numero_lote = ${entry.numero_lote}`;
            dbConfig_1.default.query(queryUpdateWareHouseP, (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    }
    let queryCleanShopsBuffer = `DELETE FROM PETICIONES_ACTIVAS_TIENDAS WHERE numero_de_orden = ${deleteData.numero_de_orden}`;
    dbConfig_1.default.query(queryCleanShopsBuffer, (err) => {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify("SUCCESSFUL_SAVING"));
    });
});
router.post("/api/updatepartialdelivery", (req, res) => {
    let date = new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" });
    let arrDate = date.split(" ");
    let s1 = arrDate[0].split("/");
    if (s1[0].length < 2)
        s1[0] = "0" + s1[0];
    if (s1[1].length < 2)
        s1[1] = "0" + s1[1];
    let dateFormat = s1.join("-");
    let s2 = arrDate[1].split(":");
    if (s2[0].length < 2)
        s2[0] = "0" + s2[0];
    if (s2[1].length < 2)
        s2[1] = "0" + s2[1];
    if (s2[2].length < 2)
        s2[2] = "0" + s2[2];
    let hour = s2.join(":");
    let timestamp = dateFormat + " " + hour;
    let saveData = {
        numero_de_orden: req.body.numero_de_orden,
        referencia: req.body.referencia,
        cantidad: req.body.neededStock[req.body.neededStock.length - 1].acumulado,
        timestamp: timestamp,
        idDecision: req.body.idDecision,
        idTienda: req.body.idTienda,
    };
    let deleteData = req.body;
    let queryInsertDecision = "INSERT INTO PETICIONES_PROCESADAS_TIENDAS SET ?";
    dbConfig_1.default.query(queryInsertDecision, [saveData], (err) => {
        if (err) {
            throw err;
        }
    });
    if (req.body.idDecision === 1) {
        let staticData = {
            referencia: req.body.referencia,
            numero_de_orden: req.body.numero_de_orden,
            idTienda: req.body.idTienda,
        };
        req.body.neededStock.map((entry) => {
            let saveDataDressMaking = Object.assign(Object.assign({}, staticData), { cantidad: entry.cantidad, numero_lote: entry.numero_de_orden, timestamp });
            if (entry.cantidad !== 1) {
                for (let i = 0; i < entry.cantidad; i++) {
                    saveDataDressMaking = Object.assign(Object.assign({}, saveDataDressMaking), { cantidad: 1 });
                    let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
                    dbConfig_1.default.query(queryInsertDressMaking, [saveDataDressMaking], (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            else {
                let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
                dbConfig_1.default.query(queryInsertDressMaking, [saveDataDressMaking], (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
            let value = entry.restante ? entry.restante : 0;
            let queryUpdateWareHouseP = `UPDATE BODEGA_PRODUCTOS SET cantidad = ${value} WHERE numero_lote = ${entry.numero_lote}`;
            dbConfig_1.default.query(queryUpdateWareHouseP, (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    }
    let queryCleanShopsBuffer = `DELETE FROM PETICIONES_ACTIVAS_TIENDAS WHERE numero_de_orden = ${deleteData.numero_de_orden}`;
    dbConfig_1.default.query(queryCleanShopsBuffer, (err) => {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify("SUCCESSFUL_SAVING"));
    });
});
exports.default = router;

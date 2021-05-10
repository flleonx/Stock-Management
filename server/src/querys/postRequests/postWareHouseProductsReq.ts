import routerStatement, { query } from "express";
import { MysqlError } from "mysql";
import { runInNewContext } from "node:vm";

//PERSONAL MODULES:
import database from "../../config/dbConfig";
import timestamp_generator from "../../chunks/timestamp_generator";

const router = routerStatement.Router();

router.post("/api/savewarehouseproductsdecision", (req, res) => {
  interface INeededStock {
    numero_lote: number;
    referencia: number;
    numero_de_orden: number;
    cantidad: number;
    timestamp: string;
    restante?: number;
  }

  let timestamp = timestamp_generator();
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
  database.query(queryInsertDecision, [saveData], (err: MysqlError | null) => {
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
    req.body.neededStock.map((entry: INeededStock) => {
      let saveDataDressMaking = {
        ...staticData,
        cantidad: entry.cantidad,
        numero_lote: entry.numero_de_orden,
        timestamp,
      };
      if (entry.cantidad !== 1) {
        for (let i = 0; i < entry.cantidad; i++) {
          saveDataDressMaking = {
            ...saveDataDressMaking,
            cantidad: 1,
          };
          let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
          database.query(
            queryInsertDressMaking,
            [saveDataDressMaking],
            (err: MysqlError | null) => {
              if (err) {
                throw err;
              }
            }
          );
        }
      } else {
        let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
        database.query(
          queryInsertDressMaking,
          [saveDataDressMaking],
          (err: MysqlError | null) => {
            if (err) {
              throw err;
            }
          }
        );
      }

      let value = entry.restante ? entry.restante : 0;
      let queryUpdateWareHouseP = `UPDATE BODEGA_PRODUCTOS SET cantidad = ${value} WHERE numero_lote = ${entry.numero_lote}`;
      database.query(queryUpdateWareHouseP, (err: MysqlError | null) => {
        if (err) {
          throw err;
        }
      });
    });
  }

  let queryCleanShopsBuffer = `DELETE FROM PETICIONES_ACTIVAS_TIENDAS WHERE numero_de_orden = ${deleteData.numero_de_orden}`;
  database.query(queryCleanShopsBuffer, (err: MysqlError | null) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify("SUCCESSFUL_SAVING"));
  });
});

router.post("/api/updatepartialdelivery", (req, res) => {
  interface INeededStock {
    numero_lote: number;
    referencia: number;
    numero_de_orden: number;
    cantidad: number;
    timestamp: string;
    restante?: number;
  }

  let timestamp = timestamp_generator();
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
  database.query(queryInsertDecision, [saveData], (err: MysqlError | null) => {
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
    req.body.neededStock.map((entry: INeededStock) => {
      let saveDataDressMaking = {
        ...staticData,
        cantidad: entry.cantidad,
        numero_lote: entry.numero_de_orden,
        timestamp,
      };
      if (entry.cantidad !== 1) {
        for (let i = 0; i < entry.cantidad; i++) {
          saveDataDressMaking = {
            ...saveDataDressMaking,
            cantidad: 1,
          };
          let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
          database.query(
            queryInsertDressMaking,
            [saveDataDressMaking],
            (err: MysqlError | null) => {
              if (err) {
                throw err;
              }
            }
          );
        }
      } else {
        let queryInsertDressMaking = "INSERT INTO INVENTARIO_TIENDAS SET ?";
        database.query(
          queryInsertDressMaking,
          [saveDataDressMaking],
          (err: MysqlError | null) => {
            if (err) {
              throw err;
            }
          }
        );
      }

      let value = entry.restante ? entry.restante : 0;
      let queryUpdateWareHouseP = `UPDATE BODEGA_PRODUCTOS SET cantidad = ${value} WHERE numero_lote = ${entry.numero_lote}`;
      database.query(queryUpdateWareHouseP, (err: MysqlError | null) => {
        if (err) {
          throw err;
        }
      });
    });
  }

  let queryCleanShopsBuffer = `DELETE FROM PETICIONES_ACTIVAS_TIENDAS WHERE numero_de_orden = ${deleteData.numero_de_orden}`;
  database.query(queryCleanShopsBuffer, (err: MysqlError | null) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify("SUCCESSFUL_SAVING"));
  });});

export default router;

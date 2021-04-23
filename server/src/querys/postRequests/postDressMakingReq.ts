import e from "express";
import routerStatement from "express";
import { MysqlError } from "mysql";
import { stringify } from "node:querystring";
const router = routerStatement.Router();
import database from "../../config/dbConfig";

router.post("/api/requesttowarehouse", (req, res) => {
  let reference = req.body.referenceSelection;
  const amount = parseInt(req.body.actualAmount);
  let date = new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" });
  let arrDate = date.split(" ");
  let s1 = arrDate[0].split("/");
  if (s1[0].length < 2) s1[0] = "0" + s1[0];
  if (s1[1].length < 2) s1[1] = "0" + s1[1];
  let dateFormat = s1.join("-");
  let s2 = arrDate[1].split(":");
  if (s2[0].length < 2) s2[0] = "0" + s2[0];
  if (s2[1].length < 2) s2[1] = "0" + s2[1];
  if (s2[2].length < 2) s2[2] = "0" + s2[2];
  let hour = s2.join(":");

  let timestamp = dateFormat + " " + hour;
  let reqData = {
    referencia: reference,
    cantidad: amount,
    timestamp,
  };

  const querySaveNewRequest =
    "INSERT INTO InventoryManagement.PETICIONES_ACTIVAS_CONFECCION SET ?";
  database.query(
    querySaveNewRequest,
    [reqData],
    async (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify("SUCCESSFUL_REQUEST"));
    }
  );
});

router.post("/api/updatedressmakingprocess", (req, res) => {
  if (req.body.diff !== 0) {
    let queryUpdateDressMakingProcess = `UPDATE InventoryManagement.PROCESO_CONFECCION SET cantidad = ${req.body.diff} WHERE id = ${req.body.id}`;
    console.log(queryUpdateDressMakingProcess);
    database.query(
      queryUpdateDressMakingProcess,
      async (err: MysqlError | null, dataApprovedRequests: any) => {
        if (err) {
          throw err;
        }
      }
    );
  } else {
    let queryDeleteDressMakingProcess = `DELETE FROM InventoryManagement.PROCESO_CONFECCION WHERE id = ${req.body.id}`;
    console.log(queryDeleteDressMakingProcess);
    database.query(
      queryDeleteDressMakingProcess,
      async (err: MysqlError | null, dataApprovedRequests: any) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  let dataProducts = { ...req.body };
  let date = new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" });
  let arrDate = date.split(" ");
  let s1 = arrDate[0].split("/");
  if (s1[0].length < 2) s1[0] = "0" + s1[0];
  if (s1[1].length < 2) s1[1] = "0" + s1[1];
  let dateFormat = s1.join("-");
  let s2 = arrDate[1].split(":");
  if (s2[0].length < 2) s2[0] = "0" + s2[0];
  if (s2[1].length < 2) s2[1] = "0" + s2[1];
  if (s2[2].length < 2) s2[2] = "0" + s2[2];
  let hour = s2.join(":");

  let timestamp = dateFormat + " " + hour;

  let dataNewProduct = {
    numero_de_orden: dataProducts.id,
    referencia: dataProducts.referencia,
    cantidad: dataProducts.amount,
    timestamp,
  };
  let referencesQuery = `SELECT referencia FROM InventoryManagement.BODEGA_PRODUCTOS WHERE referencia = ${dataProducts.referencia}`;
  let enableNewReference = true;
  database.query(
    referencesQuery,
    async (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
      if (result[0] !== undefined) {
        enableNewReference = false;
      }
      // NON EXISTING REFERENCE
      // if (enableNewReference) {
      let querySaveNewProduct =
        "INSERT INTO InventoryManagement.BODEGA_PRODUCTOS SET ?";
      database.query(
        querySaveNewProduct,
        [dataNewProduct],
        async (err: MysqlError | null, result: any) => {
          if (err) {
            throw err;
          }
          res.end(JSON.stringify("SUCCESSFUL_SAVE_PRODUCT_WAREHOUSE"));
        }
      );
      //EXISTING REFERENCE (UPDATE)
      // } else {
      // let queryUpdateProduct = `SELECT cantidad FROM InventoryManagement.BODEGA_PRODUCTOS WHERE referencia = ${dataProducts.referencia}`;
      // database.query(
      //   queryUpdateProduct,
      //   async (err: MysqlError | null, result: any) => {
      //     if (err) {
      //       throw err;
      //     }
      //     let newAmount = result[0].cantidad + dataProducts.amount;
      //     let querySaveNewProduct = `UPDATE InventoryManagement.BODEGA_PRODUCTOS SET cantidad = ${newAmount} WHERE referencia = ${dataProducts.referencia}`;
      //     database.query(
      //       querySaveNewProduct,
      //       async (err: MysqlError | null, result: any) => {
      //         if (err) {
      //           throw err;
      //         }
      //         res.end(JSON.stringify("SUCCESSFUL_UPDATE_PRODUCT_WAREHOUSE"));
      //       }
      //     );
      //   }
      // );
      // }
    }
  );
});

export default router;

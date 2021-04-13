import e from "express";
import routerStatement from "express";
import { MysqlError } from "mysql";
import { stringify } from "node:querystring";
const router = routerStatement.Router();
import database from "../../config/dbConfig";

router.post("/api/requesttowarehouse", (req, res) => {
  let reference = req.body.referenceSelection;
  const amount = parseInt(req.body.actualAmount);
  const date = new Date();
  const timestamp =
    date.getFullYear().toString() +
    "-" +
    String(date.getMonth() + 1) +
    "-" +
    date.getDate().toString() +
    " " +
    String(date.getHours()) +
    ":" +
    String(date.getMinutes() + ":" + String(date.getSeconds()));
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

router.post("/api/suppliesreques", (req, res) => {
  const reference = req.body.referenceSelection;
  const amount = parseInt(req.body.actualAmount);
  var enable = true;
  // RETURN CODES AND AMOUNT OF GOODS IN "CONSUMO_DE_INSUMOS"
  let consumptionQuery =
    "SELECT codigoycantidad FROM InventoryManagement.MUESTRAS_PRODUCCION WHERE referencia = ?";
  // ROW DATA PACKET ? TPYE
  database.query(
    consumptionQuery,
    [reference],
    async (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
      let data: string[] = result[0].codigoycantidad.split(",");

      var suppliesCodes: string[] = []; // CODES OF REQUIRES ITEMS.
      var amountProduction: number[] = []; // AMOUT FOR EACH ITEM 1-->1 RELATION.

      data.map((dato: string) => {
        if (enable) {
          suppliesCodes.push(dato);
          enable = !enable;
        } else {
          amountProduction.push(parseFloat(dato) * amount);
          enable = !enable;
        }
      });

      var i: number = 0;
      var x: number = 0;
      let checkSupplies: boolean = true;
      let insufficientCodes: string[] = [];
      let remainingAmount: string[] = [];
      // RETURN THE AMOUNT FOR EACH CODE IN "BODEGA_INSUMOS"
      suppliesCodes.map((code: string) => {
        let suppliesQuery = `SELECT metros, cantidad FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
        database.query(
          suppliesQuery,
          async (err: MysqlError | null, result: any) => {
            if (err) {
              throw err;
            }
            console.log(result);
            let diff: number;
            if (result[0].metros != null) {
              diff = parseFloat(result[0].metros) - amountProduction[i];
              if (diff < 0) {
                checkSupplies = false;
                insufficientCodes.push(code);
                remainingAmount.push((diff * -1).toString());
              }
            }
            if (result[0].cantidad != null) {
              diff = parseFloat(result[0].metros) - amountProduction[i];
              if (diff < 0) {
                checkSupplies = false;
                insufficientCodes.push(code);
                remainingAmount.push((diff * -1).toString());
              }
            }
            if (i + 1 == suppliesCodes.length && checkSupplies == true) {
              let x: number = 0;
              suppliesCodes.map((code: string) => {
                // SAVE THE DIFFERENCE BETWEEN THE REQUIRE COMPONENTS AND THE ACTUAL AMOUNT OF COMPONENTS IN "BODEGA_INSUMOS'"
                let suppliesQuery = `SELECT metros, cantidad FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
                database.query(
                  suppliesQuery,
                  async (err: MysqlError | null, result: any) => {
                    if (err) {
                      throw err;
                    }
                    const triggerF = (diff: number, type: string) => {
                      let saveDifference = `UPDATE InventoryManagement.BODEGA_INSUMOS SET ${type} = ${diff} WHERE codigo = ${code}`;
                      database.query(
                        saveDifference,
                        async (err: MysqlError | null, result: any) => {
                          if (err) {
                            throw err;
                          }
                        }
                      );
                    };
                    // SEND THE DIFF AND THE TYPE (METROS OR CANTIDAD)
                    if (result[0].metros != null) {
                      const diff: number =
                        parseFloat(result[0].metros) - amountProduction[x];
                      const type: string = "metros";
                      triggerF(diff, type);
                    }
                    if (result[0].cantidad != null) {
                      const diff: number =
                        parseFloat(result[0].cantidad) - amountProduction[x];
                      const type: string = "cantidad";
                      triggerF(diff, type);
                    }
                    if (x + 1 == suppliesCodes.length) {
                      res.end(JSON.stringify("SUCCESSFUL_REQUEST"));
                    }
                    x = x + 1;
                  }
                );
              });
              // res.end(JSON.stringify('SUCCESSFUL_REQUEST'));
            } else if (
              i + 1 == suppliesCodes.length &&
              checkSupplies == false
            ) {
              interface IInsufficientSupplies {
                codigo: string;
                color: string;
                metros?: string;
                cantidad?: string;
                descripcion: string;
                nombre_imagen: string;
                timestamp: string;
              }
              let j: number = 0;
              let insufficientSupplies: IInsufficientSupplies[] = [];
              insufficientCodes.map((code: string) => {
                let queryInsufficientSupplies = `SELECT * FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
                database.query(
                  queryInsufficientSupplies,
                  async (err: MysqlError | null, result: any) => {
                    if (err) {
                      throw err;
                    }
                    insufficientSupplies.push({
                      ...result[0],
                      remainingAmount: remainingAmount[j],
                    });
                    if (j + 1 == insufficientCodes.length) {
                      res.end(JSON.stringify(insufficientSupplies));
                    }
                    j += 1;
                  }
                );
              });
            }
            i = i + 1;
          }
        );
      });
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
  const date = new Date();
  const timestamp =
    date.getFullYear().toString() +
    "-" +
    String(date.getMonth() + 1) +
    "-" +
    date.getDate().toString() +
    " " +
    String(date.getHours()) +
    ":" +
    String(date.getMinutes() + ":" + String(date.getSeconds()));

  let dataNewProduct = {
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
      if (enableNewReference) {
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
      } else {
        let queryUpdateProduct = `SELECT cantidad FROM InventoryManagement.BODEGA_PRODUCTOS WHERE referencia = ${dataProducts.referencia}`;
        database.query(
          queryUpdateProduct,
          async (err: MysqlError | null, result: any) => {
            if (err) {
              throw err;
            }
            let newAmount = result[0].cantidad + dataProducts.amount;
            let querySaveNewProduct = `UPDATE InventoryManagement.BODEGA_PRODUCTOS SET cantidad = ${newAmount} WHERE referencia = ${dataProducts.referencia}`;
            database.query(
              querySaveNewProduct,
              async (err: MysqlError | null, result: any) => {
                if (err) {
                  throw err;
                }
                res.end(JSON.stringify("SUCCESSFUL_UPDATE_PRODUCT_WAREHOUSE"));
              }
            );
          }
        );
      }
    }
  );
});

export default router;

import e from "express";
import routerStatement from "express";
import { MysqlError } from "mysql";
import { stringify } from "node:querystring";
const router = routerStatement.Router();
import database from "../../config/dbConfig";

router.post("/api/suppliesrequest", (req, res) => {
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
        let suppliesQuery = `SELECT metros FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
        database.query(
          suppliesQuery,
          async (err: MysqlError | null, result: any) => {
            if (err) {
              throw err;
            }
            const diff: number =
              parseFloat(result[0].metros) - amountProduction[i];
            if (diff < 0) {
              checkSupplies = false;
              insufficientCodes.push(code);
              remainingAmount.push((diff*-1).toString())
            }
            if (i + 1 == suppliesCodes.length && checkSupplies == true) {
              let x: number = 0;
              suppliesCodes.map((code: string) => {
                // SAVE THE DIFFERENCE BETWEEN THE REQUIRE COMPONENTS AND THE ACTUAL AMOUNT OF COMPONENTS IN "BODEGA_INSUMOS'"
                let suppliesQuery = `SELECT metros FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
                database.query(
                  suppliesQuery,
                  async (err: MysqlError | null, result: any) => {
                    if (err) {
                      throw err;
                    }

                    const diff: number =
                      parseFloat(result[0].metros) - amountProduction[x];

                    let saveDifference = `UPDATE InventoryManagement.BODEGA_INSUMOS SET metros = ${diff} WHERE codigo = ${code}`;
                    database.query(
                      saveDifference,
                      async (err: MysqlError | null, result: any) => {
                        if (err) {
                          throw err;
                        }
                      }
                    );
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
                    insufficientSupplies.push({...result[0], remainingAmount: remainingAmount[j]});
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

export default router;

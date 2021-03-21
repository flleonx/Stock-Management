import routerStatement from "express";
import { MysqlError } from "mysql";
const router = routerStatement.Router();
import database from "../config/dbConfig";

router.post("/api/suppliesrequest", (req, res) => {
  const reference = req.body.referenceSelection;
  const amount = parseInt(req.body.actualAmount);
  var enable = true;
  // RETURN CODES AND AMOUNT OF GOODS IN "CONSUMO_DE_INSUMOS"
  let consumptionQuery =
    "SELECT codigoycantidad FROM InventoryManagement.CONSUMO_DE_INSUMO WHERE referencia = ?";
  // ROW DATA PACKET ? TPYE
  database.query(consumptionQuery, [reference], async (err: MysqlError | null, result: any) => {
    if (err) {
      throw err;
    }
    let data: string[] = result[0].codigoycantidad.split(",");

    var suppliesCodes: string[] = [];
    var amountProduction: number[] = [];

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
    // RETURN THE AMOUNT FOR EACH CODE IN "BODEGA_INSUMOS"
    suppliesCodes.map((code: string) => {
      let suppliesQuery = `SELECT metros FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
      database.query(suppliesQuery, async (err: MysqlError | null, result: any) => {
        if (err) {
          throw err;
        }
        const diff: number = parseFloat(result[0].metros) - amountProduction[i];
        console.log(diff);
        i = i + 1;

        // SAVE THE DIFFERENCE BETWEEN THE REQUIRE COMPONENTS AND THE ACTUAL AMOUNT OF COMPONENTS IN "BODEGA_INSUMOS'"
        let saveDifference = `UPDATE InventoryManagement.BODEGA_INSUMOS SET metros = ${diff} WHERE codigo = ${code}`;
        database.query(saveDifference, async (err: MysqlError | null, result: any) => {
          if (err) {
            throw err;
          }
        });
      });
    });
  });
});

export default router;

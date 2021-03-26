import bodyParser from "body-parser";
import e from "express";
import routerStatement from "express";
import { MysqlError } from "mysql";
import { stringify } from "node:querystring";
const router = routerStatement.Router();
import database from "../../config/dbConfig";

router.post("/api/savenewreference", (req, res) => {
  let enable1: boolean = false;
  let enable2: boolean = true;
  let CodesAndConsumption: string = "";
  var x = 0;
  req.body.addedInformation.map((piece: any) => {
    if (
      x + 1 < req.body.addedInformation.length &&
      piece.supplyCode != "" &&
      piece.supplyAmount != ""
    ) {
      CodesAndConsumption =
        CodesAndConsumption + piece.supplyCode + "," + piece.supplyAmount + ",";
    } else if (
      x + 1 == req.body.addedInformation.length &&
      piece.supplyCode != "" &&
      piece.supplyAmount != ""
    ) {
      CodesAndConsumption =
        CodesAndConsumption + piece.supplyCode + "," + piece.supplyAmount;
      enable1 = true;
    } else {
      res.end(JSON.stringify("FAILED_REQUEST"));
    }
    x = x + 1;
  });

  let queryVerifyReference = `SELECT referencia FROM InventoryManagement.MUESTRAS_PRODUCCION`;
  database.query(
    queryVerifyReference,
    async (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
      result.map((reference: any) => {
        if (reference.referencia == req.body.addReference) {
          console.log('DESACTIVAR ENABLE 2')
          enable2 = false;
          res.end(JSON.stringify("INVALID_REFERENCE"));
        }
      });
if (enable1 && enable2) {
    let querySaveNewReference = `INSERT INTO InventoryManagement.MUESTRAS_PRODUCCION 
  VALUES (${req.body.addReference}, ${req.body.addTalla}, ${req.body.addDescription},
    ${req.body.addColor}, ${req.body.addImageName})`;
    database.query(
      querySaveNewReference,
      async (err: MysqlError | null, result: any) => {
        if (err) {
          throw err;
        }
        triggerFunction();
      }
    );

    const triggerFunction = () => {
      let queryReferenceConsumption = `INSERT INTO InventoryManagement.CONSUMO_DE_INSUMO (referencia, codigoycantidad) VALUES(${req.body.addReference},"${CodesAndConsumption}")`;
      database.query(
        queryReferenceConsumption,
        async (err: MysqlError | null, result: any) => {
          if (err) {
            throw err;
          }
          res.end(JSON.stringify("SUCCESSFUL_REQUEST"));
        }
      );
    };
  }
    }
  );

  console.log(enable1, enable2);
  
});

export default router;

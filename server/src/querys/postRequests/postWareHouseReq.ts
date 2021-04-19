import routerStatement, { query } from "express";
import { MysqlError } from "mysql";
import { runInNewContext } from "node:vm";

//PERSONAL MODULES:
import database from "../../config/dbConfig";

const router = routerStatement.Router();

//SAVE THE INFORMATION OF BODEGA
router.post("/api/savecloth", (req: any, res: any) => {
  let newCode: boolean = true;
  // console.log(req.body.newCloth);
  let queryVerifyCodes = "SELECT codigo FROM BODEGA_INSUMOS";
  database.query(queryVerifyCodes, (err: MysqlError | null, result: any) => {
    if (err) {
      throw err;
    }
    result.map((code: any) => {
      if (code.codigo == req.body.newCloth.code) {
        newCode = false;
      }
    });
    if (newCode) {
      addNewCode();
    } else {
      res.end(JSON.stringify("EXISTING_CODE"));
    }
  });

  const addNewCode = () => {
    if (req.body.newCloth.type === "Tela") {
      const newCloth = {
        codigo: req.body.newCloth.code,
        color: req.body.newCloth.color,
        metros: req.body.newCloth.amount,
        descripcion: req.body.newCloth.description,
        nombre_imagen: req.body.newCloth.img,
      };
      console.log(newCloth);
      let newClothQuery: string = "INSERT INTO BODEGA_INSUMOS SET ?";
      let query = database.query(
        newClothQuery,
        newCloth,
        (err: MysqlError | null, result: any) => {
          if (err) throw err;
          res.end(JSON.stringify("SUCCESSFUL_ADDING"));
        }
      );
    }
    if (req.body.newCloth.type === "Insumo") {
      const newCloth = {
        codigo: req.body.newCloth.code,
        color: req.body.newCloth.color,
        cantidad: req.body.newCloth.amount,
        descripcion: req.body.newCloth.description,
        nombre_imagen: req.body.newCloth.img,
      };
      console.log(newCloth);
      let newClothQuery: string = "INSERT INTO BODEGA_INSUMOS SET ?";
      let query = database.query(
        newClothQuery,
        newCloth,
        (err: MysqlError | null, result: any) => {
          if (err) throw err;
          res.end(JSON.stringify("SUCCESSFUL_ADDING"));
        }
      );
    }
  };
});

router.post("/api/updatewarehouseinventory", (req, res) => {
  interface IAmountType {
    metros: number;
    cantidad: number;
  }

  let queryVerifyField = `SELECT metros, cantidad FROM BODEGA_INSUMOS WHERE codigo = ${req.body.code}`;
  let field: string = "";
  let addition: number = 0;
  database.query(
    queryVerifyField,
    (err: MysqlError | null, result: IAmountType[]) => {
      if (err) {
        throw err;
      }

      if (result[0].metros === null) {
        field = "cantidad";
        addition = result[0].cantidad + parseFloat(req.body.amount);
      } else {
        field = "metros";
        addition = result[0].metros + parseFloat(req.body.amount);
      }

      let queryUpdateAmount = `UPDATE BODEGA_INSUMOS SET ${field} = ${addition} WHERE codigo = ${req.body.code}`;
      database.query(
        queryUpdateAmount,
        (err: MysqlError | null, result: any) => {
          if (err) {
            throw err;
          }
          res.end(JSON.stringify("SUCCESSFUL_UPDATE"));
        }
      );
    }
  );
});

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
        let suppliesQuery = `SELECT metros, cantidad FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
        database.query(
          suppliesQuery,
          async (err: MysqlError | null, result: any) => {
            if (err) {
              throw err;
            }
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
              diff = parseFloat(result[0].cantidad) - amountProduction[i];
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

router.post("/api/savewarehousedecision", (req, res) => {
  let saveData = {
    referencia: req.body.referencia,
    cantidad: req.body.cantidad,
    timestamp: req.body.timestamp,
    idDecision: req.body.idDecision,
  };
  console.log(req.body.timestamp);
  let deleteData = req.body;
  let queryInsertDecision =
    "INSERT INTO PETICIONES_PROCESADAS_CONFECCION SET ?";
  database.query(
    queryInsertDecision,
    [saveData],
    (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
    }
  );
  if (req.body.idDecision == 1) {
    let saveDataDressMaking = {
      referencia: req.body.referencia,
      cantidad: req.body.cantidad,
      timestamp: req.body.timestamp,
    };
    let queryInsertDressMaking = "INSERT INTO PROCESO_CONFECCION SET ?";
    database.query(
      queryInsertDressMaking,
      [saveDataDressMaking],
      (err: MysqlError | null, result: any) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  let queryDeleteApproval = `DELETE FROM PETICIONES_ACTIVAS_CONFECCION WHERE id = ${deleteData.id}`;
  database.query(queryDeleteApproval, (err: MysqlError | null, result: any) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify("SUCCESSFUL_SAVING"));
  });
});

export default router;

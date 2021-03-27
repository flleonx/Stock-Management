import routerStatement, { query } from "express";
import { MysqlError } from "mysql";

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
  let queryVerifyField = `SELECT metros, cantidad FROM BODEGA_INSUMOS WHERE codigo = ${req.body.code}`;
  let field = "";
  database.query(queryVerifyField, (err: MysqlError | null, result: any) => {
    if (err) {
      throw err;
    }
    if (result[0].metros == null) {
      field = "cantidad";
    } else {
      field = "metros";
    }

    let queryActualAmount = `SELECT ${field} FROM BODEGA_INSUMOS WHERE codigo = ${req.body.code}`;
    database.query(queryActualAmount, (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
      let addition = req.body.amount;
      if (result[0].metros !== 0 && result[0].metros !== null) {
        addition = parseFloat(result[0].metros) + parseFloat(req.body.amount)
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
    });
  });
});

export default router;

import e from "express";
import routerStatement from "express";
import { MysqlError } from "mysql";
import { stringify } from "node:querystring";
const router = routerStatement.Router();
import database from "../../config/dbConfig";
import util from "util";
const db_query = util.promisify(database.query).bind(database);

router.post("/api/shoprequestproducts", (req, res) => {
  interface IWareHouseProducts {
    numero_lote: number;
    referencia: number;
    numero_de_orden: number;
    cantidad: number;
    timestamp: string;
    restante?: number;
    faltante?: number;
    acumulado: number;
  }
  let queryWareHouseProducts = `SELECT * FROM InventoryManagement.BODEGA_PRODUCTOS WHERE referencia=${req.body.reference} AND cantidad NOT IN (0)`;
  let acumulator: number = 0;
  let lotProducts: IWareHouseProducts[] = [];
  let enoughProduct = false;
  database.query(
    queryWareHouseProducts,
    async (err: MysqlError | null, wareHouseProducts: IWareHouseProducts[]) => {
      if (err) {
        throw err;
      }
      console.log(wareHouseProducts);
      if (wareHouseProducts[0] !== undefined) {
        let arrayLength = wareHouseProducts.length;
        let index = 0;
        for (let i = 0; i < arrayLength; i++) {
          acumulator += wareHouseProducts[i].cantidad;
          lotProducts.push(wareHouseProducts[i]);
          if (acumulator >= parseInt(req.body.amount)) {
            index = i;
            enoughProduct = true;
            break;
          }
        }
        let diff = acumulator - parseInt(req.body.amount);
        if (enoughProduct) {
          if (diff !== 0) {
            let size = lotProducts.length - 1;
            lotProducts[size].cantidad =
              wareHouseProducts[index].cantidad - diff;
            lotProducts[size] = { ...lotProducts[size], restante: diff };
          }
          res.end(JSON.stringify(lotProducts));
        } else {
          let size = lotProducts.length - 1;
          lotProducts[size] = {
            ...lotProducts[size],
            faltante: diff * -1,
            acumulado: acumulator,
          };
          res.end(JSON.stringify(lotProducts));
        }
      } else {
        res.end(JSON.stringify("NO EXISTE"));
      }
    }
  );
});

router.post("/api/shopwarehouseproductsrequest", (req, res) => {
  let reference = req.body.referenceSelection;
  const amount = parseInt(req.body.actualAmount);
  const idTienda = parseInt(req.body.idShop);
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
  console.log(timestamp);
  let reqData = {
    referencia: reference,
    cantidad: amount,
    timestamp,
    idTienda,
  };

  const querySaveNewRequest =
    "INSERT INTO InventoryManagement.PETICIONES_ACTIVAS_TIENDAS SET ?";
  console.log(querySaveNewRequest);
  console.log(reqData);
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

router.post("/api/updatereceivedstate", (req, res) => {
  console.log(req.body);
  let queryUpdateState = `UPDATE INVENTARIO_TIENDAS SET id_estado = 1 WHERE numero_de_orden = ${req.body.numero_de_orden}`;
  database.query(queryUpdateState, async (err: MysqlError | null, result) => {
    if (err) {
      throw err;
    }
    let queryUpdateRequests = `UPDATE PETICIONES_PROCESADAS_TIENDAS SET id_estado = 1 WHERE numero_de_orden = ${req.body.numero_de_orden}`;
    database.query(queryUpdateRequests, (err: MysqlError | null) => {
      if (err) {
        throw err;
      }
    });
    let queryShopsInfo =
      "SELECT it.*, es.nombre_estado, SUM(cantidad) as cantidadTotal FROM INVENTARIO_TIENDAS it, estados es WHERE it.id_estado = 0 AND it.id_estado = es.id_estado GROUP BY numero_de_orden";

    database.query(queryShopsInfo, async (err: MysqlError | null, result1) => {
      if (err) {
        throw err;
      }
      let queryShopsInfo =
        "SELECT it.*, es.nombre_estado, SUM(cantidad) as cantidadTotal FROM INVENTARIO_TIENDAS it, estados es WHERE it.id_estado = 1 AND it.id_estado = es.id_estado GROUP BY numero_de_orden";

      database.query(
        queryShopsInfo,
        async (err: MysqlError | null, result2) => {
          if (err) {
            throw err;
          }
          res.end(JSON.stringify([result1, result2]));
        }
      );
    });
  });
});

router.post("/api/requestsbetweenshops", (req, res) => {
  console.log(req.body);
  // let date = new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" });
  // let arrDate = date.split(" ");
  // let s1 = arrDate[0].split("/");
  // if (s1[0].length < 2) s1[0] = "0" + s1[0];
  // if (s1[1].length < 2) s1[1] = "0" + s1[1];
  // let dateFormat = s1.join("-");
  // let s2 = arrDate[1].split(":");
  // if (s2[0].length < 2) s2[0] = "0" + s2[0];
  // if (s2[1].length < 2) s2[1] = "0" + s2[1];
  // if (s2[2].length < 2) s2[2] = "0" + s2[2];
  // let hour = s2.join(":");

  // let timestamp = dateFormat + " " + hour;

  // const query_check = `UPDATE INVENTARIO_TIENDAS SET id_estado = 1 WHERE numero_de_orden = ${req.body.numero_de_orden}`;
  const query_inventory_list = ` SELECT NULL AS numero_entrada, NULL AS total FROM dual WHERE (@total := 0) UNION SELECT numero_entrada, @total := @total + cantidad AS total
  FROM InventoryManagement.INVENTARIO_TIENDAS WHERE @total < ${req.body.cantidad} AND referencia = ${req.body.referencia}`;
  const db_call = async () => {
    const result = await databaseQuery(query_inventory_list);
    console.log(result);
    res.end(JSON.stringify(result));
  };

  const databaseQuery = async (query_request: string) => {
    try {
      const response: any = await db_query(query_request);
      console.log(response);
      return response;
    } catch (err) {
      console.log("There is an error: ", err);
    }
  };
  db_call();
});

router.post("/api/decisionbetweenshops", (req, res) => {
  let numeros_de_entrada = "";
  // DEFINIR NUMEROS DE ENTRADA CON CONCATENACION Y SLICE(0, -1)
  const query_decision = `UPDATE INVENTARIO_TIENDAS SET id_estado = 0 WHERE numero_entrada IN (${numeros_de_entrada})`;
  const db_call = async () => {
    const result = await databaseQuery(query_decision);
    console.log(result);
    res.end(JSON.stringify(result));
  };

  const databaseQuery = async (query_request: string) => {
    try {
      const response: any = await db_query(query_request);
      console.log(response);
      return response;
    } catch (err) {
      console.log("There is an error: ", err);
    }
  };
  db_call();
});

router.post("/api/check_existing_value", (req, res) => {
  console.log(req.body);
  var query_check: string = "";
  var result_attribute: string = "";

  switch (req.body.check_case) {
    case 0:
      query_check = `SELECT referencia FROM MUESTRAS_PRODUCCION WHERE referencia = ${req.body.payload}`;
      result_attribute = "referencia";
      break;
    case 1:
      query_check = `SELECT idTienda FROM tienda WHERE idTienda = ${req.body.payload}`;
      result_attribute = "idTienda";
      break;
  }

  const db_call = async () => {
    const result = await databaseQuery(query_check);
    console.log(result);
    res.end(JSON.stringify(result));
  };

  const databaseQuery = async (query_request: string) => {
    try {
      const response: any = await db_query(query_request);
      console.log(response);
      if (response[0][result_attribute] == req.body.payload) {
        return true;
      }
      return false;
    } catch (err) {
      console.log("There is an error: ", err);
    }
  };
  db_call();
});

export default router;

import e from "express";
import routerStatement from "express";
import { MysqlError } from "mysql";
import { stringify } from "node:querystring";
const router = routerStatement.Router();
import database from "../../config/dbConfig";
import util from "util";
const db_query = util.promisify(database.query).bind(database);
import timestamp_generator from "../../chunks/timestamp_generator";

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
  let timestamp = timestamp_generator();
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
  // const query_check = `UPDATE INVENTARIO_TIENDAS SET id_estado = 1 WHERE numero_de_orden = ${req.body.numero_de_orden}`;
  const query_inventory_list = `SELECT NULL AS numero_entrada, NULL AS numero_lote , NULL AS referencia, NULL AS numero_de_orden, NULL AS total FROM dual WHERE (@total := 0)
  UNION SELECT numero_entrada, numero_lote, referencia, numero_de_orden, @total := @total + cantidad AS total
  FROM InventoryManagement.INVENTARIO_TIENDAS WHERE @total < ${req.body.cantidad} AND referencia = ${req.body.referencia} AND idTienda = ${req.body.tienda_origen}
  AND id_estado = 1`;
  const db_call = async () => {
    const result = await databaseQuery(query_inventory_list);
    res.end(JSON.stringify(result));
  };

  const databaseQuery = async (query_request: string) => {
    try {
      const response: any = await db_query(query_request);
      return response;
    } catch (err) {
      console.log("There is an error: ", err);
    }
  };
  db_call();
});

router.post("/api/decisionbetweenshops", (req, res) => {
  var query_update_inventory = "";
  var query_update_decision = "";
  var arr_numeros_de_entrada: string[] = [];
  var numeros_de_entrada = "";
  var timestamp = timestamp_generator();
  interface INumeros_Entrada {
    numero_entrada: number;
    total: number;
  }

  // QUERY FUNCTIONS
  const databaseQuery = async (query_request: string) => {
    try {
      const response: any = await db_query(query_request);
      return response;
    } catch (err) {
      console.log("There is an error: ", err);
    }
  };

  const db_call = async (query: string) => {
    await databaseQuery(query);
    return;
  };

  // CHECK DECISION
  switch (req.body.data.id_decision) {
    case 0:
      query_update_decision = `UPDATE InventoryManagement.PETICIONES_ENTRE_TIENDAS SET id_decision = 0 WHERE numero_peticion = ${req.body.data.numero_peticion}`;
      db_call(query_update_decision);
      res.end(JSON.stringify("SUCCESSFUL_UPDATE"));
      break;

    case 1:
      req.body.numeros_de_entrada.map((val: INumeros_Entrada) => {
        arr_numeros_de_entrada.push(val.numero_entrada.toString());
      });
      numeros_de_entrada = arr_numeros_de_entrada.join();

      query_update_inventory = `UPDATE InventoryManagement.INVENTARIO_TIENDAS SET id_estado = 0, timestamp_envios = "${timestamp}", idTienda = ${req.body.data.tienda_destino}
                          WHERE numero_entrada IN (${numeros_de_entrada})`;
      query_update_decision = `UPDATE InventoryManagement.PETICIONES_ENTRE_TIENDAS SET id_decision = 1 WHERE numero_peticion = ${req.body.data.numero_peticion}`;
      db_call(query_update_inventory);
      db_call(query_update_decision);
      res.end(JSON.stringify("SUCCESSFUL_UPDATE"));
      break;

    case 2:
      req.body.numeros_de_entrada.map((val: INumeros_Entrada) => {
        arr_numeros_de_entrada.push(val.numero_entrada.toString());
      });
      numeros_de_entrada = arr_numeros_de_entrada.join();

      query_update_inventory = `UPDATE InventoryManagement.INVENTARIO_TIENDAS SET id_estado = 0, timestamp_envios = "${timestamp}", idTienda = ${req.body.data.tienda_destino}
                          WHERE numero_entrada IN (${numeros_de_entrada})`;
      query_update_decision = `UPDATE InventoryManagement.PETICIONES_ENTRE_TIENDAS SET id_decision = 1, cantidad = ${req.body.data.envio_real} WHERE numero_peticion = ${req.body.data.numero_peticion}`;
      db_call(query_update_inventory);
      db_call(query_update_decision);
      res.end(JSON.stringify("SUCCESSFUL_UPDATE"));
      break;
  }
});

router.post("/api/check_existing_value", (req, res) => {
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
    res.end(JSON.stringify(result));
  };

  const databaseQuery = async (query_request: string) => {
    try {
      const response: any = await db_query(query_request);
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

router.post("/api/save_newshop_request", (req, res) => {
  const timestamp = timestamp_generator();
  const insertion = { ...req.body, timestamp, id_decision: 2 };
  console.log(insertion);
  let query_save_request = `INSERT INTO PETICIONES_ENTRE_TIENDAS SET ?`;
  console.log(query_save_request);
  database.query(query_save_request, [insertion], (err: MysqlError | null) => {
    if (err) throw err;
    res.end(JSON.stringify("SUCCESSFUL_REQUEST"));
  });
});

router.post("/api/modalrequiredstock", (req, res) => {
  var array_auxiliar: any = [];
  var numeros_de_entrada = "";

  req.body.map((value: any) => {
    array_auxiliar.push(value.numero_entrada.toString());
  });

  numeros_de_entrada = array_auxiliar.join();
  let query_required_stock = `SELECT it.*, SUM(cantidad) as cantidadTotal FROM INVENTARIO_TIENDAS it WHERE numero_entrada IN (${numeros_de_entrada}) GROUP BY numero_lote`;
  database.query(query_required_stock, (err: MysqlError | null, result) => {
    if (err) throw err;
    console.log(result);
    res.end(JSON.stringify(result));
  });
});

/* QUERY APP */
router.post('/api/barcode', (req, res) => {
  console.log(req.body.Barcode);

  let query = `UPDATE INVENTARIO_TIENDAS SET cantidad=0 WHERE numero_entrada = ${req.body.Barcode}`;

  database.query(query, (err: MysqlError | null) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify("SUCCESSFUL"));
  });
});

export default router;

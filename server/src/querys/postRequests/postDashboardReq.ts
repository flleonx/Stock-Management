import routerStatement from "express";
import { MysqlError } from "mysql";
const router = routerStatement.Router();
import database from "../../config/dbConfig";
import util from "util";
import timestamp_generator from "../../chunks/timestamp_generator";
const db_query = util.promisify(database.query).bind(database);
// MONTHS JSON
//import months from "../../chunks/months.json"

router.post("/api/dashboard_date_filter", (req, res) => {
  var query_date_filter: string = "";

  query_date_filter = `SELECT DATE(timestamp), SUM(cantidad+1) as cantidadTotal FROM InventoryManagement.INVENTARIO_TIENDAS it WHERE timestamp
      BETWEEN ${req.body.fecha_incial} AND ${req.body.fecha_final}  AND cantidad=0 AND idTienda=${req.body.idTienda} GROUP BY DATE(timestamp)`;

  const db_call = async () => {
    const result = await databaseQuery(query_date_filter);
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

router.post("/api/dashboard_pie", (req, res) => {
  interface IReturn {
    nombre_tienda: string;
    cantidadTotal: number;
    porcentaje: number;
  }
  var actual_year: string = timestamp_generator().split(" ")[0].split("-")[0];
  var fecha_incial: string = actual_year + "-" + req.body.mes + "-01";
  var fecha_final: string = actual_year + "-" + req.body.mes + "-31";
  var total_sum: number = 0;
  var porcentajes: IReturn[] = [];

  const query_pie = `SELECT t.nombre_tienda, SUM(cantidad+1) as cantidadTotal FROM InventoryManagement.INVENTARIO_TIENDAS it InventoryManagement.tienda t WHERE timestamp
      BETWEEN ${fecha_incial} AND ${fecha_final}  AND cantidad=0 GROUP BY idTienda`;

  const db_call = async () => {
    const result = await databaseQuery(query_pie);
    result.map((val: any) => {
      return (total_sum += val.cantidadTotal);
    });
    result.map((val: any) => {
      porcentajes.push({ ...val, porcentaje: val.cantidadTotal / total_sum });
    });
    console.log(porcentajes)
    res.end(JSON.stringify(porcentajes));
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

export default router;

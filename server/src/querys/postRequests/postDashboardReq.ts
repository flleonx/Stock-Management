import routerStatement from "express";
import { MysqlError } from "mysql";
const router = routerStatement.Router();
import database from "../../config/dbConfig";
import util from "util";
import timestamp_generator from "../../chunks/timestamp_generator";
import { timeStamp } from "node:console";
const db_query = util.promisify(database.query).bind(database);
// MONTHS JSON
//import months from "../../chunks/months.json"

router.post("/api/dashboard_date_filter", (req, res) => {
  var query_date_filter: string = "";
  var fecha_inicial = `"${req.body.fecha_inicial} 00:00:00"`;
  var fecha_final = `"${req.body.fecha_final} 23:59:59"`;
  query_date_filter = `SELECT timestamp, SUM(cantidad+1) as cantidadTotal FROM InventoryManagement.INVENTARIO_TIENDAS it WHERE DATE(timestamp)
      BETWEEN ${fecha_inicial} AND ${fecha_final}  AND cantidad=0 AND idTienda=${req.body.idTienda} GROUP BY DATE(timestamp)`;

  var datesFilter = [["Fechas", "Ventas"]];

  const db_call = async () => {
    const result = await databaseQuery(query_date_filter);
    console.log(result);
    result.map((date: any) => {
      const arrayActual = [date.timestamp.split(" ")[0], date.cantidadTotal];
      datesFilter.push(arrayActual);
    });
    console.log(datesFilter);
    res.end(JSON.stringify(datesFilter));
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

  var actual_year: string = timestamp_generator().split(" ")[0].split("-")[0];
  var fecha_incial: string = `"${actual_year}-${req.body.mes}-01 00:00:00"`;
  var fecha_final: string = `"${actual_year}-${req.body.mes}-31 23:59:59"`;
  var total_sum: number = 0;
  var porcentajes = [["Shop", "Sales"]];

  const query_pie = `SELECT t.nombre_tienda, SUM(it.cantidad+1) as cantidadTotal FROM INVENTARIO_TIENDAS it, tienda t WHERE timestamp
      BETWEEN ${fecha_incial} AND ${fecha_final}  AND cantidad=0 AND t.idTienda = it.idTienda GROUP BY it.idTienda`;

  const db_call = async () => {
    const result = await databaseQuery(query_pie);
    // console.log(result)
    result.map((val: any) => {
      return (total_sum += val.cantidadTotal);
    });
    result.map((val: any) => {
      const percentage = (val.cantidadTotal / total_sum)*100;
      const arrayActual = [val.nombre_tienda, percentage];
      porcentajes.push(arrayActual);
    });
    console.log(porcentajes);
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

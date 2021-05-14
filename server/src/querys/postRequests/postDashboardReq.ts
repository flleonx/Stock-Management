import routerStatement from "express";
import { MysqlError } from "mysql";
const router = routerStatement.Router();
import database from "../../config/dbConfig";
import util from "util";
const db_query = util.promisify(database.query).bind(database);

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

export default router;

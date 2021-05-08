import routerStatement from "express";
import { MysqlError } from "mysql";
const router = routerStatement.Router();
import database from "../../config/dbConfig";


router.get("/api/shopsinformation", (req, res) => {
  let queryShopsInfo = "SELECT * FROM InventoryManagement.tienda";

  database.query(queryShopsInfo, async (err: MysqlError | null, result) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify(result));
  });
});

router.get("/api/deliverystate", (req, res) => {
  let queryShopsInfo =
    "SELECT it.*, es.nombre_estado, SUM(cantidad) as cantidadTotal FROM INVENTARIO_TIENDAS it, estados es WHERE it.id_estado = 0 AND it.id_estado = es.id_estado GROUP BY numero_de_orden";

  database.query(queryShopsInfo, async (err: MysqlError | null, result) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify(result));
  });
});

router.get("/api/getactualinventory", (req, res) => {
  let queryShopsInfo =
    "SELECT it.*, es.nombre_estado, SUM(cantidad) as cantidadTotal FROM INVENTARIO_TIENDAS it, estados es WHERE it.id_estado = 1 AND it.id_estado = es.id_estado GROUP BY numero_de_orden";

  database.query(queryShopsInfo, async (err: MysqlError | null, result) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify(result));
  });
});

router.get("/api/getactualrequestbetweenshops", (req, res) => {
  let queryShopsInfo =
    `SELECT pet.*, ti1.nombre_tienda as tienda_origen_nombre, ti2.nombre_tienda as tienda_destino_nombre FROM PETICIONES_ENTRE_TIENDAS pet
     left join tienda ti1 on pet.tienda_origen = ti1.idTienda left join tienda ti2 on pet.tienda_destino = ti2.idTienda`

  database.query(queryShopsInfo, async (err: MysqlError | null, result) => {
    if (err) {
      throw err;
    }
    console.log(result)
    res.end(JSON.stringify(result));
  });
});

export default router;

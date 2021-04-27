import routerStatement from "express";
import { MysqlError } from "mysql";
const router = routerStatement.Router();
import database from "../../config/dbConfig";

router.get("/api/getwarehouseproducts", (req, res) => {
  let queryWareHouseProducts =
    "SELECT * FROM InventoryManagement.BODEGA_PRODUCTOS WHERE cantidad NOT IN (0)";

  database.query(
    queryWareHouseProducts,
    async (err: MysqlError | null, wareHouseProducts: any) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(wareHouseProducts));
    }
  );
});

router.get("/api/getactualshoprequests", (req, res) => {
  interface IShopRequests{
    numero_de_orden: number;
    referencia: number;
    cantidad: number;
    idTienda: number;
    timestamp: string;
    nombre_tienda: string;
    direccion: string;
  }
  let queryShopsRequests =
    "SELECT pa.*, t.nombre_tienda, t.direccion FROM PETICIONES_ACTIVAS_TIENDAS pa, tienda t WHERE pa.idTienda = t.idTienda";
  database.query(
    queryShopsRequests,
    async (err: MysqlError | null, result: IShopRequests) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(result))
    }
  );
});

export default router;

import routerStatement from "express";
import { MysqlError } from "mysql";
const router = routerStatement.Router();
import database from "../config/dbConfig";

interface IReference {
  referencia: number;
  id_talla: number;
  descripcion: string;
  color: string;
  nombre_imagen: string;
}

router.get("/api/references", (req, res) => {
  let referencesQuery = "SELECT * FROM InventoryManagement.MUESTRAS_PRODUCCION";

  let dbQuery = database.query(
    referencesQuery,
    async (err: MysqlError | null, references: IReference) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(references));
    }
  );
});

export default router;

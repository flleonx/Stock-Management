import routerStatement from 'express';
import {MysqlError} from 'mysql';
const router = routerStatement.Router();
import database from '../../config/dbConfig';

interface IWareHouseSupplies {
  codigo: number;
  color: string;
  metros: number;
  cantidad: number;
  descripcion: string;
  nombre_imagen: string;
  timestamp: string;
}

router.get('/api/warehousecodes', (req, res) => {
  let referencesQuery = 'SELECT * FROM InventoryManagement.BODEGA_INSUMOS';

  let dbQuery = database.query(
    referencesQuery,
    async (err: MysqlError | null, references: IWareHouseSupplies) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(references));
    }
  );
});

router.get('/api/production', (req, res) => {
  let sampleQuery =
    'SELECT * FROM MUESTRAS_PRODUCCION m, TALLA t WHERE m.id_talla=t.id_talla';

  let dbQuery = database.query(
    sampleQuery,
    async (err: MysqlError | null, references: IWareHouseSupplies) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(references));
    }
  );
});

export default router;

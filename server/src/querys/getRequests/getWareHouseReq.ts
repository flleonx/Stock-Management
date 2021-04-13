import routerStatement from 'express';
import {MysqlError} from 'mysql';

//PERSONAL MODULES:
import database from '../../config/dbConfig';

const router = routerStatement.Router();

interface IInvetoryBodega {
  codigo: string;
  color: number;
  metros: number | null;
  canditad: number | null;
  descripcion: string;
  nombre_imagen: string;
  timestamp: any;
}

router.get('/api/invetorywarehouse', (req: any, res: any) => {
  //COMENT
  let inventoryBodegaQuery = 'SELECT * FROM InventoryManagement.BODEGA_INSUMOS';

  let dbQuery = database.query(
    inventoryBodegaQuery,
    async (err: MysqlError | null, inventoryBodega: IInvetoryBodega) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(inventoryBodega));
    }
  );
});

router.get('/api/dressmakingrequest', (req: any, res: any) => {
  //COMENT
  let inventoryBodegaQuery = 'SELECT * FROM InventoryManagement.PETICIONES_ACTIVAS_CONFECCION';

  let dbQuery = database.query(
    inventoryBodegaQuery,
    async (err: MysqlError | null, inventoryBodega: IInvetoryBodega) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(inventoryBodega)); 
    }
  );
});

export default router;

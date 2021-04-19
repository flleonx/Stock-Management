import routerStatement from 'express';
import {MysqlError} from 'mysql';
const router = routerStatement.Router();
import database from '../../config/dbConfig';

router.get('/api/shopsinformation', (req, res) => {
  let queryShopsInfo = 'SELECT * FROM InventoryManagement.tienda';

   database.query(
    queryShopsInfo,
    async (err: MysqlError | null, result) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(result));
    }
  );
});

export default router;
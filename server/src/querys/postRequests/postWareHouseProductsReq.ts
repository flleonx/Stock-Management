import routerStatement, {query} from 'express';
import {MysqlError} from 'mysql';
import {runInNewContext} from 'node:vm';

//PERSONAL MODULES:
import database from '../../config/dbConfig';

const router = routerStatement.Router();

router.post('/api/savewarehouseproductsdecision', (req, res) => {
  interface INeededStock {
    numero_lote: number;
    referencia: number;
    numero_de_orden: number;
    cantidad: number;
    timestamp: string;
    restante?: number;
  }

  let date = new Date().toLocaleString('es-ES', {timeZone: 'America/Bogota'});
  let arrDate = date.split(' ');
  let s1 = arrDate[0].split('/');
  if (s1[0].length < 2) s1[0] = '0' + s1[0];
  if (s1[1].length < 2) s1[1] = '0' + s1[1];
  let dateFormat = s1.join('-');
  let s2 = arrDate[1].split(':');
  if (s2[0].length < 2) s2[0] = '0' + s2[0];
  if (s2[1].length < 2) s2[1] = '0' + s2[1];
  if (s2[2].length < 2) s2[2] = '0' + s2[2];
  let hour = s2.join(':');

  let timestamp = dateFormat + ' ' + hour;
  let saveData = {
    numero_de_orden: req.body.numero_de_orden,
    referencia: req.body.referencia,
    cantidad: req.body.cantidad,
    timestamp: timestamp,
    idDecision: req.body.idDecision,
    idTienda: req.body.idTienda,
  };
  console.log(`EEEEEEEEEEE: ${req.body.timestamp}`);
  let deleteData = req.body;
  console.log(deleteData);
  let queryInsertDecision = 'INSERT INTO PETICIONES_PROCESADAS_TIENDAS SET ?';
  database.query(queryInsertDecision, [saveData], (err: MysqlError | null) => {
    if (err) {
      throw err;
    }
  });

  if (req.body.idDecision === 1) {
    let staticData = {
      referencia: req.body.referencia,
      numero_de_orden: req.body.numero_de_orden,
      idTienda: req.body.idTienda,
    };
    req.body.neededStock.map((entry: INeededStock) => {
      let saveDataDressMaking = {
        ...staticData,
        cantidad: entry.cantidad,
        numero_lote: entry.numero_de_orden,
        timestamp,
      };
      let queryInsertDressMaking = 'INSERT INTO INVENTARIO_TIENDAS SET ?';
      database.query(
        queryInsertDressMaking,
        [saveDataDressMaking],
        (err: MysqlError | null) => {
          if (err) {
            throw err;
          }
        }
      );
      let value = entry.restante ? entry.restante : 0;
      let queryUpdateWareHouseP = `UPDATE BODEGA_PRODUCTOS SET cantidad = ${value} WHERE numero_lote = ${entry.numero_lote}`;
      database.query(queryUpdateWareHouseP, (err: MysqlError | null) => {
        if (err) {
          throw err;
        }
      });
    });
  }

  let queryCleanShopsBuffer = `DELETE FROM PETICIONES_ACTIVAS_TIENDAS WHERE numero_de_orden = ${deleteData.numero_de_orden}`;
  database.query(queryCleanShopsBuffer, (err: MysqlError | null) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify('SUCCESSFUL_SAVING'));
  });
});

export default router;

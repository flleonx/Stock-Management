import bodyParser from 'body-parser';
import e from 'express';
import routerStatement from 'express';
import {MysqlError} from 'mysql';
import {stringify} from 'node:querystring';
const router = routerStatement.Router();
import database from '../../config/dbConfig';

router.post('/api/savenewreference', (req, res) => {
  console.log(req.body);
  let enable1: boolean = false;
  let enable2: boolean = true;
  let CodesAndConsumption: string = '';
  var x = 0;
  req.body.addedInformation.map((piece: any) => {
    if (
      x + 1 < req.body.addedInformation.length &&
      piece.supplyCode != '' &&
      piece.supplyAmount != ''
    ) {
      CodesAndConsumption =
        CodesAndConsumption + piece.supplyCode + ',' + piece.supplyAmount + ',';
    } else if (
      x + 1 == req.body.addedInformation.length &&
      piece.supplyCode != '' &&
      piece.supplyAmount != ''
    ) {
      CodesAndConsumption =
        CodesAndConsumption + piece.supplyCode + ',' + piece.supplyAmount;
      enable1 = true;
    } else {
      res.end(JSON.stringify('FAILED_REQUEST'));
    }
    x = x + 1;
  });

  let queryVerifyReference = `SELECT referencia FROM InventoryManagement.MUESTRAS_PRODUCCION`;
  database.query(
    queryVerifyReference,
    async (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
      result.map((reference: any) => {
        if (reference.referencia == req.body.addReference) {
          console.log('DESACTIVAR ENABLE 2');
          enable2 = false;
          res.end(JSON.stringify('INVALID_REFERENCE'));
        }
      });
      if (enable1 && enable2) {
        const referenceObject = {
          referencia: req.body.addReference,
          id_talla: req.body.addSize,
          descripcion: req.body.addDescription,
          color: req.body.addColor,
          nombre_imagen: req.body.addImageName,
        };
        let querySaveNewReference = `INSERT INTO InventoryManagement.MUESTRAS_PRODUCCION SET ?`;
        console.log(querySaveNewReference);
        database.query(
          querySaveNewReference,
          referenceObject,
          async (err: MysqlError | null, result: any) => {
            if (err) {
              throw err;
            }
            triggerFunction();
          }
        );

        const triggerFunction = () => {
          let queryReferenceConsumption = `INSERT INTO InventoryManagement.CONSUMO_DE_INSUMO (referencia, codigoycantidad) VALUES(${req.body.addReference},"${CodesAndConsumption}")`;
          database.query(
            queryReferenceConsumption,
            async (err: MysqlError | null, result: any) => {
              if (err) {
                throw err;
              }
              res.end(JSON.stringify('SUCCESSFUL_REQUEST'));
            }
          );
        };
      }
    }
  );

  console.log(enable1, enable2);
});

export default router;

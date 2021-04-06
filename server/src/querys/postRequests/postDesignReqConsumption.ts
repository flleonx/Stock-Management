import bodyParser from 'body-parser';
import e from 'express';
import routerStatement from 'express';
import {MysqlError} from 'mysql';
import {stringify} from 'node:querystring';
const router = routerStatement.Router();
import database from '../../config/dbConfig';

router.post('/api/getreferenceconsumption', (req, res) => {
  const reference = req.body.referenceSelection;
  console.log(reference);
  var enable = true;
  // RETURN CODES AND AMOUNT OF GOODS IN "CONSUMO_DE_INSUMOS"
  let consumptionQuery =
    'SELECT codigoycantidad FROM InventoryManagement.MUESTRAS_PRODUCCION WHERE referencia = ?';
  // ROW DATA PACKET ? TPYE
  database.query(
    consumptionQuery,
    [reference],
    async (err: MysqlError | null, result: any) => {
      if (err) {
        throw err;
      }
      let data: string[] = result[0].codigoycantidad.split(',');

      var suppliesCodes: string[] = []; // CODES OF REQUIRES ITEMS.
      var amountConsumption: number[] = []; // AMOUT FOR EACH ITEM 1-->1 RELATION.

      data.map((dato: string) => {
        if (enable) {
          suppliesCodes.push(dato);
          enable = !enable;
        } else {
          amountConsumption.push(parseFloat(dato));
          enable = !enable;
        }
      });

      interface ISuppliesConsumption {
        codigo: string;
        color: string;
        metros?: string;
        cantidad?: string;
        descripcion: string;
        nombre_imagen: string;
        timestamp: string;
        consumptionAmount: string;
      }

      let j: number = 0;
      let consumptionSupplies: ISuppliesConsumption[] = [];
      suppliesCodes.map((code: string) => {
        let querySuppliesConsumption = `SELECT * FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
        database.query(
          querySuppliesConsumption,
          async (err: MysqlError | null, result: any) => {
            if (err) {
              throw err;
            }
            consumptionSupplies.push({
              ...result[0],
              consumptionAmount: amountConsumption[j],
            });
            if (j + 1 == suppliesCodes.length) {
              res.end(JSON.stringify(consumptionSupplies));
            }
            j += 1;
          }
        );
      });
    }
  );
});

export default router;

import routerStatement from 'express';
import {MysqlError} from 'mysql';
const router = routerStatement.Router();
import database from '../../config/dbConfig';

interface IReference {
  referencia: number;
  id_talla: number;
  descripcion: string;
  color: string;
  nombre_imagen: string;
}

interface IApprovedRequests {
  id: number;
  referencia: number;
  cantidad: number;
  timestamp: string;
}

interface IRequestHistory {
  numero_de_orden: number;
  referencia: number;
  cantidad: number;
  decision: string;
  timestamp: string;
}

router.get('/api/references', (req, res) => {
  let referencesQuery = 'SELECT * FROM InventoryManagement.MUESTRAS_PRODUCCION';

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

router.get('/api/getapprovedrequests', (req, res) => {
  let referencesQuery = 'SELECT * FROM InventoryManagement.PROCESO_CONFECCION';

  let dbQuery = database.query(
    referencesQuery,
    async (err: MysqlError | null, dataApprovedRequests: IApprovedRequests) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(dataApprovedRequests));
    }
  );
});

router.get('/api/getRequestHistoryDressmaking', (req, res) => {
  let requestHistoryQuery =
    'SELECT p.numero_de_orden, p.referencia, p.cantidad, d.decision, p.timestamp FROM PETICIONES_PROCESADAS_CONFECCION p, decision d WHERE p.idDecision=d.idDecision ORDER BY numero_de_orden';

  let dbQuery = database.query(
    requestHistoryQuery,
    async (err: MysqlError | null, dataRequestHistory: IRequestHistory) => {
      if (err) {
        throw err;
      }
      res.end(JSON.stringify(dataRequestHistory));
    }
  );
});

export default router;

import routerStatement from 'express';
import {MysqlError} from 'mysql';

//PERSONAL MODULES:
import database from '../../config/dbConfig';

const router = routerStatement.Router();

//SAVE THE INFORMATION OF BODEGA
router.post('/api/savecloth', (req: any, res: any) => {
  console.log(req.body.newCloth);
  if (req.body.newCloth.type === 'Tela') {
    const newCloth = {
      codigo: req.body.newCloth.code,
      color: req.body.newCloth.color,
      metros: req.body.newCloth.amount,
      descripcion: req.body.newCloth.description,
      nombre_imagen: req.body.newCloth.img,
    };
    console.log(newCloth);
    let newClothQuery: string = 'INSERT INTO BODEGA_INSUMOS SET ?';
    let query = database.query(
      newClothQuery,
      newCloth,
      (err: MysqlError | null, result: any) => {
        if (err) throw err;
      }
    );
  }
  if (req.body.newCloth.type === 'Insumo') {
    const newCloth = {
      codigo: req.body.newCloth.code,
      color: req.body.newCloth.color,
      cantidad: req.body.newCloth.amount,
      descripcion: req.body.newCloth.description,
      nombre_imagen: req.body.newCloth.img,
    };
    console.log(newCloth);
    let newClothQuery: string = 'INSERT INTO BODEGA_INSUMOS SET ?';
    let query = database.query(
      newClothQuery,
      newCloth,
      (err: MysqlError | null, result: any) => {
        if (err) throw err;
      }
    );
  }
});

export default router;

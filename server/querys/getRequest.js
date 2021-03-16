const router = require('express').Router()
const {database} = require('../config/dbConfig.js')


router.get('/api/references', (req, res) => {

     let referencesQuery = 'SELECT * FROM InventoryManagement.MUESTRAS_PRODUCCION';

     let dbQuery = database.query(referencesQuery, (err, references) => {
       if(err){ throw err;}
      res.end(JSON.stringify(references));
   });
 });


module.exports = router;

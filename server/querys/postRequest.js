const router = require('express').Router()
const {database} = require('../config/dbConfig.js')


router.post('/api/suppliesrequest', (req, res) => {
  const reference = req.body.referenceSelection;
  const amount = parseInt(req.body.actualAmount);
  var enable = true
  let consumptionQuery = 'SELECT codigoycantidad FROM InventoryManagement.CONSUMO_DE_INSUMO WHERE referencia = ?';
  database.query(consumptionQuery, [reference], async(err,result) => {
    if(err) {throw err;}
    let data = result[0].codigoycantidad.split(',');

    var suppliesCodes = []
    var amountProduction = []


    data.map((dato) => {
      if(enable) {
        suppliesCodes.push(dato)
        enable = !enable
      }
      else{
        amountProduction.push(parseFloat(dato) * amount)
        enable = !enable
      }
    });

     var i = 0;
     suppliesCodes.map((code) => {
         let suppliesQuery = `SELECT metros FROM InventoryManagement.BODEGA_INSUMOS WHERE codigo = ${code}`;
            database.query(suppliesQuery, async(err,result) => {
             if(err) {throw err;}

              const diff = parseFloat(result[0].metros) - amountProduction[i]
              console.log(diff)
              i = i + 1;
              let saveDifference = `UPDATE InventoryManagement.BODEGA_INSUMOS SET metros = ${diff} WHERE codigo = ${code}`;
               database.query(saveDifference, async(err,result) => {
               if(err) {throw err;}
           });
         });
      });
  });

});

module.exports = router;

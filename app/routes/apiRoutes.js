module.exports = function (app, db) {
    // CRUD
    app.get('/api/all', function (req, res) {
        db.Person.findAll({}).then(function (result) {
            res.json(result);
        });
    });

    app.post('/api/new', function (req, res) {
        db.Person.create({
            family: req.body.family,
            universe: req.body.universe,
            power: req.body.power
        }).then(function (result) {
            res.json(result);
        });
    });

    app.put('/api/update/:id', function (req, res) {
        db.Person.update({
            name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        }).then(function (result) {
            res.json(result);
        });
    });

    app.delete('/api/delete/:id', function (req, res) {
        db.Person.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (result) {
            res.json(result);
        });
    })

    app.get('/api/families/:id', function (req, res){
      db.Person.findAll({
          where: {
            universe: req.params.id
          }
      }).then(function(result){
        let onlyUnique = (value, index, self) => self.indexOf(value) === index;
        res.json({
          message: `All families in universe: ${req.params.id}`, 
          data: result.map((person => person.family)).filter(onlyUnique)
        });
      });
    })


    app.get('/api/compare-powers/:id', function(req, res){
      db.Person.findAll({
        where: {
          family: req.params.id
        },
        group: ['universe'],
        attributes: [
          'universe', 
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalPersonInFamily'], 
          [db.sequelize.fn('SUM', db.sequelize.col('power')), 'totalPower']
        ],
        order: ['universe'],
        raw: true,
      }).then(function (result) {
        result.toJSON;
        const allEqual = arr => arr.every( v => v === arr[0]);
        const famaliesBalanced = allEqual(result.map(universe => universe.totalPower));

        res.json({
          success: true,
          famaliesBalanced: result.length !== 0 ? famaliesBalanced : false,
          data: result,
        });
      });
    })

    app.get('/api/unbalanced-families/', function(req, res){

      db.sequelize.query(
        `SELECT DISTINCT family FROM "People" AS "Person"`, 
        { raw: true }
      ).then(function (result) {
        result.toJSON;
        let distinctFamilies = result[0];
        Promise.all(distinctFamilies.map((family) => {
          return db.Person.findAll({
            where: {
              family: family["family"]
            },
            group: ['universe'],
            attributes: [
              'universe', 
              [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalPersonInFamily'], 
              [db.sequelize.fn('SUM', db.sequelize.col('power')), 'totalPower']
            ],
            order: ['universe'],
            raw: true,
          }).then(function (result) {
            result.toJSON;
            const allEqual = arr => arr.every( v => v === arr[0]);
            const familiesBalanced = allEqual(result.map(universe => universe.totalPower));
    
            data =  {
              success: true,
              familiesBalanced: result.length !== 0 ? familiesBalanced : false,
              // data: result,
              family: family["family"]
            }
            return data;
          });
        })).then((values) => {
          console.log(values);
          let unbalancedFamilies = [];
          values.forEach(v => v.familiesBalanced ? null: unbalancedFamilies.push(v.family))
          res.json({
            unbalancedFamilies: unbalancedFamilies,
            success: true,
          });
        });
      });
     
    })

    app.get('/api/add-data/', function(req, res){
      try{
        let csv= require('fast-csv');
        let fs= require('fs');
        var stream = fs.createReadStream("initial-data.csv");
        let counter = 0;
        csv.fromStream(stream, {headers : true})
          .on("data", function(data){
              db.Person.create({
                universe: data.universe,
                family: data.family,
                power: data.power
            }).then(function (result) {
                counter++;
                if(counter == 499){
                  res.json({"success": true})
                }
            });
          })
          .on("end", function(){
            console.log("CSV read ended");
          })
          .on("error", function(){
              res.json({"success": false})
          });
      }catch(e){
        console.log(e);
        res.json({"success": false});
      }
    });
}
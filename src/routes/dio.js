const Dio = require('./../models/dio.js');
const getJoiError = require('../utils/errorUtil');

module.exports = (app) => {
  app.route('/api/dios')
    .get((req, res) => {
      Dio.find({})
        .then(dios => res.send(dios))
        .catch(err => res.status(500).send({ err }));
    })

    .post((req, res) => {
      Dio.validate(req.body, (err, dio) => {
        if (err) {
          res.status(400).send(getJoiError(err));
        } else {
          new Dio(dio).save()
            .then(newDio => res.status(201).send(newDio))
            .catch(err => res.status(500).send({ err }));
        }
      });
    });

  app.route('/api/dios/:id_dio([0-9]{1,2})')
    .get((req, res) => {
      Dio.findOne({ id_dio: req.params.id_dio })
        .then(dio => {
          if (!dio) {
            res.sendStatus(404);
          } else {
            res.send(dio);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })

    .put((req, res) => {
      Dio.validate(req.body, (err, dio) => {
        if (err) {
          res.status(400).send(getJoiError(err));
        } else {
          Dio.findOneAndUpdate({ id_dio: req.params.id_dio }, dio, { new: true })
            .then(dio => {
              if (!dio) {
                res.sendStatus(404);
              } else {
                res.send(dio);
              }
            })
            .catch(err => res.status(500).send({ err }));
        }
      });
    })

    .delete((req, res) => {
      Dio.findOneAndRemove({ id_dio: req.params.id_dio })
        .then(dio => {
          if (!dio) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });


  app.get('/api/dios/:id_dio([0-9]{1,2})/:status(on|off)', (req, res) => {
    Dio.updateState(req.params.id_dio, req.params.status === 'on');
    res.end();
  });
};
const routes = require('express').Router();
const Room = require('../modules/models/room');

routes
  .route('/api/rooms')
  .get((req, res) => {
    Room.findAll()
      .then(rooms => res.json(rooms))
      .catch(err => res.status(500).send({ err }));
  })
  .post((req, res) => {
    const isValid = Room.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const userId = res.locals.user.userId;
      Room.save({ ...req.body, userId })
        .then(room => res.status(201).json(room))
        .catch(err => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/rooms/:room_id([0-9]+)')
  .get((req, res) => {
    Room.findById(req.params.room_id)
      .then(room => {
        if (!room) {
          res.sendStatus(404);
        } else {
          res.json(room);
        }
      })
      .catch(err => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    const isValid = Room.validate(req.body);
    if (!isValid) {
      return res.sendStatus(400);
    }
    Room.findByIdAndUpdate(req.params.room_id, req.body)
      .then(rowsAffected => {
        if (rowsAffected < 1) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch(err => res.status(500).send({ err }));
  })
  .delete((req, res) => {
    Room.delete(req.params.room_id)
      .then(dio => {
        if (!dio) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch(err => res.status(500).send({ err }));
  });

module.exports = routes;

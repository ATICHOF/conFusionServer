const bodyParser = require("body-parser");
const express = require("express");
const authenticate = require("../authenticate");
const mongoose = require("mongoose");
const cors = require("./cors");
const Promos = require("../models/promos");

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promos.find({})
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.create(req.body)
        .then(
          (promo) => {
            console.log("Promotion Created ", promo);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation is not supported on /promos");
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.remove({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );
//promoID
promoRouter
  .route("/:promoId")
  .get(cors.cors, (req, res, next) => {
    Promos.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("POST operation is not supported on /" + req.params.promoId);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.findByIdAndUpdate(
        req.params.promoId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.findByIdAndRemove(req.params.promoId)
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );
module.exports = promoRouter;

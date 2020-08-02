import { validate } from 'jsonschema';
import schemaStore from '../validations/House/schemaStore.json';
import { badRequest, successRequest } from '../helpers/http-helpers';
import { MissingError, RequestDatabaseError} from '../errors';

import House from '../models/House';

// import { Request, Response } from 'express';

class HouseControllers {
  index (req, res) {
    const { status } = req.query;
    if (status) {
      House.find({ status })
        .then((houses) => {
          return res.status(200).json(successRequest(houses));
        })
        .catch((err) => {
          return res.status(500).json(
            badRequest(
              new RequestDatabaseError('index', 'House'), 
              500
            )
          );
        })
    } else {
      return res.status(400).json(
        badRequest(
          new MissingError('status', 'query')
        )
      );
    }
  }

  store (req, res) {
    const validateBody = validate(req.body, schemaStore);

    if(validateBody.valid == false) {
      return res.status(400).json(
        badRequest(
          new MissingError("[description, price, location, status]", 'body')
        )
      );
    } else {
      const { filename } = req.file;
      const { description, price, location, status } = req.body;
      const { user_id } = req.headers;
      if (user_id) {
        House.create({
          thumbnail: filename,
          description,
          price,
          location,
          status,
          user:user_id
        })
          .then((house) => {
            return res.status(201).json(successRequest(house, 201));
          })
          .catch((err) => {
            return res.status(400).json(
              badRequest(new RequestDatabaseError('create', 'House'))
            );
          })
      } else {
        return res.status(400).json(
          badRequest(new MissingError('user_id','headers'))
        )
      }
    }
  }
}

export default new HouseControllers();
import { validate } from 'jsonschema';
import schemaStore from '../validations/House/schemaStore.json';
import { badRequest, successRequest } from '../helpers/http-helpers';
import { MissingError, RequestDatabaseError, UnauthorizedError} from '../errors';

import House from '../models/House';
import User from '../models/User';

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

  async update (req, res) {
    const { house_id } = req.params;
    const { user_id } = req.headers;
    if (house_id && user_id) {
      try {
        const user = await User.findById(user_id);
        const house = await House.findById(house_id);

        if (String(user._id) === String(house.user)) {
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

            await House.updateOne({ _id: house_id }, {
              thumbnail: filename,
              description,
              price,
              location,
              status,
              user:user_id
            });

            return res.status(200).json(successRequest('House updated'))
          }
        } else {
          return res.status(401).json(
            badRequest(new UnauthorizedError(user._id), 401)
          )
        }
      } catch (error) {
        return res.status(400).json(
          badRequest(new RequestDatabaseError('findById', '[User, House]'))
        )
      }
    } else {
      return res.status(400).json(
        badRequest(new MissingError('[house_id, user_id]', '[params, headers]'))
      )
    }
  }

  async destroy (rep, res) {
    const { house_id } = rep.body;
    const { user_id } = rep.headers;
    try {
      const house = await House.findById(house_id);
      const user = await User.findById(user_id);

      if (String(house.user) === String(user._id)) {
        await House.findByIdAndDelete({ _id: house_id });

        return res.status(200).json(successRequest('House destroy'))
      } else {
        return res.status(401).json(
          badRequest(new UnauthorizedError(user._id), 401)
        )
      }
    } catch (error) {
      return res.status(400).json(
        badRequest(new RequestDatabaseError('findById', '[User, House]'))
      )
    }
  }
}

export default new HouseControllers();
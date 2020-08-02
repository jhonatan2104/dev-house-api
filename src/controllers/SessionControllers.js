import { validate } from 'jsonschema';
import schemaStore from '../validations/Session/schemaStore.json';
import { badRequest, successRequest } from '../helpers/http-helpers'

import User from '../models/User';

class SessionControllers {
  store (req, res) {
    const validateBody = validate(req.body, schemaStore);

    if (validateBody.valid == false) {
      return res.status(400).json(badRequest("Schema Invalid"));
    } else {
      const { email } = req.body;

      User.findOne({ email })
        .then((user) => {
          if (!user) {
            User.create({ email })
              .then((newUser) => {
                return res.status(201).json(successRequest(newUser, 201));
              })
              .catch((err) => {
                return res.status(400).json(badRequest("Error in create User"));
              });
          } else {
            return res.status(200).json(successRequest(user));
          }
        })
        .catch((err) => {
          return res.status(400).json(badRequest("Error in findOne User"));
        });
    }
  }
}

export default new SessionControllers();

import { validate } from 'jsonschema';
import schemaStore from '../validations/House/schemaStore.json';
import { badRequest, successRequest } from '../helpers/http-helpers';

import House from '../models/House';

class HouseControllers {
  store (req, res) {
    const validateBody = validate(req.body, schemaStore);

    if(validateBody.valid == false) {
      return res.status(400).json(badRequest("Schema Invalid"));
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
            return res.status(400).json(badRequest('error create house'));
          })
      } else {
        return res.status(400).json(badRequest('user_id headers not found'))
      }
    }
  }
}

export default new HouseControllers();
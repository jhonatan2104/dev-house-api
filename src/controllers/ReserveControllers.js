import { badRequest, successRequest } from '../helpers/http-helpers';
import { 
  MissingError,
  ParseDateError,
  UnexpectedSituation,
  RequestDatabaseError,
} from '../errors';
import { formatDateISOString } from '../helpers/format-helpers';

import Reserve from '../models/Reserve';
import House from '../models/House';
import User from '../models/User';

// import { Request, Response } from 'express';

class ReserveControllers {
    async store (req, res) {
      const { user_id } = req.headers;
      const { house_id } = req.params;

      if (user_id && house_id) {
        try {
          const house = await House.findById(house_id);
          const user = await User.findById(user_id);

          if (house && user) {
            if (house.status) {
              if (String(house.user) !== String(user._id)){
                const { date: date_ } = req.body;

                if (date_) {
                  const date = formatDateISOString(date_);

                  const reserve = await Reserve.create({
                    date,
                    user: user_id,
                    house: house_id,
                  });

                  await reserve
                    .populate('house')
                    .populate('user')
                    .execPopulate();

                  return res.status(201).json(
                    successRequest(reserve, 201)
                  )

                } else {
                  throw new MissingError('date', 'body');
                }
              } else {
                throw new UnexpectedSituation("user cannot book their own homes");
              }
            } else {
              throw new UnexpectedSituation("house is not available for booking");
            }
          } else {
            throw new RequestDatabaseError("findById", "[House, User]");
          }
        } catch (error) {
          if (error instanceof RequestDatabaseError) {
            return res.status(400).json(
              badRequest(error)
            )
          } if (error instanceof UnexpectedSituation) {
            return res.status(400).json(
              badRequest(error)
            )
          } if (error instanceof MissingError) {
            return res.status(400).json(
              badRequest(error)
            )
          } if (error instanceof ParseDateError) {
            return res.status(400).json(
                badRequest(error)
            )
          }

          return res.status(400).json(
            badRequest(new UnexpectedSituation(error.message))
        )
        }
      } else {
          return res.status(400).json(
              badRequest(new MissingError('[user_id, house_id]', '[headers, params]'))
          )
      }
    }
}

export default new ReserveControllers();
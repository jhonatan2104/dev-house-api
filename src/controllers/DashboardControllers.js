import { badRequest, successRequest } from '../helpers/http-helpers';
import { MissingError, RequestDatabaseError, UnauthorizedError} from '../errors';

import House from '../models/House';

// import { Request, Response } from 'express';


class DashboardControllers {
    show (req, res) {
        const { user_id } = req.headers;

        if (user_id) {
          House.find({ user: user_id })
            .then((houses) => {
                return res.status(200).json(
                  successRequest(houses)
                );
            })
            .catch((err) => {
                return res.status(400).json(
                  badRequest(new RequestDatabaseError('find', 'House'))
                );
            })
        } else {
            return res.status(400).json(
              badRequest(new MissingError('user_id', 'headers'))
            );
        }
    }
}

export default new DashboardControllers();

import moment from 'moment';
import { ParseDateError } from '../errors';

export const formatDateISOString = (date) => {
  try {
    const isoString = moment(date).toDate().toISOString();
    return isoString;
  } catch (error) {
    throw new ParseDateError(date);
  }
}

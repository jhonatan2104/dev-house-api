export class MissingError extends Error {
  constructor(name, location) {
    super(`Error: not found ${name} in ${location}`);
    this.name = 'MissingParamsError'
  }
}

export class RequestDatabaseError extends Error {
  constructor(action, database) {
    super(`Error: request to the database - ${action} in ${database}`);
    this.name = 'RequestDatabaseError'
  }
}

export class UnauthorizedError extends Error {
  constructor(user_id) {
    super(`Error: User unauthorized - User._id: ${user_id}`)
  }
}
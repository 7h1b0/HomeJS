import knex from '../../knexClient';
import * as User from '../../modules/models/user';
import authenticationMiddleware from '../authenticationMiddleware';
const initUsers = [
  {
    userId: 1,
    username: 'one',
    password: 'test',
    token: 'token_one',
  },
];

describe('authenticationMiddleware', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(User.TABLE).insert(initUsers);
  });

  afterEach(async () => {
    await knex(User.TABLE).truncate();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('should call next when user exist', async () => {
    const req = {
      headers: {
        'x-access-token': 'token_one',
      },
    };
    const res = { sendStatus: jest.fn(), locals: {} };
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should save the current user into res.locals', async () => {
    const req = {
      headers: {
        'x-access-token': 'token_one',
      },
    };
    const res = { sendStatus: jest.fn(), locals: {} };
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);
    expect(res.locals.user).toEqual({
      userId: 1,
      username: 'one',
    });
  });

  it('should send 401 if token is invalid', async () => {
    const req = {
      headers: {
        'x-access-token': 'test',
      },
    };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should send 401 if token is missing', async () => {
    const req = { headers: {} };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(0);
  });
});

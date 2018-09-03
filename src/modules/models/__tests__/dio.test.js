import knex from '../../../knexClient';
import * as Dio from '../dio';
const initDios = [
  {
    dioId: 1,
    roomId: 1,
    name: 'test',
  },
  {
    dioId: 2,
    roomId: 2,
    name: 'test',
  },
];

describe('Dio', () => {
  beforeAll(async () => {
    await knex(Dio.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(Dio.TABLE).insert(initDios);
  });

  afterEach(async () => {
    await knex(Dio.TABLE).truncate();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('findAll', () => {
    it('should return all dios', async () => {
      const result = await Dio.findAll();
      expect(result).toEqual(initDios);
    });
  });

  describe('findById', () => {
    it('should return only one dio', async () => {
      const result = await Dio.findById(1);
      expect(result).toEqual(initDios[0]);
    });

    it('should return undefined', async () => {
      const result = await Dio.findById(-1);
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new dio', async () => {
      const save = {
        dioId: 3,
        roomId: 1,
        name: 'test-save',
      };

      const newDio = await Dio.save(save);
      expect(newDio).toEqual(save);
      const dios = await knex(Dio.TABLE)
        .first('*')
        .where('dioId', save.dioId);
      expect(dios).toEqual(save);
    });

    it('should reject when an id is already taken', async () => {
      const save = {
        dioId: 2,
        roomId: 1,
        name: 'test-save',
      };

      await expect(Dio.save(save)).rejects.toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete a dio', async () => {
      await Dio.remove(1);
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toEqual([initDios[1]]);
    });

    it('should not delete a dio', async () => {
      await Dio.remove(-1);
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toEqual(initDios);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a dio', async () => {
      const rowsAffected = await Dio.findByIdAndUpdate(1, { name: 'updated' });
      expect(rowsAffected).toBe(1);
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toMatchSnapshot();
    });

    it('should not update a dio', async () => {
      const rowsAffected = await Dio.findByIdAndUpdate(-1, { name: 'updated' });
      expect(rowsAffected).toBe(0);
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toEqual(initDios);
    });
  });

  describe('validate', () => {
    it('should return true when a dio is valid', () => {
      const dio = {
        dioId: 3,
        roomId: 1,
        name: 'test-save',
      };

      expect(Dio.validate(dio)).toBeTruthy();
    });

    it('should return false when a dio is missing a props', () => {
      const dio = {
        dioId: 3,
        name: 'test-save',
      };

      expect(Dio.validate(dio)).toBeFalsy();
    });

    it('should return false when a dio has unknow props', () => {
      const dio = {
        dioId: 3,
        roomId: 1,
        name: 'test-save',
        test: 2,
      };

      expect(Dio.validate(dio)).toBeFalsy();
    });
  });
});

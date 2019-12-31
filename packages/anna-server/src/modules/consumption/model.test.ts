import knex from '../../knexClient';
import * as Consumption from './model';
import type { Consumption as ConsumptionType } from './model';

const seventeenth = {
  date: new Date('2020-08-17T18:00'),
  value: 7.0,
};
const twentieth = {
  date: new Date('2020-08-20T16:00'),
  value: 5.01,
};
const twentyFirst = {
  date: new Date('2020-08-21T16:00'),
  value: 5.01,
};
const twentySecond = {
  date: new Date('2020-08-22T16:00'),
  value: null,
};

const initConsumptions = [seventeenth, twentieth, twentyFirst, twentySecond];

function formatTimestamp(consumptions): ConsumptionType[] | ConsumptionType {
  if (Array.isArray(consumptions)) {
    return consumptions.map((consumption) => ({
      date: consumption.date.getTime(),
      value: consumption.value,
    }));
  }
  return {
    date: consumptions.date.getTime(),
    value: consumptions.value,
  };
}

describe('Consumption', () => {
  beforeEach(async () => {
    await knex(Consumption.TABLE).truncate();
    await knex(Consumption.TABLE).insert(initConsumptions);
  });

  describe('findLastEntries', () => {
    it('should return the last 7 entries not null', async () => {
      const result = await Consumption.findLastEntries(7);

      expect(result).toEqual(
        formatTimestamp([twentyFirst, twentieth, seventeenth]),
      );
    });
  });

  describe('findLastEntry', () => {
    it('should return the last entry with a value whatever the current date', async () => {
      const result = await Consumption.findLastEntry();
      expect(result).toEqual(formatTimestamp(twentyFirst));
    });

    it('should return the last entry whatever the current date', async () => {
      await knex(Consumption.TABLE).truncate();
      const result = await Consumption.findLastEntry();
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save an array of consumption entries', async () => {
      const length = await knex(Consumption.TABLE).count('value', {
        as: 'length',
      });
      expect(length).toEqual([{ length: 3 }]);
      const consumptions = [
        {
          date: new Date('2020-08-22T16:00'),
          value: 6.09,
        },
        {
          date: new Date('2020-08-23T16:00'),
          value: 10.2,
        },
      ];

      await Consumption.save(consumptions);

      const newLength = await knex(Consumption.TABLE).count('value', {
        as: 'length',
      });
      expect(newLength).toEqual([{ length: 5 }]);
    });
  });
});
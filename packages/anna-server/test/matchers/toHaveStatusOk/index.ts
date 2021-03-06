import { printReceived } from 'jest-matcher-utils';
import predicate from './predicate';

const passMessage = (received: unknown) => () =>
  `Expected ${printReceived(received)} not to be 200, 201 or 204`;

const failMessage = (received: unknown) => () =>
  `Expected ${printReceived(received)} to be 200, 201 or 204`;

export default function toHaveStatusOk(receiver: unknown) {
  const pass = predicate(receiver);
  return {
    message: pass ? passMessage(receiver) : failMessage(receiver),
    pass,
  };
}

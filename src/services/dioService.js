const execService = require('./execService');
const logger = require('../modules/logger');

let queue = Promise.resolve();
const run = async (script, onSuccess, onError) => {
  queue = queue.then(() => execService(script)).then(
    () => onSuccess(),
    err => {
      logger.error(err);
      onError();
    },
  );
};

module.exports = {
  add(device, on = false) {
    return new Promise((resolve, reject) => {
      const status = on ? 1 : 0;
      run(`./radioEmission ${device} ${status}`, resolve, reject);
    });
  },
};

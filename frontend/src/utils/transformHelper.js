const { isEmpty, get } = require('lodash');

// NOTE: only support simple object
const transformHelper = (data, config = []) =>
  config.reduce((acc, item) => {
    const { transformFrom, transformTo, constant } = item;
    const val = get(data, transformFrom);

    if (!isEmpty(val)) {
      acc[transformTo] = val;
    }

    if (!isEmpty(constant)) {
      acc[transformTo] = constant;
    }

    return acc;
  }, {});

export default transformHelper;

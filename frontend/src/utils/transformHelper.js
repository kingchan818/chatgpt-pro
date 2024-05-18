const { isEmpty, get, isNil } = require('lodash');

// NOTE: only support simple object
const transformHelper = (data, config = []) =>
  config.reduce((acc, item) => {
    const { transformFrom, transformTo, constant } = item;
    const val = get(data, transformFrom);

    if (!isEmpty(val) || !isNil(val)) {
      acc[transformTo] = val;
    }

    if (!isEmpty(constant) || !isNil(constant)) {
      acc[transformTo] = constant;
    }

    return acc;
  }, {});

export default transformHelper;

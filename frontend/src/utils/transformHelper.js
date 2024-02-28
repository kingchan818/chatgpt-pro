const { isEmpty, get } = require('lodash');

// NOTE: only support simple object
const transformHelper = (data, config = []) => {
  console.info('Transform data');
  return config.reduce((acc, item) => {
    const { transformFrom, transformTo, constant } = item;
    const val = get(data, transformFrom);
    console.log(val);

    if (!isEmpty(val)) {
      acc[transformTo] = val;
    }

    if (!isEmpty(constant)) {
      acc[transformTo] = constant;
    }

    return acc;
  }, {});
};

export default transformHelper;

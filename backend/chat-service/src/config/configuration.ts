import { readFileSync, existsSync } from 'fs';
import * as yaml from 'js-yaml';
import { merge } from 'lodash';
import { join } from 'path';
import { cleanConfig } from 'src/utils/common';

const ENV = process.env.NODE_ENV === 'test' ? 'dev' : process.env.NODE_ENV || 'dev';

const YAML_CONFIG_FILENAME = `${ENV}.config.yaml`;
const YAML_LOCAL_CONFIG = 'local.config.yaml';

export default () => {
  const localConfigPath = join(__dirname, YAML_LOCAL_CONFIG);
  const baseConfigPath = join(__dirname, YAML_CONFIG_FILENAME);
  const config = yaml.load(readFileSync(baseConfigPath, 'utf8'));

  // TODO: use env to override config
  const envConfig = cleanConfig({
    mongodb: {
      uris: process.env.DB_URI,
      database: process.env.DB_NAME,
      replicaSet: process.env.DB_REPLICA_SET,
    },
    encryption: {
      key: process.env.ENCRYPTION_KEY,
    },
  });

  let localConfig = {};

  if (existsSync(localConfigPath)) {
    localConfig = yaml.load(readFileSync(localConfigPath, 'utf8'));
  }

  return merge(config, localConfig, envConfig);
};

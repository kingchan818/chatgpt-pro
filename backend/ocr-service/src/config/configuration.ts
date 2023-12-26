import { readFileSync, existsSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const ENV = process.env.NODE_ENV || 'dev';

const YAML_CONFIG_FILENAME = `${ENV}.config.yaml`;
const YAML_LOCAL_CONFIG = 'local.config.yaml';

export default () => {
  const localConfigPath = join(__dirname, YAML_LOCAL_CONFIG);
  const baseConfigPath = join(__dirname, YAML_CONFIG_FILENAME);
  let config = yaml.load(readFileSync(baseConfigPath, 'utf8'));

  if (existsSync(localConfigPath)) {
    const localConfig = yaml.load(readFileSync(localConfigPath, 'utf8'));
    config = { ...config, ...localConfig };
  }
  return config;
};

import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const ENV = process.env.NODE_ENV || 'dev';

const YAML_CONFIG_FILENAME = `${ENV}.config.yaml`;

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};

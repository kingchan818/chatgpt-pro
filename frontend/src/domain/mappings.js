const TRANSFORM_SAVED_MESSAGE_CONFIG = [
  {
    transformFrom: 'messageId',
    transformTo: 'id',
  },
  {
    transformFrom: 'message',
    transformTo: 'text',
  },
  {
    transformFrom: 'role',
    transformTo: 'role',
  },
  {
    transformFrom: 'collectionId',
    transformTo: 'collectionId',
  },
];

const TRANSFORM_USER_INPUT_CONFIG = [
  {
    transformFrom: 'messageId',
    transformTo: 'id',
  },
  {
    transformFrom: 'message',
    transformTo: 'text',
  },
  {
    constant: 'User',
    transformTo: 'role',
  },
  {
    transformFrom: 'collectionId',
    transformTo: 'collectionId',
  },
];

const TRANSFORM_MODEL_CONFIGURATOR_TO_CHAT_OPTIONS = [
  {
    transformFrom: 'currentModel.id',
    transformTo: 'model',
  },
  {
    transformFrom: 'modelTemperature',
    transformTo: 'temperature',
  },
  {
    transformFrom: 'currentSystemPrompt',
    transformTo: 'systemMessage',
  },
];

export default {
  TRANSFORM_SAVED_MESSAGE_CONFIG,
  TRANSFORM_MODEL_CONFIGURATOR_TO_CHAT_OPTIONS,
  TRANSFORM_USER_INPUT_CONFIG,
};

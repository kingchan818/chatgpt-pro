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
    constant: 'User',
    transformTo: 'role',
  },
  {
    transformFrom: 'parentMessageId',
    transformTo: 'parentMessageId',
  },
];

const TRANSFORM_MODEL_CONFIGURATOR_TO_CHAT_OPTIONS = [
  {
    transformFrom: 'currentModel.id',
    transformTo: 'model',
  },
];

export default {
  TRANSFORM_SAVED_MESSAGE_CONFIG,
  TRANSFORM_MODEL_CONFIGURATOR_TO_CHAT_OPTIONS,
};

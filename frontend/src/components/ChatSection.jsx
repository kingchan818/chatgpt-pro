import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Message from './Message';
import { ReactComponent as ChatGPTSvg } from '../assets/chatgpt-24.svg';

ChatSection.propTypes = {
  width: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired,
  streamMessage: PropTypes.shape({
    id: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    role: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    details: PropTypes.object,
  }).isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      parentId: PropTypes.string,
    }),
  ).isRequired,
};

ChatSection.defaultProps = {
  width: '100%',
};

export default function ChatSection({ width, messages = [], isProcessing, streamMessage }) {
  return (
    <div className="overflow-hidden flex">
      <div
        className={`flex h-full w-full flex-col ${isEmpty(messages) ? 'items-center justify-center' : 'items-center overflow-scroll'} `}
      >
        {messages && isEmpty(messages) && (
          <>
            <div className="bg-white rounded-full p-3 mb-2">
              <ChatGPTSvg width={51} height={51} />
            </div>
            <div className="font-medium text-white text-2xl">How can I help you today?</div>
          </>
        )}

        {messages &&
          !isEmpty(messages) &&
          messages.map(({ id, role, text }, idx) => (
            <Message key={id} role={role} text={text} messages={messages} messageIdx={idx} />
          ))}

        {isProcessing && (
          <Message
            role={streamMessage?.role || 'assistant'}
            text={streamMessage?.text || 'Processing...'}
            messages={messages}
            messageIdx={messages.length}
          />
        )}
      </div>
    </div>
  );
}

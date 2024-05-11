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
    <div className={`flex items-center justify-center mx-6 ${(!isEmpty(messages) || isProcessing && isEmpty(messages) ) && 'flex-grow' } mt-3`}>
      <div
        className={`flex flex-col h-full ${isEmpty(messages) || !isProcessing && isEmpty(messages) ? 'items-center justify-center' : ''} `}
      >
        {messages && isEmpty(messages) && (
          <>
            <div className="dark:bg-white rounded-full p-3 mb-2 border-2 border-black">
              <ChatGPTSvg width={51} height={51} />
            </div>
            <div className="font-medium text-2xl dark:text-white">How can I help you today?</div>
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

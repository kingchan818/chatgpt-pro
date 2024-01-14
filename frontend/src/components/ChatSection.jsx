import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
import { ReactComponent as ChatGPTSvg } from '../assets/chatgpt-24.svg';

ChatSection.propTypes = {
  width: PropTypes.string,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired, // default: 'ChatGPT' || 'You'
      content: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

ChatSection.defaultProps = {
  width: '100%',
};

export default function ChatSection({ width, messages = [] }) {
  return (
    <div
      className={`flex h-full w-full flex-col ${isEmpty(messages) ? 'items-center justify-center' : 'items-start justify-start'}`}
    >
      {messages && isEmpty(messages) && (
        <>
          <div className="bg-white rounded-full p-3 mb-2">
            <ChatGPTSvg width={51} height={51} />
          </div>
          <div className="font-medium text-white text-2xl">How can I help you today?</div>
        </>
      )}

      {messages && !isEmpty(messages) && messages.map(({ id, role, content }) => <div key={id}>{content}</div>)}

      {/* greeting section */}
    </div>
  );
}

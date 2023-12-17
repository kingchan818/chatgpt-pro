import PropTypes from 'prop-types';
import React from 'react';
import { ReactComponent as ChatGPTSvg } from '../assets/chatgpt-24.svg';

ChatSection.propTypes = {};

export default function ChatSection(props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="bg-white rounded-full p-3 mb-2">
        <ChatGPTSvg width={51} height={51} />
      </div>
      <div className="font-medium text-white text-2xl">How can I help you today?</div>
    </div>
  );
}

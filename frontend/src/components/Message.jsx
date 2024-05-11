import React from 'react';
import { AiOutlineRobot } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { IoReloadOutline } from 'react-icons/io5';
import PropTypes from 'prop-types';

import Markdown from './Markdown';
import CopyCode from './CopyCode';

Message.propTypes = {
  role: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired, // default: 'ChatGPT' || 'You'
      text: PropTypes.string.isRequired,
      parentId: PropTypes.string, // default: optional string
    }),
  ).isRequired,
  messageIdx: PropTypes.number.isRequired,
};

function Message({ role, text, messages, messageIdx }) {
  return (
    <div className="sm:w-[45rem] md:w-[50rem] xl:w-[80rem] px-4 py-2 dark:text-white mb-3">
      <div>{role === 'assistant' ? <AiOutlineRobot /> : role}</div>
      <div className="mt-1">
        <Markdown content={text} />
      </div>
      {role === 'User' && (
        <div className="mt-2 opacity-0 hover:opacity-60 cursor-pointer">
          <FiEdit2 />
        </div>
      )}
      {role === 'assistant' && messages.length - 1 !== messageIdx && <CopyCode text={text} />}
      {messageIdx === messages.length - 1 && (
        <div className="mt-2 opacity-60 cursor-pointer flex">
          <CopyCode text={text} />
          <IoReloadOutline className="ml-3" />
        </div>
      )}
    </div>
  );
}

export default Message;

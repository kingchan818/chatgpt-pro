import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { AiOutlineRobot } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { IoReloadOutline } from 'react-icons/io5';
import { LuClipboardCopy } from 'react-icons/lu';
import SyntaxHighlighter from './SyntaxHighlighter';

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
  const checkMsgContainsCode = (msg) => {
    const codeRegex = /```[\s\S]*```/g;
    return codeRegex.test(msg);
  };

  return (
    <div className="overflow-hidden flex">
      <div
        className={`flex h-full w-full flex-col ${isEmpty(messages) ? 'items-center justify-center' : 'items-center '} overflow-scroll`}
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
          messages.map(({ id, role, content }, idx) => (
            <div key={id} className="sm:w-[45rem] md:w-[50rem] xl:w-[80rem] px-4 py-2 text-white mb-3">
              <div>{role === 'bot' ? <AiOutlineRobot /> : role}</div>
              <div className="mt-1">
                {checkMsgContainsCode(content) ? (
                  <p className="text-white/70 font-extralight leading-loose">{content}</p>
                ) : (
                  <SyntaxHighlighter content={content} />
                )}
              </div>
              {role === 'User' && (
                <div className="mt-2 opacity-0 hover:opacity-60 cursor-pointer">
                  <FiEdit2 />
                </div>
              )}
              {role === 'bot' && messages.length - 1 !== idx && (
                <div className="mt-2 opacity-0 hover:opacity-60 cursor-pointer">
                  <LuClipboardCopy />
                </div>
              )}
              {idx === messages.length - 1 && (
                <div className="mt-2 opacity-60 cursor-pointer flex">
                  <LuClipboardCopy />
                  <IoReloadOutline className="ml-3" />
                </div>
              )}
            </div>
          ))}

        {/* greeting section */}
      </div>
    </div>
  );
}

import React, { useState, forwardRef } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ReactComponent as ChatGPTSvg } from '../assets/chatgpt-24.svg';

const SideBar = forwardRef((props, ref) => {
  const { chats = [] } = props;

  const [isCreatedChatClicked, setIsCreateChatClicked] = useState(false);

  const createNewChat = () => {
    setIsCreateChatClicked(!isCreatedChatClicked);
    setTimeout(() => {
      setIsCreateChatClicked(false);
    }, 150);
  };

  return (
    <StyledDiv className="bg-black text-white flex flex-col h-screen text-sm w-[250px]" ref={ref}>
      <button
        type="button"
        className={`flex items-center cursor-pointer font-medium m-4 cust-hover justify-between rounded-md p-2 ${isCreatedChatClicked ? 'clicked' : ''}`}
        onClick={createNewChat}
      >
        <div className="flex items-center">
          <div className="bg-white rounded-full mr-2 p-1">
            <ChatGPTSvg />
          </div>
          <div className="mr-2">Create New Chat</div>
        </div>

        <FaRegEdit />
      </button>

      <div className="flex flex-col justify-center mx-4">
        {chats?.map((val) => (
          <button type="button" className="text-left p-2 rounded-md cust-hover cursor-pointer" key={val?.sessionId}>{val?.name}</button>
        ))}
      </div>

    </StyledDiv>
  );
});

SideBar.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      sessionId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SideBar;

const StyledDiv = styled.div`
  .cust-hover:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .clicked {
    transition: background-color 0.1s ease-in-out, transform 0.1s ease-in-out;
    background-color: rgba(255, 255, 255, 0.5);
    transform: scale(0.98);
  }
`;

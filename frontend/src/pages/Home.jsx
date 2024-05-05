import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { isEmpty, get } from 'lodash';
import SideBar from '../components/SideBar';
import Nav from '../components/Nav';
import ChatSection from '../components/ChatSection';
import ChatInput from '../components/ChatInput';

export default function Home() {
  // TODO: Better to centralize the state in a context provider
  // TODO: Use state manager Redux
  // TODO: Setup i18n for internationalization
  const [rightSideBarToggled, setRightSideBarToggle] = useState(false);
  const [leftSideBarToggled, setLeftSideBarToggle] = useState(false);
  const sideBarRef = useRef(null);
  const chats = [
    { sessionId: 1, name: 'Business Strategies Discussion' },
    { sessionId: 2, name: 'Marketing Innovations' },
    { sessionId: 3, name: 'Tech Trends 2022' },
    { sessionId: 4, name: 'Startups Ideas Exchange' },
    { sessionId: 5, name: 'AI and Machine Learning' },
    { sessionId: 6, name: 'Web Development Best Practices, Web Development Best Practices' },
    { sessionId: 7, name: 'Data Science Insights' },
    { sessionId: 8, name: 'Product Design Workshop' },
    { sessionId: 9, name: 'Entrepreneurship Stories' },
    { sessionId: 10, name: 'Investment Opportunities' },
  ];

  const { messages, error, isProcessing, streamMessage } = useSelector((state) => state.chat);
  useEffect(() => {
    if (!isEmpty(error)) {
      const errorMessage = get(error, 'message', 'Oh its a empty message...');
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div>
      <Toaster />
      <SideBar chats={chats} ref={sideBarRef} isOpen={rightSideBarToggled} />
      <MainContent isOpen={rightSideBarToggled}>
        {/* Your main content goes here */}

        {/* <ToggleLeftSideBarBtn onClick={() => setRightSideBarToggle(!rightSideBarToggled)}>
          {rightSideBarToggled ? <MdOutlineKeyboardArrowLeft size={30} /> : <MdKeyboardArrowRight size={30} />}
        </ToggleLeftSideBarBtn> */}

        <StyledHome>
          <Nav leftSideBarToggled={leftSideBarToggled} setLeftSideBarToggle={setLeftSideBarToggle} />
          <ChatSection messages={messages} isProcessing={isProcessing} streamMessage={streamMessage} />
          <ChatInput />
        </StyledHome>
      </MainContent>
    </div>
  );
}

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  overflow: auto;
  position: relative;
`;

const MainContent = styled.div`
  position: relative;
  transition: margin-left 0.5s;
  background: #343541;
  color: #000;
  margin-left: ${(props) => (props.isOpen ? '250px' : '0')};
`;

const ToggleLeftSideBarBtn = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  color: rgba(0, 0, 0, 0.5);
  padding: 8px;
  cursor: pointer;
  :hover {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.3s ease-in-out; // Add this line
  }
`;

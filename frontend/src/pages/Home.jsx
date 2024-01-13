import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import SideBar from '../components/SideBar';
import Nav from '../components/Nav';
import ChatSection from '../components/ChatSection';
import ChatInput from '../components/ChatInput';

export default function Home() {
  // TODO: Better to centralize the state in a context provider
  // TODO: Use state manager Redux
  // TODO: Setup i18n for internationalization
  const [sideBarToggled, setSideBarToggle] = useState(false);
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

  const msgs = [
    {
      role: 'bot',
      id: 1,
      content: 'Hello, how can I help you today?',
    },
    {
      role: 'user',
      id: 2,
      content: 'I want to know more about the product',
    },
    {
      role: 'bot',
      id: 3,
      content: 'Sure, what do you want to know?',
    },
    {
      role: 'user',
      id: 4,
      content: 'What is the price of ETH today?',
    },
    {
      role: 'bot',
      id: 5,
      content: 'The price of ETH is $2,000',
    },
  ];

  return (
    <div>
      <SideBar chats={chats} ref={sideBarRef} isOpen={sideBarToggled} />
      <MainContent isOpen={sideBarToggled}>
        {/* Your main content goes here */}
        <StyledHome>
          {/* TODO: refactor it */}
          <Nav
            sideBarToggled={sideBarToggled}
            setSideBarToggle={setSideBarToggle}
            leftSideBarToggled={leftSideBarToggled}
            setLeftSideBarToggle={setLeftSideBarToggle}
          />
          <ChatSection messages={msgs} />
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

`;

const MainContent = styled.div`
  transition: margin-left .5s;
  background: #343541;
  color: #000;
  margin-left: ${(props) => (props.isOpen ? '250px' : '0')};
`;

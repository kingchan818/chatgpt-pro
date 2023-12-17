import React, { useEffect, useRef, useState } from 'react';
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
  const sideBarRef = useRef(null);
  const chats = [
    { sessionId: 1, name: 'Business Strategies Discussion' },
    { sessionId: 2, name: 'Marketing Innovations' },
    { sessionId: 3, name: 'Tech Trends 2022' },
    { sessionId: 4, name: 'Startups Ideas Exchange' },
    { sessionId: 5, name: 'AI and Machine Learning' },
    { sessionId: 6, name: 'Web Development Best Practices' },
    { sessionId: 7, name: 'Data Science Insights' },
    { sessionId: 8, name: 'Product Design Workshop' },
    { sessionId: 9, name: 'Entrepreneurship Stories' },
    { sessionId: 10, name: 'Investment Opportunities' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setSideBarToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sideBarRef]);

  return (
    <StyledHome>
      <Nav sideBarToggled={sideBarToggled} setSideBarToggle={setSideBarToggle} />
      <StyledDiv className={sideBarToggled ? '' : 'slide-back'} $sideBarToggled={sideBarToggled}>
        { sideBarToggled && (<SideBar chats={chats} ref={sideBarRef} />)}
      </StyledDiv>
      <ChatSection />
      <ChatInput />
    </StyledHome>
  );
}

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  background: #343541;
`;

const StyledDiv = styled.div`
  position: absolute;
  top: 0px;
  transition: transform 0.2s ease-out;
  transform: ${(props) => (props.$sideBarToggled ? 'translateX(0)' : 'translateX(-100%)')};
`;

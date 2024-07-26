import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { isEmpty, get } from 'lodash';
import SideBar from '../components/SideBar';
import Nav from '../components/Nav';
import UsagePopover from '../components/UsagePopover';
import ChatSection from '../components/ChatSection';
import ChatInput from '../components/ChatInput';
import { loadOpenAIModels } from '../redux/reducers/modelConfigurator.reducer';

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

  const { messages, error, isProcessing, streamMessageText, streamMessageInfo } = useSelector((state) => state.chat);
  const { models } = useSelector((state) => state.modelConfigurator);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isEmpty(error)) {
      const errorMessage = get(error, 'message', 'Oh its a empty message...');
      toast.error(errorMessage);
    }

    if (models && models.length === 0) {
      dispatch(loadOpenAIModels());
    }
  }, [error, models]);

  return (
    <div className="light:bg-[#343541] dark:bg-black">
      <Toaster />
      <SideBar chats={chats} ref={sideBarRef} isOpen={rightSideBarToggled} />
      <div
        className={`relative transition-all duration-500 text-black ${rightSideBarToggled ? 'ml-64' : 'ml-0'} overflow-hidden`}
      >
        {/* <ToggleLeftSideBarBtn onClick={() => setRightSideBarToggle(!rightSideBarToggled)}>
          {rightSideBarToggled ? <MdOutlineKeyboardArrowLeft size={30} /> : <MdKeyboardArrowRight size={30} />}
        </ToggleLeftSideBarBtn> */}

        <div className={`flex flex-col ${isEmpty(messages) ? 'justify-between' : ''} h-screen w-full overflow-auto relative`}>
          <Nav leftSideBarToggled={leftSideBarToggled} setLeftSideBarToggle={setLeftSideBarToggle} />
          <ChatSection
            messages={messages}
            isProcessing={isProcessing}
            streamMessageText={streamMessageText}
            streamMessageInfo={streamMessageInfo}
          />

          <div>
            <UsagePopover />
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from 'react-icons/md';
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

  const msgs = [
    {
      role: 'bot',
      id: 1,
      content: 'Hello, how can I help you today?',
    },
    {
      role: 'User',
      id: 2,
      content: 'I want to know more about the product',
    },
    {
      role: 'bot',
      id: 3,
      content: 'Sure, what do you want to know?',
    },
    {
      role: 'User',
      id: 4,
      content: 'What is the price of ETH today?',
    },
    {
      role: 'bot',
      id: 5,
      content:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum itaque esse facere reprehenderit minus? Recusandae eligendi aut rerum repellat sunt dolorum obcaecati delectus alias labore dolor, maiores dignissimos vitae sit!',
    },
    {
      role: 'bot',
      id: 5,
      content:
        "Sure! Here's a simple JavaScript functional for loop implementation:\n\n```javascript\nfunction forLoop(start, condition, increment, callback) {\n  if (condition(start)) {\n    callback(start);\n    const nextValue = increment(start);\n    forLoop(nextValue, condition, increment, callback);\n  }\n}\n\n// Usage example:\nforLoop(\n  0,\n  (i) => i < 5, // condition\n  (i) => i + 1, // increment\n  (i) => console.log(i) // callback\n);\n```\n\nIn this implementation, the `forLoop` function takes four parameters:\n\n- `start`: The initial value of the loop variable.\n- `condition`: A function that checks whether the loop should continue based on the current value of the loop variable.\n- `increment`: A function that calculates the next value of the loop variable.\n- `callback`: A function that is called for each iteration of the loop.\n\nThe `forLoop` function recursively calls itself with the updated value of the loop variable until the condition is no longer satisfied. Each iteration, it executes the provided callback function passing the current value of the loop variable as an argument.\n\nIn the usage example, it will print numbers from 0 to 4 to the console.",
    },
    {
      role: 'bot',
      id: 5,
      content:
        "Sure! Here's a simple JavaScript functional for loop implementation:\n\n```javascript\nfunction forLoop(start, condition, increment, callback) {\n  if (condition(start)) {\n    callback(start);\n    const nextValue = increment(start);\n    forLoop(nextValue, condition, increment, callback);\n  }\n}\n\n// Usage example:\nforLoop(\n  0,\n  (i) => i < 5, // condition\n  (i) => i + 1, // increment\n  (i) => console.log(i) // callback\n);\n```\n\nIn this implementation, the `forLoop` function takes four parameters:\n\n- `start`: The initial value of the loop variable.\n- `condition`: A function that checks whether the loop should continue based on the current value of the loop variable.\n- `increment`: A function that calculates the next value of the loop variable.\n- `callback`: A function that is called for each iteration of the loop.\n\nThe `forLoop` function recursively calls itself with the updated value of the loop variable until the condition is no longer satisfied. Each iteration, it executes the provided callback function passing the current value of the loop variable as an argument.\n\nIn the usage example, it will print numbers from 0 to 4 to the console.",
    },
    {
      role: 'bot',
      id: 5,
      content:
        "Sure! Here's a simple JavaScript functional for loop implementation:\n\n```javascript\nfunction forLoop(start, condition, increment, callback) {\n  if (condition(start)) {\n    callback(start);\n    const nextValue = increment(start);\n    forLoop(nextValue, condition, increment, callback);\n  }\n}\n\n// Usage example:\nforLoop(\n  0,\n  (i) => i < 5, // condition\n  (i) => i + 1, // increment\n  (i) => console.log(i) // callback\n);\n```\n\nIn this implementation, the `forLoop` function takes four parameters:\n\n- `start`: The initial value of the loop variable.\n- `condition`: A function that checks whether the loop should continue based on the current value of the loop variable.\n- `increment`: A function that calculates the next value of the loop variable.\n- `callback`: A function that is called for each iteration of the loop.\n\nThe `forLoop` function recursively calls itself with the updated value of the loop variable until the condition is no longer satisfied. Each iteration, it executes the provided callback function passing the current value of the loop variable as an argument.\n\nIn the usage example, it will print numbers from 0 to 4 to the console.",
    },
  ];

  return (
    <div>
      <SideBar chats={chats} ref={sideBarRef} isOpen={rightSideBarToggled} />
      <MainContent isOpen={rightSideBarToggled}>
        {/* Your main content goes here */}

        <ToggleLeftSideBarBtn onClick={() => setRightSideBarToggle(!rightSideBarToggled)}>
          {rightSideBarToggled ? <MdOutlineKeyboardArrowLeft size={30} /> : <MdKeyboardArrowRight size={30} />}
        </ToggleLeftSideBarBtn>

        <StyledHome>
          {/* TODO: refactor it */}
          <Nav leftSideBarToggled={leftSideBarToggled} setLeftSideBarToggle={setLeftSideBarToggle} />
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

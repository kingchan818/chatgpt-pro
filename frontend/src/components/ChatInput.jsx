import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowUp } from 'react-icons/fa6';
import { isEmpty } from 'lodash';

function ChatInput() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;

    if (message === '') {
      textareaRef.current.style.height = '44px';
    }
  }, [message]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <InputStyle className="mx-4">
      <textarea ref={textareaRef} value={message} onChange={handleChange} placeholder="Message ChatGPT..." rows={2} />
      {/* keep button on the button */}
      <div
        className={`absolute bottom-[6px] right-5 py-2 px-2 rounded-md ${
          !isEmpty(message) ? 'bg-white cursor-pointer' : 'input-button-opacity'
        }  `}
      >
        {/* arrow up icon */}
        <FaArrowUp color="black" />
      </div>
    </InputStyle>
  );
}

export default ChatInput;

const InputStyle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  .input-button-opacity {
    background-color: rgba(172, 172, 190, 0.2);
    border-radius: 6px;
  }

  textarea::-webkit-scrollbar {
    display: none;
  }
  textarea {
    box-sizing: border-box;
    width: 100%;
    height: 44px;
    padding: 10px 40px 10px 12px;
    background: #343541;
    resize: none;
    outline: none;
    display: flex;
    color: white; // This will change the font color to white
    caret-color: white; // This will change the input cursor color to white
    max-height: 200px;
    border: 0.5px solid rgba(217, 217, 227, 0.2);
    border-radius: 10px;
    padding: 10px 40px 10px 12px;
  }
`;

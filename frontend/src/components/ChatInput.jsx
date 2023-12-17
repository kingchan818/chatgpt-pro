import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

function ChatInput() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.style.height = '44px';
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [message]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <InputStyle className="mx-4">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        placeholder="Message ChatGPT..."
        rows={2}
      />
    </InputStyle>
  );
}

export default ChatInput;

const InputStyle = styled.div`
 margin-bottom: 20px;
  textarea {
    box-sizing: border-box;
    width:100%;
    height: 44px;
    padding:10px 40px 10px 12px;
    border-radius:10px;
    background: #343541;
    resize: none;
    outline: none;
    border: 0.5px solid rgba(217,217,227, 0.2);
    display: flex;
    color: white; // This will change the font color to white
    caret-color: white; // This will change the input cursor color to white
  }
`;

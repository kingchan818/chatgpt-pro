import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowUp } from 'react-icons/fa6';
import { isEmpty, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { setInputMsg, handleSSEMessage } from '../redux/reducers/chat.reducer';

function ChatInput() {
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const { inputMsg, messages = [], isProcessing } = useSelector((state) => state.chat);

  useEffect(() => {
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;

    if (inputMsg === '') {
      textareaRef.current.style.height = '44px';
    }
  }, [inputMsg]);

  const handleChange = (event) => {
    dispatch(setInputMsg(event.target.value));
  };

  return (
    <div className="flex items-center justify-center mx-4">
      <InputStyle className=" sm:w-[30rem] md:w-[30rem] xl:w-[60rem]">
        <textarea ref={textareaRef} value={inputMsg} onChange={handleChange} placeholder="Message ChatGPT..." rows={2} />
        {/* keep button on the button */}
        <button
          type="button"
          className={`absolute bottom-[10px] right-5 py-1 px-1 rounded-md ${
            !isEmpty(inputMsg) ? 'bg-white cursor-pointer' : 'input-button-opacity'
          } flex items-center`}
          onClick={() =>
            dispatch(
              handleSSEMessage({ message: inputMsg, parentMessageId: get(messages, [messages.length - 1, 'parentMessageId']) }),
            )
          }
        >
          {isProcessing ? (
            <svg
              aria-hidden="true"
              role="status"
              className="inline h-[16px] w-[16px]  text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#000"
              />
            </svg>
          ) : (
            <FaArrowUp color="black" />
          )}
        </button>
      </InputStyle>
    </div>
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

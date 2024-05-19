import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { FaArrowUp } from 'react-icons/fa6';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { handleSSEMessage } from '../redux/reducers/chat.reducer';

function ChatInput() {
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const [input, setInputMsg] = useState('');
  const { isProcessing } = useSelector((state) => state.chat);

  useEffect(() => {
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;

    if (input === '') {
      textareaRef.current.style.height = '44px';
    }
  }, [input]);

  const handleChange = (event) => {
    setInputMsg(event.target.value);
  };

  const submitMessage = useCallback(() => {
    if (isProcessing || isEmpty(input)) return;

    dispatch(handleSSEMessage({ message: input }));
    setInputMsg('');
  }, [dispatch, input, isProcessing]);

  const handleKeyDown = (event) => {
    // TODO: making key down as a config that can config by user

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="flex items-center justify-center mx-4 sticky bottom-0">
      <InputStyle className="sm:w-full md:w-[40rem] xl:w-[60rem] w-[50rem]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          placeholder="Message ChatGPT..."
          rows={2}
          onKeyDown={handleKeyDown}
          className="dark:bg-black dark:text-white dark:caret-white"
        />
        {/* keep button on the button */}
        <button
          type="button"
          className={`absolute bottom-[10px] right-5 py-1 px-1 rounded-md ${
            !isEmpty(input) && !isProcessing ? 'bg-white cursor-pointer' : 'bg-[#acacbe]/20'
          } flex items-center`}
          onClick={submitMessage}
          disabled={isEmpty(input) || isProcessing}
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
    resize: none;
    outline: none;
    display: flex;
    max-height: 200px;
    border: 2px solid rgba(217, 217, 227, 0.5);
    border-radius: 10px;
    padding: 10px 40px 10px 12px;
  }
`;

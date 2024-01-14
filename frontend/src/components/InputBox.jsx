/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

function InputBox({ isActive, onClick }) {
  return (
    <div className="inline-flex items-center">
      <label className="relative flex items-center p-3 rounded-full cursor-pointer">
        <input
          type="checkbox"
          className="before:content[''] peer relative h-8 w-8 cursor-pointer appearance-none rounded-full border border-white/20 bg-white/10 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-white checked:bg-white checked:before:bg-white hover:scale-105 hover:before:opacity-0"
          id="customStyle"
          checked={isActive}
          readOnly
          onClick={onClick}
        />
        <span className="absolute text-black transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </label>
    </div>
  );
}

InputBox.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

InputBox.defaultProps = {
  isActive: false,
};

export default InputBox;

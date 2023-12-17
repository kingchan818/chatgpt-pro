import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaRegEdit } from 'react-icons/fa';
import PropTypes from 'prop-types';

Nav.propTypes = {
  sideBarToggled: PropTypes.bool.isRequired,
  setSideBarToggle: PropTypes.func.isRequired,
};

export default function Nav(props) {
  const { sideBarToggled, setSideBarToggle } = props;

  return (
    <div className="flex bg-[#343541] text-white justify-between items-center h-[55px] border-b-8 border-[#202123] px-3">
      <div className="checked:outline">
        <RxHamburgerMenu onClick={() => setSideBarToggle(!sideBarToggled)} className="cursor-pointer" />
      </div>
      <div className="font-medium">ChatGPT 3.5</div>
      <FaRegEdit className="cursor-pointer" />
    </div>
  );
}

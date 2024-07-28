import PropTypes from 'prop-types';
import React from 'react';
import { LuPanelLeftOpen, LuPanelRightOpen } from 'react-icons/lu';
import ModelDropDown from './ModelDropDown';
import SettingsMenu from './SettingsMenu';

MenuIcon.propTypes = {
  sideBarToggled: PropTypes.bool.isRequired,
  setFn: PropTypes.func.isRequired,
};

function MenuIcon({ sideBarToggled, setFn }) {
  return (
    <div className="checked:outline">
      {sideBarToggled ? (
        <LuPanelRightOpen onClick={() => setFn(!sideBarToggled)} className="cursor-pointer" />
      ) : (
        <LuPanelLeftOpen onClick={() => setFn(!sideBarToggled)} className="cursor-pointer" />
      )}
    </div>
  );
}

export default function Nav(props) {
  return (
    <div className="flex dark:text-white justify-between items-center px-3 py-3 sticky top-0 bg-white dark:bg-black z-10">
      <ModelDropDown />
      <SettingsMenu />
    </div>
  );
}

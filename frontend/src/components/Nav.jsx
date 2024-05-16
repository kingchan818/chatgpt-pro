import PropTypes from 'prop-types';
import React from 'react';
import { LuPanelLeftOpen, LuPanelRightOpen } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';
import ModelDropDown from './ModelDropDown';

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
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex dark:text-white justify-between items-center px-3 py-3 sticky top-0 bg-white dark:bg-black">
      <ModelDropDown />
      <Button
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      >
        {theme === 'dark' ? 'toggle white mode' : 'toggle dark mode'}
      </Button>
    </div>
  );
}

import PropTypes from 'prop-types';
import React from 'react';
import { LuPanelLeftOpen, LuPanelRightOpen } from 'react-icons/lu';
import { SquarePen } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearMessage } from '@/redux/reducers/chat.reducer';
import ModelDropDown from './ModelDropDown';
import SettingsMenu from './SettingsMenu';
import { Button } from './ui/button';

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
  const dispatch = useDispatch();
  return (
    <div className="flex dark:text-white justify-between items-center px-3 py-3 sticky top-0 bg-white dark:bg-black z-10">
      <div className="flex items-center">
        <Button
          size="icon"
          variant="outline"
          className="bg-transparent border-0 hover:bg-black/10 dark:hover:bg-white/10 mr-2"
          onClick={() => dispatch(clearMessage())}
        >
          <SquarePen size={23} className="opacity-50 dark:opacity-50" />
        </Button>
        <ModelDropDown />
      </div>
      <SettingsMenu />
    </div>
  );
}

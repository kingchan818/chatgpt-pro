import PropTypes from 'prop-types';
import React from 'react';
import { LuPanelLeftOpen, LuPanelRightOpen } from 'react-icons/lu';
import { Moon, Sun } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Nav(props) {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex dark:text-white justify-between items-center px-3 py-3 sticky top-0 bg-white dark:bg-black">
      <ModelDropDown />
      <ModeToggle />
      {/* </ModeToggle> */}
    </div>
  );
}

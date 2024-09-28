import React, { useEffect } from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar';
import { LuSettings2 } from 'react-icons/lu';
import { MenubarSub } from '@radix-ui/react-menubar';
import { setSystemPrompts } from '@/redux/reducers/modelConfigurator.reducer';
import { useDispatch } from 'react-redux';
import { DEFAULT_SYSTEM_PROMPT } from '@/domain';
import { useTheme } from './theme-provider';

function SettingsMenu() {
  const { setTheme } = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    const localSystemPrompts = JSON.parse(localStorage.getItem('systemPrompts')) || [];
    dispatch(setSystemPrompts([...localSystemPrompts, ...DEFAULT_SYSTEM_PROMPT]));
  }, [dispatch]);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-transparent">
          <LuSettings2 />
        </MenubarTrigger>
        <MenubarContent className="mr-3 mt-2 w-3">
          {/* toggle theme */}
          <MenubarSub>
            <MenubarSubTrigger iconPosition="left"> Theme 🎨 </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => setTheme('light')} inset>
                <span>Light &nbsp;🌞</span>
              </MenubarItem>
              <MenubarItem onClick={() => setTheme('dark')} inset>
                <span>Dark &nbsp;🌚</span>
              </MenubarItem>
              <MenubarItem onClick={() => setTheme('system')} inset>
                System
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>

          <MenubarSeparator />
          {/* </MenubarItem> */}
          <MenubarSeparator />
          <MenubarItem className="justify-center">More stuffs are coming...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default SettingsMenu;

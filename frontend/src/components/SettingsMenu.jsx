import React, { useState, useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { DEFAULT_SYSTEM_PROMPT } from '@/domain';
import { useTheme } from './theme-provider';

// function EmptySystemPrompt() {
//   return (
//     <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
//       <div className="flex flex-col items-center gap-1 text-center">
//         <h3 className="text-2xl font-bold tracking-tight">You have no products</h3>
//         <p className="text-sm text-muted-foreground">You can start selling as soon as you add a product.</p>
//         <Button className="mt-4">Add Some Prompt</Button>
//       </div>
//     </div>
//   );
// }

function SettingsMenu() {
  const { setTheme } = useTheme();
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const { systemPrompts = [], currentSystemPrompt } = useSelector((state) => state.modelConfigurator);
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

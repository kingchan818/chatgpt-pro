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
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setCurrentSystemPrompt, setSystemPrompts } from '@/redux/reducers/modelConfigurator.reducer';
import { useSelector, useDispatch } from 'react-redux';
import { DEFAULT_SYSTEM_PROMPT } from '@/domain';
import { toast } from 'sonner';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
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
  const navigation = useNavigate();

  useEffect(() => {
    const localSystemPrompts = JSON.parse(localStorage.getItem('systemPrompts')) || [];
    dispatch(setSystemPrompts([...localSystemPrompts, ...DEFAULT_SYSTEM_PROMPT]));
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem('apiKey');
    navigation(0);
  };

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

          <div className="flex items-center justify-center">
            <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-0 text-sm p-2 h-full w-full font-normal">
                  Prompt Library 📕
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-auto">
                <SheetHeader>
                  <SheetTitle>Select Your System Prompt (Persona)</SheetTitle>
                  <SheetDescription>
                    Choose and customize your system prompt settings below. Be sure to click save once you’ve made your
                    selections.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex justify-center items-center flex-col mt-5">
                  {systemPrompts &&
                    systemPrompts.length > 0 &&
                    systemPrompts.map((item) => (
                      <Card
                        className="w-full mt-3 cursor-pointer"
                        key={item.id}
                        onClick={() => {
                          const previousSystemPrompt = currentSystemPrompt;
                          dispatch(setCurrentSystemPrompt(item));
                          toast(`Your system prompt has been set to ${item.title}`, {
                            position: 'bottom-left',
                            action: {
                              label: 'Undo',
                              onClick: () => dispatch(setCurrentSystemPrompt(previousSystemPrompt)),
                            },
                          });
                        }}
                      >
                        <CardHeader className="p-3">
                          <CardTitle className="text-lg flex">{item.title}</CardTitle>
                          <CardDescription className="truncate">{item.prompt}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}

                  <Button className="w-full mt-3" disabled>
                    Add Your System Prompt <IoAddCircleOutline className="ml-2" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* </MenubarItem> */}
          <MenubarSeparator />
          <MenubarItem className="justify-center">More stuffs are coming...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="justify-center" onClick={logout}>
            Logout
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default SettingsMenu;

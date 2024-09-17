import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { clearMessage } from '@/redux/reducers/chat.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { setCurrentSystemPrompt } from '@/redux/reducers/modelConfigurator.reducer';
import { toast } from 'sonner';
import { IoAddCircleOutline, IoLibraryOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ChatGPTSvg } from '../assets/chatgpt-24.svg';
import UsagePopover from './UsagePopover';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

function SideBar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const animation = 'transition-all duration-300 ease-in-out transform hover:w-56';
  const isHoverStyle = `${isHovered ? 'w-56' : 'w-12'}`;

  const { systemPrompts = [], currentSystemPrompt } = useSelector((state) => state.modelConfigurator);

  const logout = () => {
    localStorage.removeItem('apiKey');
    navigation(0);
  };

  return (
    <div
      className="border-2 rounded-md ml-2 my-2 p-[5px] flex-col mr-1 items-center justify-center sticky hidden md:flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1">
        <Button
          size="icon"
          onClick={() => dispatch(clearMessage())}
          className={`${animation} z-10 dark:bg-white dark:text-black ${isHoverStyle} p-1`}
          variant="outline"
        >
          <ChatGPTSvg /> {isHovered && <div className="ml-1"> Create New Chat Session </div>}
        </Button>
      </div>

      <UsagePopover className={`${animation} ${isHoverStyle} justify-items-end`} />
      <div className="flex items-center justify-center mt-1">
        <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`${animation} ${isHoverStyle}`}
              onClick={() => {
                setIsHovered(false);
              }}
            >
              <IoLibraryOutline />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-auto">
            <SheetHeader>
              <SheetTitle>Select Your System Prompt (Persona)</SheetTitle>
              <SheetDescription>
                Choose and customize your system prompt settings below. Be sure to click save once you’ve made your selections.
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

      <Button size="icon" className={`${animation} ${isHoverStyle} mt-1`} variant="outline" onClick={logout}>
        <IoIosLogOut />
      </Button>
    </div>
  );
}

export default SideBar;

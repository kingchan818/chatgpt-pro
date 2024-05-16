import React, { Fragment, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ContextMenu, ContextMenuTrigger, ContextMenuItem, ContextMenuContent } from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { createIcon } from '../utils';
import { loadOpenAIModels, setCurrentModel } from '../redux/reducers/modelConfigurator.reducer';
import InputBox from './InputBox';

function ModelDropDown() {
  const [toggleDropDownList, setToggleDropDownList] = useState(false);
  const { currentModel, predefinedModels, availableModels } = useSelector((state) => state.modelConfigurator);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOpenAIModels());
  }, [dispatch]);

  return (
    <DropDownList
      className={`flex items-center cursor-pointer font-medium rounded-md p-2 hover:bg-black/10 ${toggleDropDownList ? 'bg-black/10' : ''} z-30`}
    >
      <button type="button" className="flex items-center" onClick={() => setToggleDropDownList(!toggleDropDownList)}>
        <div>
          ChatGPT <span className="dark:text-white/50 text-black/50">{currentModel.name}</span>
        </div>
        <RiArrowDropDownLine size={20} />
      </button>

      {toggleDropDownList && (
        <div className="content flex flex-col items-center justify-center mt-2 min-w-[340px] max-w-xs overflow-hidden rounded-lg border border-gray-100 bg-token-surface-primary shadow-lg dark:border-gray-700 bg-white dark:bg-[#202123]">
          {predefinedModels.map((model) => {
            const ReactIcon = createIcon(model.icon);
            return (
              <button
                className="flex p-3 justify-between items-center"
                type="button"
                key={model.id}
                onClick={() => dispatch(setCurrentModel(model))}
              >
                <ReactIcon size={model.size} />
                <div className="mx-3 text-start">
                  <div className="text-base">
                    ChatGPT <span className="text-white/70">{model.name}</span>
                  </div>
                  <div className="text-sm text-gray-400">{model.description}</div>
                </div>
                <InputBox
                  isActive={currentModel.id === model.id}
                  onClick={() => {
                    dispatch(setCurrentModel(model));
                  }}
                />
              </button>
            );
          })}

          <Dialog>
            <DialogTrigger className="w-2/3" asChild>
              <Button className="mt-2 mb-2">Configure Current Model</Button>
            </DialogTrigger>

            <DialogContent className="w-2/3">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Configure AI Models</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <div className="border-2 rounded-md p-3 flex flex-col">
                {availableModels.map((model) => (
                  <div key={model.id} className="hover:bg-black/5 rounded-md dark:text-white dark:hover:bg-white/10">
                    <button
                      type="button"
                      className="p-2"
                      onClick={() => {
                        dispatch(setCurrentModel(model));
                        setToggleDropDownList(false);
                      }}
                    >
                      {model.id}
                    </button>
                    {/* TODO: Add Temperature and output settings should also trigger another dialog */}
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </DropDownList>
  );
}

export default ModelDropDown;

const DropDownList = styled.div`
  position: relative;
  .content {
    position: absolute;
    left: 1px;
    top: 101%;
  }
`;

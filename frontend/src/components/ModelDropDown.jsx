import React, { useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createIcon } from '../utils';
import { loadOpenAIModels, setCurrentModel } from '../redux/reducers/modelConfigurator.reducer';
import InputBox from './InputBox';
import ModelConfiguratorDialog from './ModelConfiguratorDialog';

function ModelDropDown() {
  const [toggleDropDownList, setToggleDropDownList] = useState(false);
  const { currentModel, predefinedModels } = useSelector((state) => state.modelConfigurator);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOpenAIModels());
  }, [dispatch]);

  return (
    <DropDownList
      className={`flex items-center cursor-pointer font-medium rounded-md p-2 hover:bg-black/10 dark:hover:bg-white/10 ${toggleDropDownList ? 'bg-black/10' : ''} z-30`}
    >
      <button type="button" className="flex items-center" onClick={() => setToggleDropDownList(!toggleDropDownList)}>
        <div>
          ChatGPT <span className="dark:text-white/50 text-black/50">{currentModel.name}</span>
        </div>
        <RiArrowDropDownLine size={20} />
      </button>

      {toggleDropDownList && (
        <button
          type="button"
          className="content flex flex-col items-center justify-center mt-2 min-w-[340px] max-w-xs overflow-hidden rounded-lg border border-gray-100 bg-token-surface-primary shadow-lg dark:border-gray-700 bg-white dark:bg-[#202123] p-3"
        >
          {predefinedModels.map((model) => {
            const ReactIcon = createIcon(model.icon);
            return (
              <button
                className="flex py-2 px-1 justify-between items-center"
                type="button"
                key={model.id}
                onClick={() => {
                  dispatch(setCurrentModel(model));
                }}
              >
                <ReactIcon size={model.size} />
                <div className="mx-3 text-start">
                  <div className="text-base">
                    ChatGPT <span className="dark:text-white/70 text-black/50">{model.name}</span>
                  </div>
                  <div className="text-sm dark:text-gray-400 text-black/50">{model.description}</div>
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
          <ModelConfiguratorDialog setToggleDropDownList={setToggleDropDownList} />
        </button>
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

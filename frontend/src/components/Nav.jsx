import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { GrActions } from 'react-icons/gr';
import { LuPanelLeftOpen, LuPanelRightOpen } from 'react-icons/lu';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { RxLightningBolt } from 'react-icons/rx';
import styled from 'styled-components';
import InputBox from './InputBox';

Nav.propTypes = {
  setLeftSideBarToggle: PropTypes.func.isRequired,
  leftSideBarToggled: PropTypes.bool.isRequired,
};

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
const models = [
  {
    id: 1,
    name: '3 Turbo',
    icon: RxLightningBolt,
    description: 'The most fastest chatbot in the world',
    size: 20,
  },
  {
    id: 2,
    name: '4 Turbo',
    icon: GrActions,
    description: 'The most fastest chatbot in the world',
    size: 25,
  },
];

export default function Nav(props) {
  const { leftSideBarToggled, setLeftSideBarToggle } = props;

  const [toggleDropDownList, setToggleDropDownList] = useState(false);
  // TODO: Need a refactor to use context provider to manage the state
  const [currentModel, setCurrentModel] = useState({
    id: 1,
    name: '3 Turbo',
    icon: RxLightningBolt,
    description: 'The most fastest chatbot in the world',
    size: 20,
  });

  // TODO: the model should predefined in some where

  return (
    <div className="flex bg-[#343541] text-white justify-between items-center h-[80px] px-3">
      <DropDownList
        className={`flex items-center cursor-pointer font-medium rounded-md p-2 hover:bg-black/10 ${toggleDropDownList ? 'bg-black/10' : ''}`}
        onClick={() => setToggleDropDownList(!toggleDropDownList)}
      >
        <div className="flex items-center">
          <div>
            ChatGPT <span className="text-white/50">{currentModel.name}</span>
          </div>
          <RiArrowDropDownLine size={20} />
        </div>
        {toggleDropDownList && (
          <div className="content mt-2 min-w-[340px] max-w-xs overflow-hidden rounded-lg border border-gray-100 bg-token-surface-primary shadow-lg dark:border-gray-700 bg-[#202123]">
            {models.map((model) => {
              const IconRef = model.icon;
              return (
                <button
                  className="flex p-3 justify-between items-center"
                  type="button"
                  key={model.id}
                  onClick={() => setCurrentModel(model)}
                >
                  <IconRef size={model.size} />
                  <div className="mx-3 text-start">
                    <div className="text-base">
                      ChatGPT <span className="text-white/70">{model.name}</span>
                    </div>
                    <div className="text-sm text-gray-400">{model.description}</div>
                  </div>
                  <InputBox isActive={currentModel.id === model.id} onClick={() => setCurrentModel(model)} />
                </button>
              );
            })}
          </div>
        )}
      </DropDownList>
      <MenuIcon sideBarToggled={leftSideBarToggled} setFn={setLeftSideBarToggle} />
    </div>
  );
}

const DropDownList = styled.div`
  position: relative;
  .content {
    position: absolute;
    left: 1px;
    top: 101%;
  }
`;

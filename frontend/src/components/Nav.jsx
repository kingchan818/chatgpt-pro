import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { LuPanelLeftOpen, LuPanelRightOpen } from 'react-icons/lu';
import { RiArrowDropDownLine } from 'react-icons/ri';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentModel } from '../redux/reducers/modelConfigurator.reducer';
import InputBox from './InputBox';
import { createIcon } from '../utils';

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

export default function Nav(props) {
  const { leftSideBarToggled, setLeftSideBarToggle } = props;
  const [toggleDropDownList, setToggleDropDownList] = useState(false);
  const { currentModel, models } = useSelector((state) => state.modelConfigurator);
  const dispatch = useDispatch();

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
                  <InputBox isActive={currentModel.id === model.id} onClick={() => dispatch(setCurrentModel(model))} />
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

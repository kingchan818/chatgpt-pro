import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, validateInviteToken } from '../redux/reducers/user.reducer';
import Loading from './Loading';
import TextInput from './TextInput';

function LoginCard() {
  const [openAIKey, setOpenAIKey] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleRegister = () => {
    if (openAIKey) {
      dispatch(register(openAIKey));
    } else if (inviteToken) {
      dispatch(validateInviteToken(inviteToken));
    }
  };

  return (
    <div className="flex bg-black text-white p-5 border-[1.5px] border-white/25 w-[300px] rounded-md flex-col justify-center">
      <span className="font-medium text-2xl">Create an account</span>
      <span className="font-normal text-sm text-white/60 mt-2 border-b-[0.5px] border-white/25 pb-5">
        Enter your openAI Key below to create your account
      </span>
      <TextInput label="OpenAI key" setFn={setOpenAIKey} value={openAIKey} />

      <div className="flex items-center justify-center mt-5">
        <div className="flex-1 h-[1px] bg-white/25" />
        <span className="text-white/60 mx-3 text-sm">Or continue with invite token</span>
        <div className="flex-1 h-[1px] bg-white/25" />
      </div>

      <TextInput label="Invite token" setFn={setInviteToken} value={inviteToken} />

      <button
        type="button"
        onClick={() => handleRegister()}
        className="bg-white hover:bg-white/95 p-1 rounded-md flex justify-center items-center text-black cursor-pointer mt-4 font-medium py-2"
      >
        {loading ? <Loading /> : <span>Create account</span>}
      </button>
    </div>
  );
}

export default LoginCard;

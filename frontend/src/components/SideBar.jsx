import React from 'react';
import { Button } from '@/components/ui/button';
import chatgpt from '../assets/chatgpt-24.svg';

function SideBar() {
  return (
    <div className="h-screen w-12 border-2 absolute rounded-md mx-3 my-2 flex hover:bg-sky-700">
      <Button onClick={() => console.log('clicked')} />
    </div>
  );
}

export default SideBar;

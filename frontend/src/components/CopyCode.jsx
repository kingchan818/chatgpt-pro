import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LuClipboardCopy } from 'react-icons/lu';

CopyCode.propTypes = {
  text: PropTypes.string.isRequired,
};

function CopyCode({ text }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (msg) => {
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <button type="button" className="opacity-60 cursor-pointer flex" onClick={() => copyToClipboard(text)}>
      {copied ? <span className="mr-2 text-xs">Copied!</span> : <LuClipboardCopy className="z-0" />}
    </button>
  );
}

export default CopyCode;

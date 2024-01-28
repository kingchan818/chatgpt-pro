import React, { useEffect, useState } from 'react';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import { FaRegCopy } from 'react-icons/fa';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PropTypes from 'prop-types';

SyntaxHighlighter.propTypes = {
  language: PropTypes.string.isRequired,
  codeString: PropTypes.string.isRequired,
};

function SyntaxHighlighter({ language, codeString }) {
  const [copied, setCopied] = useState(false);

  const copyCode = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div>
      <div className="flex flex-row my-2 w-full text-sm font-light text-white/40">
        <div className="flex-1 ml-1">{language}</div>
        <button type="button" className="flex items-center" onClick={copyCode}>
          {copied ? (
            <span className="mr-2">Copied!</span>
          ) : (
            <>
              <span className="mr-2">Copy Code</span>
              <FaRegCopy />
            </>
          )}
        </button>
      </div>

      <ReactSyntaxHighlighter language={language} style={oneDark}>
        {codeString}
      </ReactSyntaxHighlighter>
    </div>
  );
}
export default SyntaxHighlighter;

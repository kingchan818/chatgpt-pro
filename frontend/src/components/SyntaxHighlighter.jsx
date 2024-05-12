import React, { memo, useState } from 'react';
import { get } from 'lodash';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import { FaRegCopy } from 'react-icons/fa';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PropTypes from 'prop-types';

SyntaxHighlighter.propTypes = {
  language: PropTypes.string.isRequired,
  codeString: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  inline: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

function SyntaxHighlighter({ node, inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);

  const copyCode = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const hasLang = /language-(\w+)/.exec(className || '');
  const lang = get(hasLang, '1');
  const hasMeta = node?.data?.meta;

  return (
    <>
      {lang && (
        <div className="flex flex-row my-2 w-full text-sm font-light text-white/40">
          <div className="flex-1 ml-1">{lang}</div>
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
      )}

      {!inline && hasLang ? (
        <ReactSyntaxHighlighter
          style={oneDark}
          language={hasLang[1]}
          PreTag="div"
          className="codeStyle"
          showLineNumbers
          wrapLines={hasMeta}
        >
          {String(children).replace(/\n$/, '')}
        </ReactSyntaxHighlighter>
      ) : (
        <code className={className || ''} {...props}>
          {children}
        </code>
      )}
    </>
  );
}
export default memo(SyntaxHighlighter);

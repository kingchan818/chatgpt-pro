import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';

import SyntaxHighlighter from './SyntaxHighlighter';

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
};

function Markdown({ content }) {
  return (
    <ReactMarkdown
      components={{ code: SyntaxHighlighter }}
      remarkPlugins={[remarkGfm, rehypeHighlight]}
      className="text-white/70 font-extralight leading-loose"
    >
      {content}
    </ReactMarkdown>
  );
}

export default Markdown;

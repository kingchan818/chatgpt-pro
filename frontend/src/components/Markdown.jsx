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

const components = {
  code: SyntaxHighlighter,
  h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold mb-3">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg font-bold mb-2">{children}</h4>,
  h5: ({ children }) => <h5 className="text-md font-bold mb-2">{children}</h5>,
  h6: ({ children }) => <h6 className="text-sm font-bold mb-1">{children}</h6>,
  p: ({ children }) => <p className=" mb-4">{children}</p>,
  a: ({ children, href }) => (
    <a href={href} className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 active:text-blue-700">{children}</a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 ml-5 pl-4  mb-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 ml-5 pl-4 mb-4">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className=" leading-relaxed mb-2 pl-2">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="pl-4 border-l-4 border-gray-300 italic  my-4">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 my-4">
      <tbody className="bg-white dark:bg-gray-900">{children}</tbody>
    </table>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto my-4">
      {children}
    </pre>
  ),
  th: ({ children }) => <th className="border border-white p-2">{children}</th>,
  td: ({ children }) => <td className="border border-white p-2">{children}</td>,
  tr: ({ children }) => <tr className="border border-white">{children}</tr>,
};

function Markdown({ content }) {
  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm, rehypeHighlight]}
      className="dark:text-white/70 text-black font-extralight leading-loose"
    >
      {content}
    </ReactMarkdown>
  );
}

export default Markdown;

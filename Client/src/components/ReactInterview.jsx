import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Loader2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from './MainLayout';

const CustomH1 = ({ children, ...props }) => (
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4 sm:mb-6 mt-6 sm:mt-8" {...props}>
    {children}
  </h1>
);

const CustomH2 = ({ children, ...props }) => (
  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-700 mb-3 sm:mb-4 mt-6 sm:mt-8 border-l-4 border-indigo-500 pl-3 sm:pl-4" {...props}>
    {children}
  </h2>
);

const CustomH3 = ({ children, ...props }) => (
  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg shadow-lg mb-3 sm:mb-4 mt-4 sm:mt-6" {...props}>
    {children}
  </h3>
);

const CustomH4 = ({ children, ...props }) => (
  <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 mb-2 sm:mb-3 mt-3 sm:mt-4 bg-gray-100 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md" {...props}>
    {children}
  </h4>
);

// Responsive Image component
const CustomImage = ({ src, alt, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getImageSrc = (originalSrc) => {
    if (!originalSrc || typeof originalSrc !== 'string') {
      return '';
    }
    
    if (originalSrc.startsWith('http')) {
      return originalSrc;
    }
    return `https://raw.githubusercontent.com/codeverse124/repo/main/${originalSrc}`;
  };

  const imageSrc = getImageSrc(src);

  if (!imageSrc) {
    return null;
  }

  return (
    <>
      <div className="my-4 sm:my-6 lg:my-8 text-center">
        <div className="inline-block bg-white p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 max-w-full">
          <img
            src={imageSrc}
            alt={alt || ''}
            className="max-w-full h-auto rounded-md sm:rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => setIsModalOpen(true)}
            {...props}
          />
        </div>
        {alt && (
          <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 italic font-medium px-2">
            {alt}
          </p>
        )}
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={imageSrc}
            alt={alt || ''}
            className="max-w-full max-h-full rounded-lg"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 text-sm sm:text-base"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

// Responsive Code block component
const CustomCodeBlock = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || 'javascript';
  
  const copyToClipboard = () => {
    if (children && typeof children === 'string') {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-4 sm:my-6">
      <div className="flex items-center justify-between bg-gray-800 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-t-lg">
        <span className="text-xs sm:text-sm text-gray-300 font-medium">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors duration-200 text-xs sm:text-sm"
        >
          {copied ? <Check size={14} className="sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="bg-gray-900 text-gray-100 p-2 sm:p-3 lg:p-4 rounded-b-lg overflow-x-auto border-t border-gray-700">
        <code className={`${className || ''} block whitespace-pre text-xs sm:text-sm`} {...props}>
          {children}
        </code>
      </div>
    </div>
  );
};

const CustomInlineCode = ({ children, ...props }) => (
  <code 
    className="bg-gray-800 text-cyan-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono border border-gray-600" 
    {...props}
  >
    {children}
  </code>
);

// Responsive table components
const CustomTable = ({ children, ...props }) => (
  <div className="overflow-x-auto my-4 sm:my-6 lg:my-8 -mx-2 sm:mx-0">
    <table className="w-full min-w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden" {...props}>
      {children}
    </table>
  </div>
);

const CustomTableRow = ({ children, ...props }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150" {...props}>
    {children}
  </tr>
);

const CustomTableCell = ({ children, ...props }) => (
  <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm lg:text-base" {...props}>
    {children}
  </td>
);

const CustomTableHeader = ({ children, ...props }) => (
  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-left text-xs sm:text-sm lg:text-base" {...props}>
    {children}
  </th>
);

// Custom link component for instant scrolling
const CustomLink = ({ href, children, ...props }) => {
  const handleClick = (e) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'auto',
          block: 'start',
          inline: 'nearest'
        });
        
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 break-words"
      {...props}
    >
      {children}
    </a>
  );
};

export default function ReactInterview() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const githubRawUrl = 'https://raw.githubusercontent.com/codeverse124/repo/main/README.md';
    
    fetch(githubRawUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading content:', error);
        setError('Failed to load content from GitHub. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const components = {
    h1: CustomH1,
    h2: CustomH2,
    h3: CustomH3,
    h4: CustomH4,
    img: CustomImage,
    table: CustomTable,
    thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: CustomTableRow,
    td: CustomTableCell,
    th: CustomTableHeader,
    a: CustomLink,
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return <CustomInlineCode {...props}>{children}</CustomInlineCode>;
      }
      return <CustomCodeBlock className={className} {...props}>{children}</CustomCodeBlock>;
    },
  };

  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-50 sm:bg-white px-2 sm:px-4 lg:px-12 py-3 sm:py-6 overflow-auto">
      <div className="max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto bg-white shadow-lg sm:shadow-2xl rounded-lg sm:rounded-2xl p-3 sm:p-6 lg:p-10">
        <motion.h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center text-transparent bg-clip-text bg-codeverse-gradient"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📘 React Interview Handbook
        </motion.h1>

        {loading ? (
          <div className="flex flex-col sm:flex-row justify-center items-center py-10 sm:py-20">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            <p className="mt-2 sm:mt-0 sm:ml-3 text-gray-600 text-xs sm:text-sm italic text-center">
              Content is loading, please wait a moment...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10 sm:py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-sm sm:max-w-md mx-auto">
              <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-red-700 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            className="prose prose-sm sm:prose lg:prose-lg max-w-none prose-zinc dark:prose-invert prose-headings:scroll-mt-2 sm:prose-headings:scroll-mt-4
              prose-a:text-blue-600 dark:prose-a:text-blue-400 space-y-3 sm:space-y-4 lg:space-y-6
              [&>p]:mt-2 sm:[&>p]:mt-3 lg:[&>p]:mt-4 [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:text-sm sm:[&>p]:text-base
              [&>strong]:text-red-600 [&>strong]:font-semibold
              [&>em]:text-indigo-700 [&>em]:font-medium
              [&>ul]:mt-2 sm:[&>ul]:mt-3 lg:[&>ul]:mt-4 [&>ul]:space-y-1 sm:[&>ul]:space-y-2 
              [&>ol]:mt-2 sm:[&>ol]:mt-3 lg:[&>ol]:mt-4 [&>ol]:space-y-1 sm:[&>ol]:space-y-2
              [&>li]:text-gray-700 [&>li]:text-sm sm:[&>li]:text-base
              [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-2 sm:[&>blockquote]:pl-4 
              [&>blockquote]:italic [&>blockquote]:bg-blue-50 [&>blockquote]:py-1.5 sm:[&>blockquote]:py-2

              /* Override default prose image styles */
              prose-img:my-0 prose-img:rounded-none prose-img:shadow-none

              /* Responsive Table of Contents Styling */
              [&_table]:shadow-lg sm:[&_table]:shadow-xl [&_table]:rounded-lg sm:[&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:my-4 sm:[&_table]:my-6 lg:[&_table]:my-8
              [&_table_td]:px-2 sm:[&_table_td]:px-4 lg:[&_table_td]:px-8 [&_table_td]:py-2 sm:[&_table_td]:py-3 lg:[&_table_td]:py-4 [&_table_td]:border-b [&_table_td]:border-gray-100
              [&_table_td:first-child]:w-12 sm:[&_table_td:first-child]:w-16 lg:[&_table_td:first-child]:w-20 [&_table_td:first-child]:text-center [&_table_td:first-child]:font-bold 
              [&_table_td:first-child]:text-indigo-600 [&_table_td:first-child]:bg-indigo-50
              [&_table_td:last-child]:pl-2 sm:[&_table_td:last-child]:pl-4 lg:[&_table_td:last-child]:pl-6
              [&_table_tr]:hover:bg-blue-50 [&_table_tr]:transition-all [&_table_tr]:duration-200
              [&_table_th]:bg-gradient-to-r [&_table_th]:from-indigo-600 [&_table_th]:to-blue-600 
              [&_table_th]:text-white [&_table_th]:font-semibold [&_table_th]:px-2 sm:[&_table_th]:px-4 lg:[&_table_th]:px-8 [&_table_th]:py-2 sm:[&_table_th]:py-3 lg:[&_table_th]:py-4
              [&_table_a]:text-gray-800 [&_table_a]:font-medium [&_table_a]:hover:text-blue-600 
              [&_table_a]:transition-colors [&_table_a]:duration-200 [&_table_a]:no-underline
              [&_table_a]:hover:underline [&_table_a]:text-xs sm:[&_table_a]:text-sm lg:[&_table_a]:text-base

              [&_a[href='#table-of-contents']]:inline-block 
              [&_a[href='#table-of-contents']]:bg-gradient-to-r 
              [&_a[href='#table-of-contents']]:from-blue-500 
              [&_a[href='#table-of-contents']]:to-indigo-500 
              [&_a[href='#table-of-contents']]:text-white 
              [&_a[href='#table-of-contents']]:px-2 sm:[&_a[href='#table-of-contents']]:px-3 lg:[&_a[href='#table-of-contents']]:px-4 
              [&_a[href='#table-of-contents']]:py-1 sm:[&_a[href='#table-of-contents']]:py-1.5 
              [&_a[href='#table-of-contents']]:rounded-md 
              [&_a[href='#table-of-contents']]:text-xs sm:[&_a[href='#table-of-contents']]:text-sm 
              [&_a[href='#table-of-contents']]:font-semibold 
              [&_a[href='#table-of-contents']]:shadow 
              [&_a[href='#table-of-contents']]:transition 
              [&_a[href='#table-of-contents']]:duration-200 
              [&_a[href='#table-of-contents']]:hover:opacity-90
              [&_a[href='#table-of-contents']]:mt-2 sm:[&_a[href='#table-of-contents']]:mt-3 lg:[&_a[href='#table-of-contents']]:mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ReactMarkdown
              children={content}
              components={components}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: 'append',
                    properties: {
                      className: ['ml-1', 'sm:ml-2', 'text-indigo-400', 'hover:text-indigo-600'],
                    },
                    content: {
                      type: 'element',
                      tagName: 'span',
                      properties: {},
                      children: [{ type: 'text', value: '#' }],
                    },
                  },
                ],
              ]}
            />
          </motion.div>
        )}
      </div>
    </div>
    </MainLayout>
  );
}

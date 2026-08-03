import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={`w-full p-3 border border-gray-300 rounded-xl outline-none 
        focus:border-indigo-500 resize-none text-sm transition-colors ${className}`}
    />
  );
}
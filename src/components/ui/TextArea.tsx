import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={`w-full p-3 bg-app-card border border-app-border 
        text-app-text placeholder:text-app-muted
        rounded-xl outline-none focus:border-indigo-500 resize-none text-sm transition-colors ${className}`}
    />
  );
}
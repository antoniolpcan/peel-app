import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full p-3 border border-gray-300 rounded-xl 
                  outline-none focus:border-indigo-500 transition-colors ${
        props.className || ''
      }`}
    />
  );
}
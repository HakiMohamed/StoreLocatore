import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { FaTimes, FaCogs } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const TagInput = ({ value, onChange, placeholder = "Ajouter un service...", error }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData?.getData('text');
      if (pastedText) {
        const tags = pastedText.split(/[,\n]/);
        tags.forEach(tag => addTag(tag));
      }
    };

    inputRef.current?.addEventListener('paste', handlePaste);
    return () => {
      inputRef.current?.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Services</label>
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`
          min-h-[42px] p-2 border rounded-lg flex flex-wrap gap-2 items-center
          bg-white transition-all duration-200 cursor-text
          ${error ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500' : 
                   'border-gray-300 focus-within:ring-indigo-500 focus-within:border-indigo-500'}
          focus-within:ring-2 focus-within:ring-opacity-50
        `}
      >
        <div className="flex items-center text-gray-400 pl-2">
          <FaCogs className="h-5 w-5" />
        </div>
        <AnimatePresence>
          {value.map((tag, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="
                inline-flex items-center px-3 py-1 rounded-full text-sm
                bg-indigo-50 text-indigo-700 hover:bg-indigo-100
                transition-colors duration-200
              "
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="ml-2 hover:text-indigo-900"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue) addTag(inputValue);
          }}
          className="
            flex-1 min-w-[120px] outline-none text-sm text-gray-900
            placeholder:text-gray-400 bg-transparent
          "
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}; 
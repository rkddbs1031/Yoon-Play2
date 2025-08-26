import { ChangeEvent, FormEvent, useEffect, useRef } from 'react';

import { SearchIcon } from '@/states/icon/svgs';

interface SearchInputProps {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  delay?: number;
  duration?: number;
  useAnimation?: boolean;
}

const SearchInput = ({
  value,
  placeholder = '검색어를 입력해 주세요.',
  disabled = false,
  onChange,
  onSubmit,
  useAnimation = false,
  delay,
  duration,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const animationStyles: React.CSSProperties = useAnimation
    ? ({
        '--animation-delay-var': `${delay}s`,
        '--animation-duration-var': `${duration}s`,
      } as React.CSSProperties)
    : {};

  return (
    <form
      className={`relative w-full ${useAnimation ? 'fade-in-up' : ''}`}
      onSubmit={handleSubmit}
      style={animationStyles}
    >
      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className='h-[50px] w-full leading-[50px] py-0 pr-[50px] pl-6 text-sm text-[#f3f3f3] bg-[#121212] rounded-full border-none outline-none'
      />
      <button
        type='submit'
        className='absolute z-100 top-[50%] right-6 translate-y-[-50%] text-[#fff] cursor-pointer'
        aria-label='검색'
      >
        <span className='sr-only'>검색</span>
        <SearchIcon size={16} stroke='#666666' />
      </button>
    </form>
  );
};

export default SearchInput;

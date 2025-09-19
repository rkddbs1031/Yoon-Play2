import { ChangeEvent, FormEvent, useEffect, useMemo, useRef } from 'react';

import { SearchIcon } from '@/states/icon/svgs';
import { animationStyle } from '@/utils/animation';
import { AnimationType } from '@/types/animation';
import { TextFieldType } from '@/types/textFiled';

interface SearchFieldProps {
  fieldType?: TextFieldType;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  delay?: number;
  duration?: number;
  useAnimation?: boolean;
  animationType?: AnimationType;
}

const SearchField = ({
  fieldType = TextFieldType.Input,
  value,
  placeholder = '검색어를 입력해 주세요.',
  disabled = false,
  onChange,
  onSubmit,
  useAnimation = false,
  animationType,
  delay,
  duration,
}: SearchFieldProps) => {
  const textFieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const TextFieldComponent = fieldType; // 'input' | 'textarea'

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);

  const animationStyles = useMemo(() => {
    return animationStyle({ useAnimation, delay, duration });
  }, [useAnimation, delay, duration]);

  return (
    <form
      className={`relative w-full ${useAnimation ? animationType : ''}`}
      onSubmit={handleSubmit}
      style={animationStyles}
    >
      <TextFieldComponent
        ref={textFieldRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className='h-[50px] w-full leading-[50px] py-0 pr-[50px] pl-6 text-sm text-[#f3f3f3] bg-[#121212] rounded-full border-none outline-none'
        id='search-input-textarea'
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

export default SearchField;

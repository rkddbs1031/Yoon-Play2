import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useRef } from 'react';

import { SearchIcon } from '@/states/icon/svgs';
import { animationStyle } from '@/utils/animation';
import { AnimationType } from '@/types/animation';
import { TextFieldType } from '@/types/textFiled';

interface SearchFieldProps {
  fieldType: TextFieldType;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  delay?: number;
  duration?: number;
  useAnimation?: boolean;
  animationType?: AnimationType;
}

const SearchField = ({
  fieldType,
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
    onSubmit && onSubmit();
  };

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);

  const animationStyles = useMemo(() => {
    return animationStyle({ useAnimation, delay, duration });
  }, [useAnimation, delay, duration]);

  const handleResizeHeight = () => {
    const fieldRefCurrent = textFieldRef.current;
    if (!fieldRefCurrent) return;

    fieldRefCurrent.style.height = 'auto';
    fieldRefCurrent.style.height = fieldRefCurrent.scrollHeight + 'px';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (fieldType === TextFieldType.Textarea) handleResizeHeight();
    onChange && onChange(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      className={`flex items-center gap-2 max-w-[720px] w-full bg-[#ffffff33] rounded-[24px] overflow-hidden ${useAnimation ? animationType : ''} py-3 px-[16px] shadow-[0 4px 20px rgba(0, 0, 0, 0.08)] backdrop-blur-xl shadow-lg`}
      onSubmit={handleSubmit}
      style={animationStyles}
    >
      <TextFieldComponent
        ref={textFieldRef}
        value={value}
        onChange={handleChange}
        onKeyDown={fieldType === TextFieldType.Textarea ? handleKeyDown : undefined}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full text-sm text-medium border-none outline-none ${fieldType === TextFieldType.Textarea && 'resize-none'} border`}
        id='search-input-textarea'
        rows={1}
      />
      <button type='submit' className='text-white cursor-pointer' aria-label='검색'>
        <span className='sr-only'>검색</span>
        <SearchIcon size={16} stroke='#666666' />
      </button>
    </form>
  );
};

export default SearchField;

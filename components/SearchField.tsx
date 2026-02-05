import { CSSProperties, ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef } from 'react';

import { TextFieldType } from '@/constants/textFiled';
import { SearchIcon } from '@/states/icon/svgs';

interface SearchFieldProps {
  fieldType: TextFieldType;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

const SearchField = ({
  fieldType,
  value,
  placeholder = '검색어를 입력해 주세요.',
  disabled = false,
  onChange,
  onSubmit,
  color = '#52527a',
  className,
  style,
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
      className={`flex items-center gap-2 w-full bg-white/30 rounded-[24px] overflow-hidden py-3 px-4 shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl shadow-lg mx-auto ${className}`}
      onSubmit={handleSubmit}
      style={style || undefined}
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
        <SearchIcon size={16} stroke={color} />
      </button>
    </form>
  );
};

export default SearchField;

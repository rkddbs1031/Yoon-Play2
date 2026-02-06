export interface InputError {
  message: string;
}

interface FieldWrapperProps {
  id: string;
  label: string;
  required?: boolean;
  error?: InputError | null;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FieldWrapper({
  id,
  label,
  required,
  error,
  children,
  className = '',
  labelClassName,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} className={labelClassName} />
      <div className='flex flex-col gap-[2px]'>
        {children}
        {error && <span className='text-xs text-red-500'>{error.message}</span>}
      </div>
    </div>
  );
}

interface LabelProps {
  id: string;
  label: string;
  required?: boolean;
  className?: string;
}

export function Label({ id, label, required = false, className = '' }: LabelProps) {
  return (
    <label htmlFor={id} className={`block text-sm font-medium ${className}`}>
      {label} {required && <span className='text-red-500'>*</span>}
    </label>
  );
}

interface BaseInputProps<T> {
  id: string;
  value: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  maxLength?: number;
  isDisabled?: boolean;
  className?: string;
}

interface BaseInputInternalProps<T> extends BaseInputProps<T> {
  type: 'text' | 'number';
}

export function BaseInput<T extends string | number>({
  type,
  value,
  onChange,
  isDisabled = false,
  className,
  ...rest
}: BaseInputInternalProps<T>) {
  return (
    <input
      type={type}
      value={value}
      disabled={isDisabled}
      onChange={e => onChange?.(type === 'number' ? (Number(e.target.value) as T) : (e.target.value as T))}
      className={`w-full py-2 rounded-lg focus:outline-none ${className}`}
      //  px-3
      {...rest}
    />
  );
}

interface TextInputProps extends BaseInputProps<string> {}

export function TextInput(props: TextInputProps) {
  return <BaseInput type='text' {...props} />;
}

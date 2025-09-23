interface ButtonProps {
  label: string;
  onClick: () => void;
}

const KeywordButton = ({ onClick, label, ...props }: ButtonProps) => {
  return (
    <button
      type='button'
      className='w-full py-4 sm:py-3 px-2 text-[14px] rounded-[32px] backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer transition-bg duration-400 bg-white/20 hover:bg-white/70'
      {...props}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const Card = {
  Keyword: KeywordButton,
};

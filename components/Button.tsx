interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button = ({ onClick, label, ...props }: ButtonProps) => {
  return (
    <button
      type='button'
      className={`w-full py-3 sm:py-3 px-2 text-[14px] rounded-[32px]  shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-400 bg-white/30 hover:bg-white/70 hover:font-[500]`}
      {...props}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
export default Button;

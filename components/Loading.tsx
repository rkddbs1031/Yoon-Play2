interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
  if (!isLoading) return null;

  return (
    <div
      className={`loading-section z-[200] fixed w-full h-full top-0 left-0 transition-all duration-500 ease-in-out ${
        isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className='w-full h-[500px] flex justify-center items-center relative'>
        <div className='relative w-[140px]'>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className='absolute w-[100px] h-[100px] rounded-full bg-gradient-to-tr from-blue-300/50 via-purple-300/40 to-blue-200/40 blur-sm animate-bounce'
              style={{
                left: `${12 + i * 40}px`,
                transform: `translateX(-50%)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

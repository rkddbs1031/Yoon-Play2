const LoadingSpinner = () => (
  <div className='w-full h-[500px] flex justify-center items-center relative'>
    <div className='relative w-[140px]'>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className='absolute w-[100px] h-[100px] rounded-full bg-gradient-to-tr from-blue-300/50 via-purple-300/40 to-blue-200/40 blur-sm animate-bounce'
          style={{
            left: `${12 + i * 10}px`,
            transform: `translateX(-50%)`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

export default LoadingSpinner;

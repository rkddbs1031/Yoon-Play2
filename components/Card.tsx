import { ReactNode } from 'react';

export const Card = ({ children, style }: { children: ReactNode; style?: string }) => {
  return (
    <div
      className={`flex flex-col gap-4 bg-[#ffffff33] px-5 pt-5 pb-6 rounded-[24px] shadow-lg shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl ${style}`}
    >
      {children}
    </div>
  );
};

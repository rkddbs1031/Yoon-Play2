import { FC, SVGProps, useMemo } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const SearchIcon: FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <circle cx='11' cy='11' r='8'></circle>
    <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
  </svg>
);

export const PlayIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M16.055 11.2635C16.8816 10.6239 16.8816 9.37607 16.055 8.7365C13.5571 6.80367 10.7677 5.28021 7.79146 4.22314L7.24773 4.03003C6.20751 3.66058 5.10875 4.36438 4.96792 5.43817C4.57445 8.43835 4.57445 11.5617 4.96792 14.5618C5.10874 15.6356 6.2075 16.3394 7.24773 15.97L7.79146 15.7769C10.7677 14.7198 13.5571 13.1963 16.055 11.2635Z'
        fill={color}
      />
    </svg>
  );
};

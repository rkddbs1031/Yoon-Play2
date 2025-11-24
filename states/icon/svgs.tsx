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

export const PrevIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M1.2884 10.879C0.713396 10.434 0.713396 9.56594 1.2884 9.12102C3.07017 7.74236 5.05976 6.65569 7.1827 5.9017L7.57108 5.76376C8.29578 5.50638 9.06186 5.9967 9.16005 6.7454C9.27482 7.62057 9.34267 8.51044 9.36359 9.40299C9.43033 9.29827 9.51638 9.20254 9.62174 9.12102C11.4035 7.74236 13.3931 6.65569 15.516 5.9017L15.9044 5.76376C16.6291 5.50638 17.3952 5.9967 17.4934 6.7454C17.7741 8.88582 17.7741 11.1142 17.4934 13.2546C17.3952 14.0033 16.6291 14.4936 15.9044 14.2362L15.516 14.0983C13.3931 13.3443 11.4035 12.2576 9.62174 10.879C9.51638 10.7974 9.43033 10.7017 9.36359 10.597C9.34267 11.4895 9.27482 12.3794 9.16005 13.2546C9.06186 14.0033 8.29578 14.4936 7.57108 14.2362L7.1827 14.0983C5.05976 13.3443 3.07017 12.2576 1.2884 10.879Z'
        fill={color}
      ></path>
    </svg>
  );
};

export const NextIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M10.6363 9.40299C10.5696 9.29826 10.4836 9.20254 10.3782 9.12102C8.59643 7.74236 6.60684 6.65569 4.4839 5.9017L4.09552 5.76376C3.37082 5.50638 2.60474 5.9967 2.50655 6.7454C2.22584 8.88582 2.22584 11.1142 2.50655 13.2546C2.60474 14.0033 3.37082 14.4936 4.09552 14.2362L4.4839 14.0983C6.60684 13.3443 8.59643 12.2576 10.3782 10.879C10.4836 10.7974 10.5696 10.7017 10.6363 10.597C10.6573 11.4895 10.7251 12.3794 10.8399 13.2546C10.9381 14.0033 11.7042 14.4936 12.4289 14.2362L12.8172 14.0983C14.9402 13.3443 16.9298 12.2576 18.7115 10.879C19.2865 10.434 19.2865 9.56594 18.7115 9.12102C16.9298 7.74236 14.9402 6.65569 12.8172 5.9017L12.4289 5.76376C11.7042 5.50638 10.9381 5.9967 10.8399 6.7454C10.7251 7.62057 10.6573 8.51044 10.6363 9.40299Z'
        fill={color}
      ></path>
    </svg>
  );
};

export const PauseIcon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M17.2757 5.46995C17.7109 5.63029 18 6.04492 18 6.50872L18 17.4912C18 17.955 17.7109 18.3696 17.2757 18.53C16.4523 18.8333 15.5477 18.8333 14.7243 18.53C14.2891 18.3696 14 17.955 14 17.4912L14 6.50872C14 6.04492 14.2891 5.63029 14.7243 5.46995C15.5477 5.16659 16.4523 5.16659 17.2757 5.46995Z'
        fill={color}
      ></path>
      <path
        d='M9.27568 5.46995C9.71088 5.63029 10 6.04492 10 6.50872L10 17.4912C10 17.955 9.71088 18.3696 9.27568 18.53C8.45228 18.8333 7.54772 18.8333 6.72432 18.53C6.28912 18.3696 6 17.955 6 17.4912L6 6.50872C6 6.04492 6.28912 5.63029 6.72432 5.46995C7.54772 5.16659 8.45228 5.16659 9.27568 5.46995Z'
        fill={color}
      ></path>
    </svg>
  );
};

export const VolumeIcon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill={color} xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11 5L6 9H2V15H6L11 19V5V5Z'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19.7772 4.22299C19.3867 3.83241 18.7536 3.83231 18.363 4.22278C17.9724 4.61324 17.9723 5.24641 18.3628 5.63699L19.7772 4.22299ZM18.3628 18.363C17.9723 18.7536 17.9724 19.3867 18.363 19.7772C18.7536 20.1677 19.3867 20.1676 19.7772 19.777L18.3628 18.363ZM16.2472 7.75299C15.8567 7.36241 15.2236 7.36231 14.833 7.75278C14.4424 8.14324 14.4423 8.77641 14.8328 9.16699L16.2472 7.75299ZM14.8328 14.823C14.4423 15.2136 14.4424 15.8467 14.833 16.2372C15.2236 16.6277 15.8567 16.6276 16.2472 16.237L14.8328 14.823ZM18.3628 5.63699C21.8762 9.15149 21.8762 14.8485 18.3628 18.363L19.7772 19.777C24.0714 15.4815 24.0714 8.51849 19.7772 4.22299L18.3628 5.63699ZM14.8328 9.16699C16.3943 10.729 16.3943 13.261 14.8328 14.823L16.2472 16.237C18.5895 13.894 18.5895 10.096 16.2472 7.75299L14.8328 9.16699Z'
        fill={color}
      />
    </svg>
  );
};

export const MutedVolumeIcon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10 5L5 9H1V15H5L10 19V5V5Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M22 9L16 15' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 9L22 15' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
};

export const DownIcon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M6 9L12 15L18 9' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
};

export const MoreVerticalIcon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 22C13.1046 22 14 21.1046 14 20C14 18.8954 13.1046 18 12 18C10.8954 18 10 18.8954 10 20C10 21.1046 10.8954 22 12 22Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export const YoonLogoIcon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12 3.75C8.43559 3.75 5.75 6.2048 5.75 9V10.5123C5.83223 10.5042 5.91563 10.5 6 10.5H8C8.82843 10.5 9.5 11.1716 9.5 12V17C9.5 17.8284 8.82843 18.5 8 18.5H6C4.61929 18.5 3.5 17.3807 3.5 16V13C3.5 12.3007 3.78716 11.6684 4.25 11.2146V9C4.25 5.16778 7.83242 2.25 12 2.25C16.1676 2.25 19.75 5.16778 19.75 9V11.2146C20.2128 11.6684 20.5 12.3007 20.5 13V16C20.5 17.3807 19.3807 18.5 18 18.5H16C15.1716 18.5 14.5 17.8284 14.5 17V12C14.5 11.1716 15.1716 10.5 16 10.5H18C18.0844 10.5 18.1678 10.5042 18.25 10.5123V9C18.25 6.2048 15.5644 3.75 12 3.75Z'
        fill={color}
      ></path>
    </svg>
  );
};

export const ExploreIcon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.3851 15.4458C11.7348 17.5685 7.85538 17.4014 5.3986 14.9446C2.76256 12.3086 2.76256 8.0347 5.3986 5.39866C8.03464 2.76262 12.3085 2.76262 14.9445 5.39866C17.4013 7.85544 17.5684 11.7349 15.4457 14.3851L20.6014 19.5408C20.8943 19.8337 20.8943 20.3085 20.6014 20.6014C20.3085 20.8943 19.8336 20.8943 19.5407 20.6014L14.3851 15.4458ZM6.45926 13.8839C4.40901 11.8337 4.40901 8.50957 6.45926 6.45932C8.50951 4.40907 11.8336 4.40907 13.8839 6.45932C15.9326 8.50807 15.9341 11.8288 13.8884 13.8794C13.8869 13.8809 13.8854 13.8824 13.8839 13.8839C13.8824 13.8854 13.8809 13.8869 13.8794 13.8884C11.8288 15.9342 8.50801 15.9327 6.45926 13.8839Z'
        fill={color}
      ></path>
    </svg>
  );
};

export const Libraryicon: FC<IconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

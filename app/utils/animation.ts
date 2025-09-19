interface AnimationClassProps {
  useAnimation?: boolean;
  animationName?: string;
  delay?: number;
  duration?: number;
}

export const animationStyle = ({ delay, duration }: AnimationClassProps): React.CSSProperties =>
  ({
    ...(delay !== undefined ? { '--animation-delay-var': `${delay}s` } : {}),
    ...(duration !== undefined ? { '--animation-duration-var': `${duration}s` } : {}),
  }) as React.CSSProperties;

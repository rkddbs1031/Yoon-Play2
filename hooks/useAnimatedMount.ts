import { useEffect, useState } from 'react';

interface Transform {
  open_transform: string;
  closed_transform: string;
  duration?: number;
}

export const useAnimatedMount = (isOpen: boolean, { open_transform, closed_transform, duration = 300 }: Transform) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animation, setAnimation] = useState(isOpen ? open_transform : closed_transform);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setAnimation(open_transform), 10);
    } else {
      setAnimation(closed_transform);
      const timer = setTimeout(() => setShouldRender(false), duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, open_transform, closed_transform, duration]);

  return { shouldRender, animation };
};

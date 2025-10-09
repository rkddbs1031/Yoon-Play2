import { useEffect, useState } from 'react';

export const TRANSITION_DURATION = 400;

export const usePlayerBackground = (imageUrl: string | undefined, transitionMs = TRANSITION_DURATION) => {
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!imageUrl || imageUrl === displayImage) return;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setDisplayImage(imageUrl);
        setIsTransitioning(false);
      }, transitionMs);
    };

    img.onerror = () => {
      setDisplayImage(imageUrl);
      setIsTransitioning(false);
    };
  }, [imageUrl]);

  return { displayImage, isTransitioning };
};

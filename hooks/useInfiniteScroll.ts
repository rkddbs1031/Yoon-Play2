import { useEffect, useRef } from 'react';

interface useInfiniteScrollProps {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  options?: IntersectionObserverInit;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  options = { rootMargin: '100px', threshold: 1.0 },
}: useInfiniteScrollProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentTarget = targetRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(entries => {
      // isIntersecting이 true고, 다음 페이지가 있고, 페칭 중이 아닐 때만 실행
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, options);

    observer.observe(currentTarget);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, options]);

  return { targetRef };
};

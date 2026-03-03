'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { PlaylistItem } from '@/types/playlist';
import { QueueContext } from '@/types/queue';
import { usePlayerCore } from '@/hooks/usePlayer';

import { PlayerQueueItem } from '@/components/PlayerQueueItem';

interface TrackListProps {
  tracks: PlaylistItem[];
  context: QueueContext;
}

export default function TrackList({ tracks, context }: TrackListProps) {
  const { currentVideoId, setPlayerListFromContext } = usePlayerCore();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 2,
  });

  if (tracks.length === 0) {
    return (
      <div className='playlist-track-list-container py-10 md:py-20'>
        <p className='text-center text-sm text-[#52527a] font-[500]'>저장된 트랙이 없습니다.</p>
        <p className='text-center text-xs text-[#5f5f7c] mt-2'>좋아하는 곡을 재생목록에 추가해 보세요!</p>
      </div>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  const handlePlay = (clickedItem: PlaylistItem) => setPlayerListFromContext(tracks, clickedItem);

  return (
    <div
      ref={parentRef}
      className='playlist-track-list-container overflow-auto mt-8'
      style={{ height: 'calc(100vh - 380px - 80px)' }}
    >
      <ul className='playlist-track-list relative w-full' style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {virtualItems.map(virtualRow => {
          const { index } = virtualRow;
          const track = tracks[index];

          return (
            <li
              key={track.videoId}
              className={`${index + 1} absolute left-0 top-0 w-full border-t border-[#66666610] last:border-b`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <PlayerQueueItem
                item={track}
                isActive={track.videoId === currentVideoId}
                onClick={() => handlePlay(track)}
                context={context}
                showLikeButton={false}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

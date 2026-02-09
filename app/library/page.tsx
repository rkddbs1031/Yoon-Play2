'use client';

import { useRouter } from 'next/navigation';

import { AnimationType } from '@/constants/animation';
import { LibraryListType, LibraryType } from '@/constants/library';
import { usePlaylist } from '@/hooks/usePlaylist';
import { animationStyle } from '@/utils/animation';

import { LibraryListItem } from '@/components/Library/LibraryListItem';
import { LibrarySkeleton } from '@/components/Skeleton/LibrarySkelton';

export default function Library() {
  const { isLoading, likedPlaylist, userPlaylists } = usePlaylist();
  const router = useRouter();

  const handleNavigate = ({ type, id }: { type: LibraryType; id?: string }) => {
    if (type === LibraryType.Like) {
      router.push(`/library/playlist?list=${LibraryListType.Like}`);
      return;
    }

    if (type === LibraryType.Playlist && id) {
      router.push(`/library/playlist?list=${LibraryListType.Playlist}-${id}`);
      return;
    }
  };

  return (
    <section className='library-wrapper max-w-[960px] mx-auto pb-20'>
      <h1
        className={`${AnimationType.FadeInUp} text-lg sm:text-xl font-[600] text-[#52527a] mb-6 sm:mb-8 whitespace-pre-wrap`}
        style={animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 })}
      >
        보관함
      </h1>
      <div className='library-list'>
        <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8'>
          {isLoading ? (
            <>
              <LibrarySkeleton />
              <LibrarySkeleton />
            </>
          ) : (
            <>
              {likedPlaylist && (
                <LibraryListItem
                  playlistId={likedPlaylist.id}
                  title='좋아요한 플레이리스트'
                  count={likedPlaylist.trackCount}
                  type={LibraryType.Like}
                  onNavigate={() => handleNavigate({ type: LibraryType.Like })}
                />
              )}

              {userPlaylists &&
                userPlaylists.map(p => (
                  <LibraryListItem
                    key={p.id}
                    playlistId={p.id}
                    title={p.title}
                    count={p.trackCount}
                    type={LibraryType.Playlist}
                    onNavigate={() => handleNavigate({ type: LibraryType.Playlist, id: p.id })}
                  />
                ))}
            </>
          )}
        </ul>
      </div>
    </section>
  );
}

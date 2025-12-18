'use client';

import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';

import { AnimationType } from '@/constants/animation';
import { LibraryListType, LibraryType } from '@/constants/library';
import { likedPlaylistAtom } from '@/store/likesAtom';
import { animationStyle } from '@/utils/animation';
import { useLike } from '@/hooks/useLike';

import { LibraryListItem } from '@/components/Library/LibraryListItem';
import { LibrarySkeleton } from '@/components/Skeleton/LibrarySkelton';

export default function Library() {
  const { isLoading: isLikedLoading } = useLike();
  const likedPlaylist = useAtomValue(likedPlaylistAtom);
  const likedCount = likedPlaylist.length;
  const likedThumbnails = likedPlaylist.slice(0, 4).map(p => p.thumbnail.medium.url);

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
          {isLikedLoading ? (
            <LibrarySkeleton />
          ) : (
            likedCount > 0 && (
              <LibraryListItem
                title='좋아요한 플레이리스트'
                thumbnails={likedThumbnails}
                count={likedCount}
                type={LibraryType.Like}
                onNavigate={() => handleNavigate({ type: LibraryType.Like })}
              />
            )
          )}

          {/*  TODO : 나만의 플레이리스트 추가 */}
        </ul>
      </div>
    </section>
  );
}

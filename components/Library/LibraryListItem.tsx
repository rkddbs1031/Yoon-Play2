import { LibraryType } from '@/constants/library';
import { usePlaylistPreviewQuery } from '@/services/playlists';
import { getPlaylistThumbnails } from '@/utils/thumbnail';
import ThumbnailGrid from './ThumbnailGrid';

interface LibraryListItemProps {
  playlistId: string;
  title: string;
  count: number;
  type: LibraryType;
  onNavigate: () => void;
}

export const LibraryListItem = ({ playlistId, title, count, type, onNavigate }: LibraryListItemProps) => {
  const { data: tracks = [] } = usePlaylistPreviewQuery({ playlistId });
  const thumbnails = getPlaylistThumbnails(tracks);

  return (
    <li className='library-item '>
      <div onClick={onNavigate} className='thumbnail-grid-container cursor-pointer'>
        <ThumbnailGrid thumbnails={thumbnails} />
      </div>

      <div className='info flex flex-col gap-[2px] mt-[10px]'>
        <button
          type='button'
          onClick={onNavigate}
          className='text-sm md:text-base font-[500] text-left line-clamp-2 bg-transparent border-none hover:underline active:underline cursor-pointer'
        >
          {title}
        </button>
        <div className='subtitle flex items-center text-xs sm:text-[12px] text-[#5f5f7c] line-clamp-1'>
          {type === LibraryType.Playlist && (
            <span className="relative mr-3 after:absolute after:content-['·'] after:mx-1">재생목록</span>
          )}
          <span>{count.toLocaleString()}곡</span>
        </div>
      </div>
    </li>
  );
};

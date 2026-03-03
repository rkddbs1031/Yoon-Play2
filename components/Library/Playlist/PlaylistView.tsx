'use client';

import { ReactNode } from 'react';

import { LibraryType } from '@/constants/library';
import { EditIcon } from '@/states/icon/svgs';

import ThumbnailGrid from '../ThumbnailGrid';
import TrackList from './TrackList';

interface PlaylistViewProps {
  children: ReactNode;
}

function PlaylistView({ children }: PlaylistViewProps) {
  return (
    <section id='playlist-view' className='max-w-[960px] mx-auto md:mt-10'>
      {children}
    </section>
  );
}

interface HeaderProps {
  type: LibraryType;
  title: string;
  description?: string;
  thumbnails: string[];
  count: number;
  date?: string;
  onEdit?: () => void;
}

function Header({ type, title, description, thumbnails, count, date, onEdit }: HeaderProps) {
  return (
    <div className='playlist-view-header mb-[50px] flex flex-col items-center'>
      <div className='thumbnail-container w-[180px] mb-6'>
        <ThumbnailGrid thumbnails={thumbnails} />
      </div>

      <div className='playlist-info flex flex-col justify-center items-center gap-2'>
        <div className='relative inline-flex items-center'>
          <h1 className='text-lg sm:text-xl font-[600] text-[#52527a] text-center whitespace-pre-wrap leading-tight'>
            {title}
          </h1>

          {onEdit && (
            <button
              type='button'
              onClick={onEdit}
              className='absolute left-[calc(100%+4px)] top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-[#52527a]/10 text-[#52527a] transition-colors cursor-pointer'
              aria-label='정보 수정'
            >
              <EditIcon size={15} />
            </button>
          )}
        </div>

        <div className='subtitle flex justify-center items-center text-xs sm:text-[12px] text-[#5f5f7c] line-clamp-1'>
          {type === LibraryType.Playlist && (
            <span className="relative mr-3 after:absolute after:content-['·'] after:mx-1">재생목록</span>
          )}
          <span>{count.toLocaleString()}곡</span>
          {type === LibraryType.Playlist && date && (
            <span className="relative ml-3 after:absolute after:-left-3 after:content-['·'] after:mx-1">{date}</span>
          )}
        </div>

        {!!description?.length && (
          <p className='description mt-1 text-xs sm:text-[12px] text-[#5f5f7c] leading-tight'>{description}</p>
        )}
      </div>
    </div>
  );
}

PlaylistView.Header = Header;
PlaylistView.TrackList = TrackList;

export default PlaylistView;

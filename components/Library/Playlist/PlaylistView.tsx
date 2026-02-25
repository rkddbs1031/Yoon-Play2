'use client';

import { ReactNode } from 'react';

import { LibraryType } from '@/constants/library';

import ThumbnailGrid from '../ThumbnailGrid';
import TrackList from './TrackList';

interface PlaylistViewProps {
  children: ReactNode;
}

function PlaylistView({ children }: PlaylistViewProps) {
  return (
    <section id='playlist-view' className='max-w-[960px] mx-auto'>
      {children}
    </section>
  );
}

interface HeaderProps {
  title: string;
  thumbnails: string[];
  count: number;
  type: LibraryType;
  date?: string;
}

function Header({ title, thumbnails, count, type, date }: HeaderProps) {
  return (
    <div className='playlist-view-header mb-[50px] flex flex-col items-center'>
      <div className='thumbnail-container w-[180px] mb-6'>
        <ThumbnailGrid thumbnails={thumbnails} />
      </div>

      <h1 className='text-lg sm:text-xl font-[600] text-[#52527a] text-center whitespace-pre-wrap mb-2'>{title}</h1>

      <div className='subtitle flex justify-center items-center text-xs sm:text-[12px] text-[#5f5f7c] line-clamp-1'>
        {type === LibraryType.Playlist && (
          <span className="relative mr-3 after:absolute after:content-['·'] after:mx-1">재생목록</span>
        )}
        <span>{count.toLocaleString()}곡</span>
        {type === LibraryType.Playlist && date && (
          <span className="relative ml-3 after:absolute after:-left-3 after:content-['·'] after:mx-1">{date}</span>
        )}
      </div>
    </div>
  );
}

PlaylistView.Header = Header;
PlaylistView.TrackList = TrackList;

export default PlaylistView;

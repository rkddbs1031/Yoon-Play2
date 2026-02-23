'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { fromPlaylistParam } from '@/utils/playlist';
import PlaylistView from './_components/PlaylistView';

export default function LibraryPlaylist() {
  const searchParams = useSearchParams();
  const listParam = searchParams.get('list');

  if (!listParam) {
    return (
      <section className='w-full h-screen flex flex-col items-center justify-center gap-4 -mt-15'>
        <h1 className='text-[18px] font-bold'>플레이리스트를 찾을 수 없습니다.</h1>
        <Link
          className='w-[140px] py-2 text-center text-[14px] rounded-[32px] backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer transition-bg duration-400 bg-white/20 hover:bg-white/70'
          href='/'
        >
          홈으로 돌아가기
        </Link>
      </section>
    );
  }

  const playlistId = fromPlaylistParam(listParam);

  if (!playlistId) return null;

  return <PlaylistView playlistId={playlistId} />;
}

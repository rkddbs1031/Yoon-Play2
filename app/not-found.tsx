import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Foliohub - NotFound',
  robots: 'noindex',
};

export default function Custom404() {
  return (
    <section className='w-full h-screen flex flex-col items-center justify-center gap-4 -mt-15'>
      <h1 className='text-[18px] font-bold'>페이지를 찾을 수 없습니다.</h1>
      <Link
        className='w-[140px] py-2 text-center text-[14px] rounded-[32px] backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer transition-bg duration-400 bg-white/20 hover:bg-white/70'
        href='/'
      >
        홈으로 돌아가기
      </Link>
    </section>
  );
}

function GoToButton() {
  return;
}

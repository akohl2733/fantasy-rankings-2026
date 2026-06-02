'use client';

export default function Home() {
  return (
    <div>

      <div className='flex justify-center text-black py-40 bg-sky-200 items-center content-center'>
        <div className='text-2xl font-semibold'>
          Zeebe Fantasy - All Analytics for your fantasy football draft 2026
        </div>
      </div>
      <div className='flex flex-col justify-between items-center gap-10 text-black py-40'>
        <div className='text-2xl font-semibold'>
          New Metrics, top 250 rankings, personalized write-ups for each player.
        </div>
        <div className='text-2xl font-semibold'>
          Weekly reports on each player and analytics you can't find anywhere else.
        </div>
      </div>
    </div>
  );
}

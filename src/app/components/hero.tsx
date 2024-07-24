import Link from 'next/link'

export default function hero() {
  return (
    <div
      className='hero min-h-screen'
      style={{
        backgroundImage: "url('/assets/herobg.jpg')",
      }}
    >
      <div className='hero-overlay bg-opacity-70 bg-gradient-to-t w-screen from-black to-90% opacity-100'></div>
      <div className='hero-content text-foreground text-center'>
        <div className='max-w-lg'>
          <h1 className='mb-5 text-5xl font-bold'>
            Best in Slot from{' '}
            <span className='text-accent underline'>actual</span> data 📈
          </h1>
          <p className='mb-5 leading-6 font-semibold'>
            Harnessing data from top-level Mythic+ dungeons, we curate the
            optimal gear choices for every specialization, ensuring you stay
            ahead with the best-in-slot items tailored to your class.
          </p>
          <Link href='/check'>
            {' '}
            <button className='float-right btn btn-accent rounded-md '>
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

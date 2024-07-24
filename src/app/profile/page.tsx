import { redirect } from 'next/navigation'

export default async function page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-0 bg-base'>
      <div className=' bg-base-200 min-h-screen w-[400px] lg:w-[1100px] rounded-lg items-center justify-center my-5'>
        <div className='items-center justify-center max-w-sm pt-10px-3 rounded-lg border-base-300 m-2'>
          Profile Page
        </div>
      </div>
    </div>
  )
}

import React from 'react'

interface CenteredImageProps {
  base64Image: string
}

const CenteredImage: React.FC<CenteredImageProps> = ({ base64Image }) => {
  return (
    <div className='relative w-[300px] h-[400px] overflow-hidden rounded-lg border border-stone-700'>
      <div
        className='absolute inset-0 bg-no-repeat bg-cover opacity-70'
        style={{
          backgroundImage: `url(${base64Image})`,
          backgroundPosition: 'center top',
          transform: 'scale(2) translateY(-10%)',
        }}
      />
    </div>
  )
}

export default CenteredImage

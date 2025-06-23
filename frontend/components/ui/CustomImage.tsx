'use client';

import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';

const CustomImage = (props: ImageProps) => {
  const { src, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  const fallbackSrc = '/assets/images/image2.jpg';

  const handleError = () => {
    // If the error occurs with the fallback image itself, prevent an infinite loop.
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <NextImage
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default CustomImage; 
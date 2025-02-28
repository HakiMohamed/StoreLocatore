import React from 'react';
import Slider from 'react-slick';
import { getRandomStoreImage } from '../utils/imageUtils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    pauseOnFocus: true,
    arrows: false,
    fade: true,
    cssEase: 'ease-in-out',
    pauseOnDotsHover: true,
  };

  return (
    <div className="relative w-full h-[640px] overflow-hidden">
      <Slider {...settings}>
        <div className="relative w-full h-[640px]">
          <img
            src={getRandomStoreImage()}
            alt="Feature 1"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold p-4">
            Discover Local Stores
          </div>
        </div>
        <div className="relative w-full h-[640px]">
          <img
            src={getRandomStoreImage()}
            alt="Feature 2"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold p-4">
            Build Connections with Local Businesses and Support Your Community by Shopping Small
          </div>
        </div>
        <div className="relative w-full h-[640px]">
          <img
            src={getRandomStoreImage()}
            alt="Feature 3"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold p-4">
            Navigate Effortlessly Through Our User-Friendly Platform Designed for Your Convenience
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
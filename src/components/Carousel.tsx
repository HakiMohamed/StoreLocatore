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
    pauseOnHover: true,
    arrows: false,
    fade: true,
    cssEase: 'ease-in-out',
  };

  return (
    <div className="relative w-full h-[640px] overflow-hidden rounded-lg shadow-lg">
      <Slider {...settings}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="relative w-full h-[640px]">
            <img
              src={getRandomStoreImage()}
              alt={`Feature ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold p-4">
              {index === 0 ? "Discover Local Stores" : index === 1 ? "Support Your Community" : "User-Friendly Platform"}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
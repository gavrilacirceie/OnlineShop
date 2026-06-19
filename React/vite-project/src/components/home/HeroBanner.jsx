// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { bannerLists } from '../../utils';
import { Link } from 'react-router-dom';

const gradients = [
    "from-amber-500 to-yellow-400",
    "from-rose-600 to-pink-500",
    "from-emerald-600 to-teal-400",
];

const HeroBanner = () => {
    return (
        <div className='w-full'>
            <Swiper
                grabCursor={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                navigation
                modules={[Pagination, EffectFade, Navigation, Autoplay]}
                pagination={{ clickable: true }}
                effect="fade"
                slidesPerView={1}
                className="overflow-hidden"
            >
                {bannerLists.map((item, i) => (
                    <SwiperSlide key={item.id}>
                        <div className={`bg-gradient-to-br ${gradients[i]} sm:h-[520px] h-96 relative overflow-hidden`}>
                            {/* Decorative circles */}
                            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
                            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full" />

                            <div className='flex items-center justify-center h-full relative z-10'>
                                <div className='hidden lg:flex justify-center w-1/2 p-10'>
                                    <div className='text-center space-y-4'>
                                        <span className='inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase'>
                                            {item.title}
                                        </span>
                                        <h1 className='text-5xl xl:text-6xl text-white font-extrabold leading-tight drop-shadow-lg'>
                                            {item.subtitle}
                                        </h1>
                                        <p className='text-white/90 text-lg max-w-md mx-auto'>
                                            {item.description}
                                        </p>
                                        <Link
                                            className='mt-4 inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'
                                            to="/products">
                                            Shop Now
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col items-center justify-center lg:w-1/2 p-6'>
                                    <img
                                        src={item?.image}
                                        alt={item?.title}
                                        className='max-h-64 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500'
                                    />
                                    {/* Mobile-only CTA */}
                                    <Link
                                        className='lg:hidden mt-6 inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-2.5 px-6 rounded-full shadow-lg'
                                        to="/products">
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}


export default HeroBanner;
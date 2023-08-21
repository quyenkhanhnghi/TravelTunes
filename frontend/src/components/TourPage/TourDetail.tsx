import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BoxTourDetail } from './BoxTourDetail';
import { MapBox } from './MapBox';
import { PictureBox } from './PictureBox';
import { ReviewCard } from './ReviewCard';
import { TourGuide } from './TourGuide';
import { useAxiosPrivate } from '../../services/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { ContextType } from '../../context/Provider/AuthProvider';
import { CheckOut } from './CheckOut';

export type ReviewCardType = {
  user: {
    name: string;
    photo: string;
  };
  review: string;
  rating: number;
};
export type TourGuideType = {
  name: string;
  photo: string;
  role: string;
};
export type LocationType = {
  day: number;
  description: string;
  coordinates: [number, number];
};
export type dataType = {
  imageCover: string;
  images: string[];
  name: string;
  slug: string;
  description: string;
  duration: number;
  difficulty: string;
  summary: string;
  locations: LocationType[];
  startLocation: LocationType;
  startDates: string;
  maxGroupSize: number;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  guides: TourGuideType[];
  reviews: ReviewCardType[];
};

// Main FC for Tour Detail Page
interface TourDetailProps {}

export const TourDetail: React.FC<TourDetailProps> = () => {
  const { tourSlug } = useParams();
  const [data, setTour] = useState<dataType>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth() as ContextType;
  const user = auth.user;
  console.log(user);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getTour = async () => {
      try {
        const response = await axiosPrivate.get(`/tours/${tourSlug}`);
        isMounted && setTour(response.data.data);
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };
    getTour();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  // const { data } = useLoaderData() as { data: dataType };
  const dateStart = data.startDates && new Date(data.startDates[0]);
  const formattedDate = dateStart?.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  const paragraphs = data.description.split('\n');
  // HelmetProvideer to add the Mapbox GL JS link to the head section
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{data.name} Tour </title>
          <link
            href='https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css'
            rel='stylesheet'
          />
          {/* <script src='../mapBox.ts' defer={true}></script> */}
        </Helmet>

        <section className='section-header'>
          <div className='heading-hero'>
            <div className='header__hero-overlay'></div>
            <img
              className='header__hero-img'
              src={`/img/tours/${data.imageCover}`}
              alt={data.name}
            ></img>
          </div>

          <div className='heading-box'>
            <h1 className='heading-primary'>
              <span>
                {data.name} tour <br />
              </span>
            </h1>
            <div className='heading-box__group'>
              <div className='heading-box__detail'>
                <svg className='heading-box__icon'>
                  <use xlinkHref='img/icons.svg#icon-clock'></use>
                </svg>
                <span className='heading-box__text'>{data.duration} days</span>
              </div>
              <div className='heading-box__detail'>
                <svg className='heading-box__icon'>
                  <use xlinkHref='img/icons.svg#icon-map-pin'></use>
                </svg>
                <span className='heading-box__text'>
                  {data.startLocation.description}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className='section-description'>
          <div className='overview-box'>
            <div>
              <div className='overview-box__group'>
                <h2 className='heading-secondary ma-bt-lg'>Quick facts</h2>

                <BoxTourDetail
                  label='Next date'
                  text={formattedDate}
                  icon='calendar'
                />
                <BoxTourDetail
                  label='Difficulty'
                  text={data.difficulty}
                  icon='trending-up'
                />
                <BoxTourDetail
                  label='Participants'
                  text={`${data.maxGroupSize} people`}
                  icon='user'
                />
                <BoxTourDetail
                  label='Rating'
                  text={`${data.ratingsAverage} / 5`}
                  icon='star'
                />
              </div>

              <div className='overview-box__group'>
                <h2 className='heading-secondary ma-bt-lg'>Your tour guides</h2>
                <>
                  {data.guides.map((guide) => (
                    <TourGuide key={guide.name} guide={guide} />
                  ))}
                </>
              </div>
            </div>
          </div>

          <div className='description-box'>
            <h2 className='heading-secondary ma-bt-lg'>
              About {data.name} tour
            </h2>
            {paragraphs.map((paragraph, i) => (
              <p key={i} className='description__text'>
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className='section-pictures'>
          {data.images.map((img, i) => (
            <PictureBox key={i} img={img} i={i} tourName={data.name} />
          ))}
        </section>

        <section className='section-map'>
          <MapBox data={data} />
        </section>

        <section className='section-reviews'>
          <div className='reviews'>
            {data.reviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </section>

        <section className='section-cta'>
          <div className='cta'>
            <div className='cta__img cta__img--logo'>
              <img src='/img/logo-white.png' alt='Natours logo' className='' />
            </div>
            <img
              src={`/img/tours/${data.images[1]}`}
              alt='Tour picture 1'
              className='cta__img cta__img--1'
            />
            <img
              src={`/img/tours/${data.images[2]}`}
              alt='Tour picture 2'
              className='cta__img cta__img--2'
            />

            <div className='cta__content'>
              <h2 className='heading-secondary'>What are you waiting for?</h2>
              <p className='cta__text'>
                {data.duration} days. 1 adventure. Infinite memories. Make it
                yours today!
              </p>
              <CheckOut tourSlug={data.slug} />
              {/* <button className='btn btn--green span-all-rows'>
                Book tour now!
              </button> */}
            </div>
          </div>
        </section>
      </HelmetProvider>
    </>
  );
};

'use client';

import Header from "@/components/NavigationBar/Header";
import CarouselImage from "@/components/ui/Carousel_Image";
import FeatureCardSection from "@/components/Home/FeatureCardSelection";
import ProductShowcase from "@/components/Home/ProductShowcase";
import Footer from "@/components/Home/Footer";


const images = [
  {src: "/Images/med.jpg", alt: "Slide 1"},
  {src: "/api/placeholder/800/400", alt: "Slide 2"},
  {src: "/api/placeholder/800/400", alt: "Slide 3"},
  {src: "/api/placeholder/800/400", alt: "Slide 4"},
];

export default function Home() {

  return (
      <>

        <Header/>
        <CarouselImage images={images}/>
        <FeatureCardSection/>
        <ProductShowcase/>
        <Footer/>
      </>

  );
}
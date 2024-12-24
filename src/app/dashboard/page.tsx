import Navbar from "@/components/NavigationBar/NavBar";
import CarouselImage from "@/components/ui/Carousel_Image";
import FeatureCardSection from "@/components/ui/FeatureCardSelection";
import ProductShowcase from "@/components/Dashboard/ProductShowcase";
import Footer from "@/components/Dashboard/Footer";

const images = [
  {src: "/Images/med.jpg", alt: "Slide 1"},
  {src: "/api/placeholder/800/400", alt: "Slide 2"},
  {src: "/api/placeholder/800/400", alt: "Slide 3"},
  {src: "/api/placeholder/800/400", alt: "Slide 4"},
];
export default function Dashboard() {

  return (
      <>
        <Navbar/>
        <CarouselImage images={images}/>
        <FeatureCardSection/>
        <ProductShowcase/>
        <Footer/>
      </>

  );

}
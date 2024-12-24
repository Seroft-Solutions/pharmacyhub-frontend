import Navbar from "@/components/NavigationBar/NavBar";
import CarouselImage from "@/components/ui/Carousel_Image";
import FeatureCardSection from "@/components/ui/FeatureCardSelection";
const images = [
  { src: "/med.jpg", alt: "Slide 1"},
  { src: "/api/placeholder/800/400", alt: "Slide 2"},
  { src: "/api/placeholder/800/400", alt: "Slide 3"},
  { src: "/api/placeholder/800/400", alt: "Slide 4"},
];
export default function Dashboard() {

  return (
      <><Navbar />

        <CarouselImage images={images}/>
        <FeatureCardSection/>
        <h1>Welcome to dashboard</h1></>

  );

}
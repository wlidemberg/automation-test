import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProductsSection from '../components/ProductsSection'

export default function Home() {
  return (
    <div className="w-full bg-brand-dark overflow-hidden">
      {/* Hero Entrance Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Products Section */}
      <ProductsSection />
    </div>
  )
}

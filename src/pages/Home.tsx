import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProductsSection from '../components/ProductsSection'
import PortfolioSection from '../components/PortfolioSection'
import CtaSection from '../components/CtaSection'

export default function Home() {
  return (
    <div className="w-full bg-brand-dark overflow-hidden pt-20">
      {/* Hero Entrance Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Products Section */}
      <ProductsSection />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Conversion Call-to-action Section */}
      <CtaSection />
    </div>
  )
}

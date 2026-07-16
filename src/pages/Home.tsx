import Layout from '../components/Layout'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProductsSection from '../components/ProductsSection'
import PortfolioSection from '../components/PortfolioSection'
import CtaSection from '../components/CtaSection'

export default function Home() {
  return (
    <Layout>
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
    </Layout>
  )
}

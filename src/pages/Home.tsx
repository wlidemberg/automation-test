import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProductsSection from '../components/ProductsSection'
import PortfolioSection from '../components/PortfolioSection'
import CtaSection from '../components/CtaSection'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
          // Clean the hash from the browser URL to keep it friendly and clean
          window.history.replaceState(null, '', window.location.pathname)
        }, 100)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

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

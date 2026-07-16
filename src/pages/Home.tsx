import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ServicesSection from '../components/ServicesSection'

export default function Home() {
  return (
    <div className="w-full bg-brand-dark overflow-hidden">
      {/* Hero Entrance Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />
    </div>
  )
}

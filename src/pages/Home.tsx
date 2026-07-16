import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'

export default function Home() {
  return (
    <div className="w-full bg-brand-dark overflow-hidden">
      {/* Hero Entrance Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />
    </div>
  )
}

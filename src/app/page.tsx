import React from 'react'
import Footer from '@/components/footer'
import Features from '@/components/features'
import Hero from '@/components/hero'
import Navigation from '@/components/navigation'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}

export default LandingPage
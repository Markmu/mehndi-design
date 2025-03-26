import React from 'react'
import Features from '@/components/features'
import Hero from '@/components/hero'
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: process.env.HOST,
  }
}

const LandingPage = () => {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
}

export default LandingPage
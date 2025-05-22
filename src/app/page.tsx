// src/app/page.tsx
'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import JobCategories from '@/components/home/JobCategories';
import CompanyCategories from '@/components/home/CompanyCategories';
import ListJob from '@/components/home/ListJob';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CompanyCategories />
        <JobCategories />
        <ListJob />
      </main>
      <Footer />
    </div>
  );
}
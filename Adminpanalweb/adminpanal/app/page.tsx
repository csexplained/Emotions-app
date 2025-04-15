"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Categories from '@/components/Categories';
import Testimonials from '@/components/Testimonials';
import DownloadCTA from '@/components/DownloadCTA';

export default function Home() {


    return (
        <div className="min-h-screen flex flex-col bg-minty">
            <Header />
            <main className="flex-1">
                <Hero />
                <HowItWorks />
                <Categories />
                <Testimonials />
                <DownloadCTA />
            </main>
            <Footer />
        </div>
    );
}

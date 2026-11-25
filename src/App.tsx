/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { MyAppointmentsPage } from './pages/MyAppointmentsPage';
import { ContactsPage } from './pages/ContactsPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  // Il pannello admin non ha un pulsante pubblico in navigazione: si
  // raggiunge solo tramite questo link diretto (es. salvato nei preferiti).
  const [currentPage, setCurrentPage] = useState<PageView>(() =>
    window.location.hash === '#admin' ? 'admin' : 'home'
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | undefined>(undefined);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (page: PageView, extraParams?: { serviceId?: string; operatorId?: string }) => {
    if (extraParams?.serviceId) {
      setSelectedServiceId(extraParams.serviceId);
    } else if (page !== 'booking') {
      setSelectedServiceId(undefined);
    }

    if (extraParams?.operatorId) {
      setSelectedOperatorId(extraParams.operatorId);
    } else if (page !== 'booking') {
      setSelectedOperatorId(undefined);
    }
    setCurrentPage(page);

    if (page === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#222226] text-[#F2EFEA] pb-24 lg:pb-0">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}
        {currentPage === 'booking' && (
          <BookingPage 
            initialServiceId={selectedServiceId} 
            initialOperatorId={selectedOperatorId} 
            onNavigate={handleNavigate} 
          />
        )}
        {currentPage === 'services' && (
          <ServicesPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'gallery' && (
          <GalleryPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'my-appointments' && (
          <MyAppointmentsPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'contacts' && (
          <ContactsPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'admin' && (
          <>
            {/* La gestione è pensata per PC e tablet: da telefono mostra solo un avviso */}
            <div className="md:hidden px-6 py-20 text-center space-y-4">
              <h1 className="font-display uppercase font-bold text-3xl text-[#F2EFEA]">Area gestionale</h1>
              <p className="text-sm text-[#F2EFEA]/70 max-w-xs mx-auto">
                Il pannello di gestione si usa da computer o tablet. Aprilo da uno di questi dispositivi.
              </p>
              <button
                onClick={() => handleNavigate('home')}
                className="px-7 py-3 bg-[#C8102E] text-white text-[11px] font-bold uppercase tracking-[0.15em]"
              >
                Torna alla home
              </button>
            </div>
            <div className="hidden md:block">
              <AdminPage onNavigate={handleNavigate} />
            </div>
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage !== 'admin' && <WhatsAppButton />}
    </div>
  );
}

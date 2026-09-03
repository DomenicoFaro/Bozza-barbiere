/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
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
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#1A1A1A]">
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
          <AdminPage onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import MultiStepForm from '@/components/MultiStepForm';
import {
  ShieldCheckIcon,
  BanknotesIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  // Handle sticky button visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (ctaSectionRef.current) {
        const ctaRect = ctaSectionRef.current.getBoundingClientRect();
        // Hide sticky when CTA section is visible (with some offset)
        setIsSticky(ctaRect.top > window.innerHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const benefits = [
    {
      icon: BanknotesIcon,
      title: 'Crecimiento Libre de Impuestos',
      description: 'Tu dinero crece sin pagar impuestos federales sobre las ganancias.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Ingreso para tu Retiro',
      description: 'Accede a tu dinero en el retiro, también libre de impuestos.',
    },
    {
      icon: HeartIcon,
      title: 'Protección para tu Familia',
      description: 'Incluye seguro de vida que protege a quienes más amas.',
    },
  ];

  const trustPoints = [
    'Consulta 100% gratuita',
    'Especialistas bilingües',
  ];

  // Show form full page
  if (showForm) {
    return <MultiStepForm onBack={() => setShowForm(false)} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-32 sm:pb-20 sm:pt-16 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Estrategia disponible para residentes en EE.UU.
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Construye tu Retiro con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              Crecimiento Libre de Impuestos
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Descubre cómo miles de latinos están protegiendo su futuro financiero con una
            estrategia que crece sin pagar impuestos federales.
          </p>

          {/* Trust Points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {trustPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* CTA Button - Desktop only (hidden on mobile, shown in sticky) */}
          <div className="mt-10 hidden sm:block">
            <button
              onClick={() => setShowForm(true)}
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ver Si Califico
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="mt-3 text-sm text-slate-500">
              Toma menos de 30 segundos
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            La Estrategia que los Americanos Ricos Han Usado por Décadas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Ahora disponible para ti y tu familia
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all duration-200 hover:shadow-md hover:ring-slate-200"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-16 bg-slate-50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Miles de Latinos Ya Están Protegiendo Su Futuro
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="mt-1 text-sm text-slate-600">Familias atendidas</div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-emerald-600">$0</div>
              <div className="mt-1 text-sm text-slate-600">Impuestos sobre ganancias</div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">24hrs</div>
              <div className="mt-1 text-sm text-slate-600">Tiempo de respuesta</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Preguntas Frecuentes
          </h2>

          <div className="mt-10 space-y-6">
            {[
              {
                q: '¿Qué es exactamente esta estrategia?',
                a: 'Es un tipo de seguro de vida que combina protección para tu familia con una cuenta de ahorro que crece libre de impuestos federales. Puedes acceder a ese dinero en tu retiro sin pagar impuestos.',
              },
              {
                q: '¿Necesito ser ciudadano americano?',
                a: 'No. Si eres residente legal en Estados Unidos (con visa de trabajo, green card, etc.) puedes calificar para esta estrategia.',
              },
              {
                q: '¿Cuánto necesito para empezar?',
                a: 'Depende de tu situación personal. Durante la consulta gratuita, un especialista te ayudará a determinar qué monto funciona mejor para ti.',
              },
              {
                q: '¿Es realmente gratis la consulta?',
                a: 'Sí, la consulta es 100% gratuita. Un especialista bilingüe te explicará cómo funciona y si es adecuada para tu situación.',
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
                <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - This is the reference point for sticky */}
      <section ref={ctaSectionRef} className="px-4 py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ¿Listo para Proteger tu Futuro Financiero?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Solicita tu análisis gratuito y descubre cuánto podrías ahorrar en impuestos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-4 text-center text-sm text-slate-400">
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-white transition-colors">
                Política de Privacidad
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-white transition-colors">
                Términos de Uso
              </a>
            </div>
            <p className="max-w-2xl text-xs leading-relaxed">
              Este sitio web es solo para fines informativos y no constituye una oferta de seguro.
              Los productos de seguro de vida están sujetos a suscripción y aprobación.
              Los beneficios fiscales dependen de la situación individual de cada persona.
              Consulte con un profesional financiero o fiscal antes de tomar decisiones.
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA Button - Mobile Only */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-300 ${
          isSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 shadow-lg">
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30"
          >
            Ver Si Califico
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="mt-2 text-center text-xs text-slate-500">
            Toma menos de 30 segundos
          </p>
        </div>
      </div>
    </main>
  );
}

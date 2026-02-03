'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline';

interface FormData {
  zipCode: string;
  ageRange: string;
  name: string;
  phone: string;
}

interface MultiStepFormProps {
  onBack: () => void;
}

const ageRanges = [
  { value: '35-40', label: '35 - 40 años' },
  { value: '41-45', label: '41 - 45 años' },
  { value: '46-50', label: '46 - 50 años' },
  { value: '51-55', label: '51 - 55 años' },
  { value: '56+', label: '56 años o más' },
];

const steps = [
  { id: 1, name: 'Ubicación' },
  { id: 2, name: 'Edad' },
  { id: 3, name: 'Contacto' },
];

export default function MultiStepForm({ onBack }: MultiStepFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    ageRange: '',
    name: '',
    phone: '',
  });

  // Scroll to top when component mounts or step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const validateStep = () => {
    setError('');

    if (step === 1) {
      const zipRegex = /^\d{5}$/;
      if (!zipRegex.test(formData.zipCode)) {
        setError('Por favor ingresa un código postal válido de 5 dígitos');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.ageRange) {
        setError('Por favor selecciona tu rango de edad');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        setError('Por favor ingresa tu nombre');
        return false;
      }
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        setError('Por favor ingresa un número de teléfono válido de 10 dígitos');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/\D/g, ''),
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      // Track lead event in Facebook Pixel (client-side)
      if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Lead', {
          content_name: 'IUL Lead Form',
          content_category: 'Insurance',
        });
      }

      setIsSuccess(true);
    } catch (err) {
      setError('Hubo un error. Por favor intenta de nuevo.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = isSuccess ? 100 : ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between">
            {!isSuccess && (
              <button
                onClick={step === 1 ? onBack : () => setStep(step - 1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {step === 1 ? 'Volver' : 'Atrás'}
                </span>
              </button>
            )}
            {isSuccess && <div />}

            {/* Step Indicators */}
            {!isSuccess && (
              <div className="flex items-center gap-2">
                {steps.map((s, index) => (
                  <div key={s.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                        step > s.id
                          ? 'bg-emerald-500 text-white'
                          : step === s.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step > s.id ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        s.id
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                          step > s.id ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 animate-shake">
            {error}
          </div>
        )}

        {!isSuccess ? (
          <div className="animate-fadeIn">
            {/* Step 1: Zip Code */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg shadow-blue-500/30">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ¿En qué área vives?
                  </h1>
                  <p className="mt-3 text-slate-600">
                    Esto nos ayuda a conectarte con un especialista en tu zona.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 mb-2">
                      Código Postal (ZIP Code)
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      inputMode="numeric"
                      maxLength={5}
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value.replace(/\D/g, '') })}
                      placeholder="Ej: 33101"
                      className="w-full rounded-2xl border-2 border-slate-200 px-6 py-4 text-xl text-center tracking-widest font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Age Range */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg shadow-blue-500/30">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ¿Cuál es tu rango de edad?
                  </h1>
                  <p className="mt-3 text-slate-600">
                    Para personalizar tu análisis financiero.
                  </p>
                </div>

                <div className="space-y-3">
                  {ageRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setFormData({ ...formData, ageRange: range.value });
                        // Auto-advance after selection
                        setTimeout(() => setStep(3), 200);
                      }}
                      className={`w-full rounded-2xl border-2 px-6 py-4 text-left font-medium transition-all active:scale-[0.98] ${
                        formData.ageRange === range.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{range.label}</span>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.ageRange === range.value
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-slate-300'
                          }`}
                        >
                          {formData.ageRange === range.value && (
                            <CheckIcon className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Name & Phone */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-6 shadow-lg shadow-emerald-500/30">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ¡Casi listo!
                  </h1>
                  <p className="mt-3 text-slate-600">
                    ¿A dónde enviamos tu análisis gratuito?
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Tu Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: María García"
                      className="w-full rounded-2xl border-2 border-slate-200 px-5 py-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Número de Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="(555) 123-4567"
                      className="w-full rounded-2xl border-2 border-slate-200 px-5 py-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-2">
                    <LockClosedIcon className="h-4 w-4" />
                    <span>Tu información está 100% segura</span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      'Solicitar Análisis Gratis'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Success State */
          <div className="text-center py-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white mb-6 shadow-lg shadow-emerald-500/30">
              <CheckIcon className="h-10 w-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              ¡Gracias, {formData.name.split(' ')[0]}!
            </h1>

            <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">
              Un especialista bilingüe se comunicará contigo en las próximas <span className="font-semibold text-slate-900">24 horas</span> al número que proporcionaste.
            </p>

            <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">¿Qué sigue?</h3>
              <p className="text-slate-600">
                Prepara cualquier pregunta que tengas sobre cómo hacer crecer tu dinero libre de impuestos. Nuestro especialista te explicará todo en detalle.
              </p>
            </div>

            <button
              onClick={onBack}
              className="mt-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver al inicio
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto px-4 py-6 text-center text-xs text-slate-400">
        <p>Tu información está protegida y nunca será compartida sin tu consentimiento.</p>
      </footer>
    </div>
  );
}

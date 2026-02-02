'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline';

interface FormData {
  zipCode: string;
  ageRange: string;
  name: string;
  phone: string;
}

interface MultiStepFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ageRanges = [
  { value: '35-40', label: '35 - 40 años' },
  { value: '41-45', label: '41 - 45 años' },
  { value: '46-50', label: '46 - 50 años' },
  { value: '51-55', label: '51 - 55 años' },
  { value: '56+', label: '56 años o más' },
];

export default function MultiStepForm({ isOpen, onClose }: MultiStepFormProps) {
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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
        setError('');
        setFormData({ zipCode: '', ageRange: '', name: '', phone: '' });
      }, 300);
    }
  }, [isOpen]);

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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  {!isSuccess && (
                    <>
                      <Dialog.Title className="text-lg font-semibold text-white">
                        {step === 1 && '¿En qué área vives?'}
                        {step === 2 && '¿Cuál es tu rango de edad?'}
                        {step === 3 && '¡Casi listo!'}
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-blue-100">
                        {step === 1 && 'Esto nos ayuda a conectarte con un especialista en tu zona.'}
                        {step === 2 && 'Para personalizar tu análisis financiero.'}
                        {step === 3 && '¿A dónde enviamos tu análisis gratuito?'}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-blue-200 mb-1">
                          <span>Paso {step} de 3</span>
                          <span>{Math.round((step / 3) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {isSuccess && (
                    <Dialog.Title className="text-lg font-semibold text-white">
                      ¡Solicitud Recibida!
                    </Dialog.Title>
                  )}
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {!isSuccess ? (
                    <>
                      {/* Step 1: Zip Code */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 mb-2">
                              Código Postal (ZIP Code)
                            </label>
                            <input
                              type="text"
                              id="zipCode"
                              maxLength={5}
                              value={formData.zipCode}
                              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value.replace(/\D/g, '') })}
                              placeholder="Ej: 33101"
                              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-center tracking-widest focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                              autoFocus
                            />
                          </div>
                          <button
                            onClick={handleNext}
                            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 transition-all"
                          >
                            Continuar →
                          </button>
                        </div>
                      )}

                      {/* Step 2: Age Range */}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            {ageRanges.map((range) => (
                              <button
                                key={range.value}
                                onClick={() => setFormData({ ...formData, ageRange: range.value })}
                                className={`w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition-all ${
                                  formData.ageRange === range.value
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{range.label}</span>
                                  {formData.ageRange === range.value && (
                                    <CheckIcon className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setStep(1)}
                              className="flex-1 rounded-xl border border-slate-300 py-3 font-medium text-slate-600 hover:bg-slate-50 transition-all"
                            >
                              ← Atrás
                            </button>
                            <button
                              onClick={handleNext}
                              disabled={!formData.ageRange}
                              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Continuar →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Name & Phone */}
                      {step === 3 && (
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
                              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              placeholder="(555) 123-4567"
                              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                          </div>

                          {/* Trust Badge */}
                          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-2">
                            <LockClosedIcon className="h-4 w-4" />
                            <span>Tu información está 100% segura</span>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => setStep(2)}
                              className="flex-1 rounded-xl border border-slate-300 py-3 font-medium text-slate-600 hover:bg-slate-50 transition-all"
                            >
                              ← Atrás
                            </button>
                            <button
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </>
                  ) : (
                    /* Success State */
                    <div className="text-center py-6">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <CheckIcon className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        ¡Gracias, {formData.name.split(' ')[0]}!
                      </h3>
                      <p className="mt-2 text-slate-600">
                        Un especialista bilingüe se comunicará contigo en las próximas 24 horas al número que proporcionaste.
                      </p>
                      <div className="mt-6 rounded-xl bg-blue-50 p-4">
                        <p className="text-sm text-blue-700">
                          <strong>¿Qué sigue?</strong><br />
                          Prepara cualquier pregunta que tengas sobre cómo hacer crecer tu dinero libre de impuestos.
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-medium text-slate-700 hover:bg-slate-200 transition-all"
                      >
                        Cerrar
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

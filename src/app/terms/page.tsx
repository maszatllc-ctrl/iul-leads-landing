import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Términos de Uso
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-slate-600">
              Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos de uso.
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              2. Propósito del Sitio
            </h2>
            <p className="text-slate-600">
              Este sitio web tiene como propósito proporcionar información general sobre estrategias
              de ahorro e inversión, específicamente sobre seguros de vida con componente de inversión.
              La información proporcionada es solo para fines educativos y no constituye asesoramiento
              financiero, fiscal o legal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              3. No es una Oferta de Seguro
            </h2>
            <p className="text-slate-600">
              El contenido de este sitio web no constituye una oferta de venta de ningún producto
              de seguro. Todos los productos de seguro están sujetos a los términos y condiciones
              de la póliza específica, suscripción y aprobación por parte de la compañía de seguros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              4. Consentimiento de Contacto
            </h2>
            <p className="text-slate-600">
              Al enviar tu información a través de nuestro formulario, consientes expresamente
              a ser contactado por teléfono, mensaje de texto o correo electrónico por nosotros
              y/o nuestros socios comerciales para discutir productos de seguros y servicios
              financieros relacionados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              5. Precisión de la Información
            </h2>
            <p className="text-slate-600">
              Hacemos esfuerzos razonables para asegurar que la información en este sitio sea
              precisa y actualizada. Sin embargo, no garantizamos la exactitud, integridad o
              actualidad de la información proporcionada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              6. Limitación de Responsabilidad
            </h2>
            <p className="text-slate-600">
              En ningún caso seremos responsables por daños directos, indirectos, incidentales,
              especiales o consecuentes que resulten del uso o la imposibilidad de usar este
              sitio web o la información contenida en él.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              7. Consideraciones Fiscales
            </h2>
            <p className="text-slate-600">
              Las referencias a beneficios fiscales en este sitio son de naturaleza general.
              Los beneficios fiscales reales dependen de la situación individual de cada persona
              y están sujetos a cambios en las leyes fiscales. Debes consultar con un asesor
              fiscal calificado antes de tomar decisiones basadas en consideraciones fiscales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              8. Modificaciones
            </h2>
            <p className="text-slate-600">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              9. Ley Aplicable
            </h2>
            <p className="text-slate-600">
              Estos términos se regirán e interpretarán de acuerdo con las leyes de los Estados
              Unidos de América, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

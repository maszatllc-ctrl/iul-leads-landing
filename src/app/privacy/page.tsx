import Link from 'next/link';

export default function PrivacyPage() {
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
          Política de Privacidad
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              1. Información que Recopilamos
            </h2>
            <p className="text-slate-600 mb-4">
              Cuando completas nuestro formulario de contacto, recopilamos la siguiente información:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Nombre</li>
              <li>Número de teléfono</li>
              <li>Código postal (ZIP code)</li>
              <li>Rango de edad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              2. Cómo Usamos tu Información
            </h2>
            <p className="text-slate-600 mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Contactarte para brindarte información sobre productos de seguro de vida</li>
              <li>Conectarte con un especialista financiero en tu área</li>
              <li>Personalizar la información que te proporcionamos</li>
              <li>Mejorar nuestros servicios</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              3. Compartir Información
            </h2>
            <p className="text-slate-600">
              Tu información puede ser compartida con agentes de seguros licenciados y socios
              comerciales con el propósito de brindarte los servicios solicitados. No vendemos
              tu información personal a terceros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              4. Cookies y Tecnologías de Seguimiento
            </h2>
            <p className="text-slate-600">
              Utilizamos cookies y tecnologías similares, incluyendo el píxel de Facebook,
              para analizar el tráfico del sitio web y mejorar tu experiencia. Estas tecnologías
              nos ayudan a entender cómo interactúas con nuestro sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              5. Seguridad de los Datos
            </h2>
            <p className="text-slate-600">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu
              información personal contra acceso no autorizado, pérdida o alteración.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              6. Tus Derechos
            </h2>
            <p className="text-slate-600">
              Tienes derecho a acceder, corregir o eliminar tu información personal. Para
              ejercer estos derechos, contáctanos utilizando la información proporcionada
              a continuación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              7. Contacto
            </h2>
            <p className="text-slate-600">
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a
              través del formulario en nuestro sitio web.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

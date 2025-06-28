"use client";

import { Button } from "@/components/ui";

export default function Home() {
  const handleStartPlaying = () => {
    console.log("¡Empezando a reproducir música!");
    // Aquí se implementaría la navegación o lógica de inicio
  };

  const handleShowDemo = () => {
    console.log("Mostrando demo...");
    // Aquí se implementaría la lógica del demo
  };

  const handleGetStarted = () => {
    console.log("¡Comenzando ahora!");
    // Aquí se implementaría la navegación o registro
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-400/50 via-transparent to-emerald-400/50" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/10" />
      </div>

      {/* Floating glass elements for depth */}
      <div className="absolute top-32 left-16 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse opacity-60" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-purple-300/15 rounded-full blur-3xl animate-pulse delay-2000" />
      <div className="absolute bottom-32 right-1/3 w-36 h-36 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-500" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Lyrics Player
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Disfruta de tu música favorita con letras sincronizadas en tiempo
              real. La experiencia perfecta para cantar y seguir tus canciones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                label="🎵 Empezar a Reproducir"
                onClick={handleStartPlaying}
                variant="primary"
                size="large"
              />
              <Button
                label="📖 Ver Demo"
                onClick={handleShowDemo}
                variant="outline"
                size="large"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">
                Características Principales
              </h2>
              <p className="text-xl text-white/80 drop-shadow">
                Todo lo que necesitas para una experiencia musical completa
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border border-white/20 hover:border-white/30">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Letras Sincronizadas
                </h3>
                <p className="text-white/80">
                  Las letras se muestran en tiempo real, perfectamente
                  sincronizadas con la música para que nunca te pierdas.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border border-white/20 hover:border-white/30">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Interfaz Moderna
                </h3>
                <p className="text-white/80">
                  Diseño elegante con efecto liquid glass que se adapta a tus
                  preferencias con modo claro y oscuro.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border border-white/20 hover:border-white/30">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Multiplataforma
                </h3>
                <p className="text-white/80">
                  Funciona perfectamente en todos tus dispositivos: computadora,
                  tablet y móvil.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-8 drop-shadow">
              ¿Listo para una nueva experiencia musical?
            </h2>
            <p className="text-xl text-white/80 mb-10 drop-shadow">
              Únete a miles de usuarios que ya disfrutan de sus canciones
              favoritas con letras sincronizadas.
            </p>
            <Button
              label="🚀 Comenzar Ahora"
              onClick={handleGetStarted}
              variant="primary"
              size="large"
              className="text-lg"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Lyrics Player</h3>
              <p className="text-white/70 mb-8">
                La mejor forma de disfrutar tu música con letras sincronizadas
              </p>
              <div className="flex justify-center space-x-6">
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  📧 Contacto
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  ℹ️ Acerca de
                </a>
                <a
                  href="/button-demo"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  🎨 Button Demo
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  🔒 Privacidad
                </a>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 text-white/60">
                <p>&copy; 2024 Lyrics Player. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

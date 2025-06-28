"use client";

import { Button } from "@/components/ui";

export default function ButtonDemo() {
  const handleClick = (variant: string, size?: string) => {
    console.log(`Button clicked: ${variant}${size ? ` - ${size}` : ""}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500">
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-400 via-transparent to-cyan-400 opacity-70" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/10" />
      </div>

      {/* Floating glass orbs for visual effect */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-32 w-24 h-24 bg-blue-300/30 rounded-full blur-lg animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-2000" />
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-300/25 rounded-full blur-lg animate-pulse delay-500" />

      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Liquid Glass Button Demo
            </h1>
            <p className="text-xl text-white/90 drop-shadow">
              Componente Button con estilo Liquid Glass de Apple
            </p>
          </div>

          {/* Variants Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 drop-shadow">
              Variantes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <h3 className="text-lg font-medium text-white mb-4">Primary</h3>
                <Button
                  label="Primary Button"
                  onClick={() => handleClick("primary")}
                  variant="primary"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <h3 className="text-lg font-medium text-white mb-4">
                  Secondary
                </h3>
                <Button
                  label="Secondary Button"
                  onClick={() => handleClick("secondary")}
                  variant="secondary"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <h3 className="text-lg font-medium text-white mb-4">Outline</h3>
                <Button
                  label="Outline Button"
                  onClick={() => handleClick("outline")}
                  variant="outline"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <h3 className="text-lg font-medium text-white mb-4">Ghost</h3>
                <Button
                  label="Ghost Button"
                  onClick={() => handleClick("ghost")}
                  variant="ghost"
                />
              </div>
            </div>
          </section>

          {/* Sizes Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 drop-shadow">
              Tamaños
            </h2>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  label="Small"
                  onClick={() => handleClick("primary", "small")}
                  variant="primary"
                  size="small"
                />
                <Button
                  label="Medium"
                  onClick={() => handleClick("primary", "medium")}
                  variant="primary"
                  size="medium"
                />
                <Button
                  label="Large"
                  onClick={() => handleClick("primary", "large")}
                  variant="primary"
                  size="large"
                />
              </div>
            </div>
          </section>

          {/* States Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 drop-shadow">
              Estados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <h3 className="text-lg font-medium text-white mb-4">Normal</h3>
                <Button
                  label="Normal Button"
                  onClick={() => handleClick("normal")}
                  variant="primary"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <h3 className="text-lg font-medium text-white mb-4">
                  Disabled
                </h3>
                <Button
                  label="Disabled Button"
                  onClick={() => handleClick("disabled")}
                  variant="primary"
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Full Width Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 drop-shadow">
              Ancho Completo
            </h2>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
              <Button
                label="Full Width Button"
                onClick={() => handleClick("fullwidth")}
                variant="primary"
                fullWidth
              />
            </div>
          </section>

          {/* Custom Styling Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-8 drop-shadow">
              Personalización
            </h2>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
              <Button
                label="🎵 Button con Emoji y Gradiente Personalizado"
                onClick={() => handleClick("custom")}
                variant="primary"
                className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-400/90 hover:to-pink-400/90"
              />
            </div>
          </section>

          {/* Back to Home */}
          <div className="text-center mt-16">
            <Button
              label="← Volver al Inicio"
              onClick={() => window.history.back()}
              variant="outline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

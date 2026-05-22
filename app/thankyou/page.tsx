export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-[system-ui] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 py-5 px-6 text-center">
        <span className="text-xl font-black tracking-tight">ScanPlates</span>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="max-w-md w-full text-center">
          {/* Success Animation */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
            <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-[1] tracking-tight mb-4">
            Parabéns!
            <br />
            <span className="text-green-500">Seu acesso está pronto.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-12 leading-relaxed">
            O ScanPlates já está esperando por você. Siga os 3 passos abaixo para começar
            a escanear suas refeições.
          </p>

          {/* Steps */}
          <div className="bg-[#fafafa] rounded-2xl p-8 text-left mb-10 border border-gray-100">
            <h2 className="text-lg font-black mb-6 text-center uppercase tracking-wider text-sm">
              Como começar
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center shrink-0 text-sm font-black shadow-md">
                  1
                </div>
                <div>
                  <p className="font-bold text-base">Baixe o aplicativo</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Disponível na App Store e Google Play
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center shrink-0 text-sm font-black shadow-md">
                  2
                </div>
                <div>
                  <p className="font-bold text-base">Faça login com seu e-mail</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Use o mesmo e-mail usado na compra
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 text-sm font-black shadow-md shadow-green-500/20">
                  3
                </div>
                <div>
                  <p className="font-bold text-base">Escaneie sua primeira refeição</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Tire uma foto do prato e veja as calorias em segundos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <a
              href="https://apps.apple.com/app/scanplates"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1a1a1a] text-white px-7 py-4 rounded-xl hover:bg-[#333] transition-all hover:scale-[1.02] w-full sm:w-auto justify-center shadow-lg"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-70">Baixar na</p>
                <p className="text-base font-semibold leading-tight">App Store</p>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.scanplates"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1a1a1a] text-white px-7 py-4 rounded-xl hover:bg-[#333] transition-all hover:scale-[1.02] w-full sm:w-auto justify-center shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33c.576.333.576 1.167 0 1.5l-2.302 1.33-2.524-2.53 2.524-2.53zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-70">Disponível no</p>
                <p className="text-base font-semibold leading-tight">Google Play</p>
              </div>
            </a>
          </div>

          {/* Support */}
          <div className="bg-[#fafafa] border border-gray-100 rounded-xl p-5">
            <p className="text-gray-500 text-sm">
              Precisa de ajuda? Fale com a gente:{" "}
              <a
                href="mailto:support@scanplates.com"
                className="text-[#1a1a1a] font-semibold underline"
              >
                support@scanplates.com
              </a>
            </p>
          </div>

          <p className="text-gray-300 text-[10px] mt-10">
            ScanPlates &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

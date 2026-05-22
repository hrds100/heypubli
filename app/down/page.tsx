"use client";

import { useState } from "react";

const WIDGET_CODE = `<!-- COLE O CÓDIGO DO WIDGET HOTMART AQUI -->
<!-- Hotmart → Ferramentas → Funil de Vendas → ScanPlates Upsell Funnel → Código do Widget -->
<script src="https://static.hotmart.com/checkout/widget.min.js"></script>
<div class="hotmart-fb"></div>`;

export default function DownsellPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    const el = document.documentElement.outerHTML;
    await navigator.clipboard.writeText(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-[system-ui]">
      {/* DEV */}
      <div className="bg-gray-100 text-gray-500 text-center py-1.5 px-4 text-xs flex items-center justify-center gap-3">
        <span>DEV: Downsell (Anual)</span>
        <button
          onClick={handleCopyCode}
          className="bg-white text-gray-600 px-3 py-0.5 rounded-full font-semibold text-[10px] border border-gray-200 hover:bg-gray-50 transition"
        >
          {copied ? "Copiado!" : "Copiar HTML"}
        </button>
      </div>

      {/* URGENCY BAR */}
      <div className="bg-[#1a1a1a] text-white text-center py-4 px-4">
        <p className="text-sm md:text-base font-bold tracking-[0.15em] uppercase">
          Espere! Antes de ir embora...
        </p>
        <p className="text-xs text-gray-400 mt-1">Temos algo especial para você</p>
      </div>

      {/* HERO */}
      <div className="max-w-2xl mx-auto px-6 pt-12 md:pt-16 pb-6 text-center">
        <div className="inline-flex items-center bg-green-50 text-green-700 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2.5 animate-pulse" />5
          DIAS GRÁTIS — Teste sem compromisso
        </div>

        <h1 className="text-[2.5rem] md:text-6xl font-black leading-[0.95] tracking-tight mb-5">
          Que tal{" "}
          <span className="relative inline-block">
            53% OFF
            <span className="absolute bottom-0.5 md:bottom-1 left-0 w-full h-2.5 md:h-3 bg-amber-200 -z-10 rounded-sm" />
          </span>
          <br />
          no Plano Anual?
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
          Entendemos que o plano vitalício pode ser demais agora. Por isso, temos uma
          alternativa que cabe no seu bolso.
        </p>
      </div>

      {/* SAVINGS COMPARISON */}
      <div className="max-w-md mx-auto px-6 pb-10">
        <div className="border-2 border-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-[#1a1a1a] text-white text-center py-3">
            <p className="text-sm font-bold tracking-widest uppercase">Oferta especial</p>
          </div>
          <div className="p-8 bg-white">
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400 text-sm">Plano Mensal (12x)</span>
                <span className="text-gray-400 line-through">R$ 708/ano</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400 text-sm">Custo mensal</span>
                <span className="text-gray-400 line-through">R$ 59/mês</span>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-gray-400 line-through text-lg">R$ 708</span>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  -53% OFF
                </span>
              </div>
              <p className="text-6xl font-black mt-3 tracking-tight">R$ 336</p>
              <p className="text-amber-600 font-bold text-lg mt-2">Apenas R$ 28/mês</p>
              <p className="text-gray-400 text-sm mt-1">Cobrado anualmente</p>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="font-bold text-green-700">Economize R$ 372 por ano</p>
              <p className="text-green-600 text-sm mt-0.5">
                Mais de 6 meses grátis vs. o plano mensal!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS */}
      <div className="max-w-md mx-auto px-6 pb-10">
        <h3 className="text-xl font-bold mb-6 text-center">
          Tudo incluso no Plano Anual:
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "Scanner de calorias por IA",
              desc: "Acesso completo por 12 meses",
            },
            {
              title: "Acompanhe calorias e macros",
              desc: "Proteínas, carboidratos e gorduras detalhados",
            },
            {
              title: "Todas as atualizações incluídas",
              desc: "Novas funcionalidades durante a assinatura",
            },
            {
              title: "53% mais barato que o mensal",
              desc: "O preço mais inteligente para quem leva a sério",
            },
            {
              title: "Suporte completo",
              desc: "Ajuda rápida durante toda a assinatura",
            },
          ].map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-green-600"
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
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-DAY TRIAL CALLOUT */}
      <div className="max-w-md mx-auto px-6 pb-10">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-2">5 Dias Grátis Para Testar</h3>
          <p className="text-gray-600 leading-relaxed">
            Você <strong>NÃO será cobrado agora</strong>. Teste o ScanPlates por 5 dias.
            Se não gostar, cancele sem pagar nada.
          </p>
        </div>
      </div>

      {/* WIDGET PLACEHOLDER */}
      <div className="max-w-md mx-auto px-6 pb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50">
          <p className="text-gray-400 text-[10px] font-mono mb-4 uppercase tracking-widest">
            Widget Hotmart — cole o código aqui
          </p>
          <div id="hotmart-widget" dangerouslySetInnerHTML={{ __html: WIDGET_CODE }} />
          <p className="text-gray-300 text-[10px] font-mono mt-4 uppercase tracking-widest">
            Fim do Widget
          </p>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="max-w-md mx-auto px-6 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-5 text-gray-400 text-xs">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Compra 100% segura
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            5 dias grátis
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Cancele quando quiser
          </span>
        </div>
      </div>

      {/* NO THANKS */}
      <div className="text-center pb-12">
        <p className="text-gray-400 text-xs underline cursor-pointer hover:text-gray-500 transition">
          Não obrigado, quero continuar com o plano atual
        </p>
      </div>

      <p className="text-gray-300 text-[10px] text-center pb-6">
        ScanPlates &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}

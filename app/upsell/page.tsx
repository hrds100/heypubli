"use client";

import { useState } from "react";

const WIDGET_CODE = `<!-- COLE O CÓDIGO DO WIDGET HOTMART AQUI -->
<!-- Hotmart → Ferramentas → Funil de Vendas → ScanPlates Upsell Funnel → Código do Widget -->
<script src="https://static.hotmart.com/checkout/widget.min.js"></script>
<div class="hotmart-fb"></div>`;

function PhoneMockup() {
  return (
    <div className="relative w-[200px] h-[400px] bg-[#1a1a1a] rounded-[36px] p-[8px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70px] h-[22px] bg-[#1a1a1a] rounded-b-xl z-10" />
      <div className="w-full h-full bg-white rounded-[28px] overflow-hidden">
        <div className="h-9 bg-[#1a1a1a] flex items-end justify-center pb-1">
          <span className="text-white text-[9px] font-bold tracking-widest">
            SCANPLATES
          </span>
        </div>
        <div className="p-4 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray="314"
                strokeDashoffset="85"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black leading-none">1.847</span>
              <span className="text-[8px] text-gray-400 font-bold mt-0.5">KCAL</span>
            </div>
          </div>
          <div className="w-full space-y-2">
            {[
              { label: "Proteína", pct: "60%", color: "bg-blue-500" },
              { label: "Carbos", pct: "72%", color: "bg-amber-500" },
              { label: "Gordura", pct: "45%", color: "bg-rose-400" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-[9px] text-gray-500 mb-0.5">
                  <span>{m.label}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full`}
                    style={{ width: m.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full mt-3 bg-gray-50 rounded-lg p-2.5">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
              Última refeição
            </p>
            <p className="text-[11px] font-semibold mt-0.5">Frango grelhado com arroz</p>
            <p className="text-[9px] text-gray-400">485 kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpsellPage() {
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
        <span>DEV: Upsell (Vitalício)</span>
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
          Pare! Não feche esta página
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Sua oferta exclusiva expira quando você sair
        </p>
      </div>

      {/* HERO */}
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-16 pb-6 text-center">
        <div className="inline-flex items-center bg-green-50 text-green-700 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2.5 animate-pulse" />5
          DIAS GRÁTIS — Comece sem pagar nada
        </div>

        <h1 className="text-[2.75rem] md:text-7xl font-black leading-[0.95] tracking-tight mb-5">
          Garante Acesso{" "}
          <span className="relative inline-block">
            VITALÍCIO
            <span className="absolute bottom-0.5 md:bottom-1 left-0 w-full h-2.5 md:h-3.5 bg-green-200 -z-10 rounded-sm" />
          </span>
          <br />
          ao ScanPlates
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
          Pague uma vez. Use para sempre. Sem surpresas na fatura. Sem cobranças mensais.
        </p>
      </div>

      {/* APP MOCKUP + BENEFITS */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="shrink-0">
            <PhoneMockup />
          </div>

          <div className="flex-1 space-y-5">
            <h3 className="text-xl font-bold mb-2">Tudo que você recebe:</h3>
            {[
              {
                title: "Scanner de calorias por IA",
                desc: "Tire foto do prato e saiba as calorias em segundos",
              },
              {
                title: "Macros e nutrientes detalhados",
                desc: "Proteínas, carboidratos e gorduras de cada refeição",
              },
              {
                title: "Atualizações vitalícias",
                desc: "Todas as melhorias futuras do app incluídas",
              },
              {
                title: "Zero cobranças recorrentes",
                desc: "Pague uma vez — nunca mais veja uma cobrança",
              },
              {
                title: "Suporte prioritário",
                desc: "Ajuda rápida sempre que precisar",
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
      </div>

      {/* PRICE CARD */}
      <div className="max-w-md mx-auto px-6 pb-10">
        <div className="border-2 border-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-[#1a1a1a] text-white text-center py-3">
            <p className="text-sm font-bold tracking-widest uppercase">Melhor valor</p>
          </div>
          <div className="p-8 text-center bg-white">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-gray-400 line-through text-lg">R$ 3.540</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                -68% OFF
              </span>
            </div>
            <p className="text-6xl md:text-7xl font-black mt-3 tracking-tight">
              R$ 1.120
            </p>
            <p className="text-green-600 font-bold text-lg mt-3">Economize R$ 2.420,00</p>
            <p className="text-gray-400 text-sm mt-1">
              Pagamento único — acesso para sempre
            </p>
          </div>
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
            Você <strong>NÃO será cobrado agora</strong>. Teste o ScanPlates por 5 dias
            completos. Se não amar, cancele sem pagar nada.
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

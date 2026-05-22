"use client";

import { useState } from "react";

const WIDGET_CODE = `<!-- COLE O CÓDIGO DO WIDGET HOTMART AQUI -->
<!-- Vá em Hotmart → Ferramentas → Funil de Vendas → ScanPlates Upsell Funnel → Código do Widget -->
<!-- Copie o código e substitua este bloco -->
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
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* DEV: Copy Code Button */}
      <div className="bg-orange-600 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-3">
        <span>🛠 DEV: Página de Downsell (Anual)</span>
        <button
          onClick={handleCopyCode}
          className="bg-white text-orange-600 px-4 py-1 rounded font-bold text-xs hover:bg-orange-50 transition"
        >
          {copied ? "✓ Copiado!" : "Copiar HTML"}
        </button>
      </div>

      {/* Warning Bar */}
      <div className="bg-[#F59E0B] text-black text-center py-3 px-4">
        <p className="text-sm md:text-base font-bold tracking-wide">
          ⏳ ESPERE — Temos uma última oferta especial para você!
        </p>
      </div>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
        <p className="text-[#F59E0B] font-semibold text-sm uppercase tracking-widest mb-3">
          Última chance — oferta especial
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          Que tal o <span className="text-[#F59E0B]">Plano Anual</span> com{" "}
          <span className="underline decoration-[#F59E0B]">53% de desconto</span>?
        </h1>
        <p className="text-gray-400 text-base md:text-lg mt-4">
          Entendemos que o plano vitalício pode ser um investimento alto agora. Por isso,
          temos uma alternativa incrível para você.
        </p>
      </div>

      {/* Savings Comparison */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-center mb-6">Compare e economize:</h2>

          {/* Monthly vs Annual */}
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Plano Mensal (12 meses)</span>
            <span className="text-red-400 line-through text-lg">R$ 708,00/ano</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Custo mensal no plano mensal</span>
            <span className="text-red-400 line-through">R$ 59,00/mês</span>
          </div>

          {/* Annual */}
          <div className="flex items-center justify-between py-4 mt-2">
            <div>
              <span className="text-[#F59E0B] font-bold text-lg">✅ Plano Anual</span>
              <p className="text-gray-500 text-sm">Apenas R$ 28,00/mês</p>
            </div>
            <span className="text-[#F59E0B] font-extrabold text-2xl">R$ 336,00/ano</span>
          </div>

          <div className="mt-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-4 text-center">
            <p className="text-[#F59E0B] font-bold text-lg">
              Economize R$ 372,00 por ano
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Isso é mais de 6 meses grátis comparado ao plano mensal!
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <h3 className="text-lg font-bold mb-4 text-center">
          Tudo incluso no Plano Anual:
        </h3>
        <div className="space-y-3">
          {[
            "Scanner de calorias por IA — acesso completo por 12 meses",
            "Acompanhe calorias, macronutrientes e refeições",
            "Todas as atualizações durante a assinatura",
            "Economize 53% comparado ao plano mensal",
            "Suporte completo durante toda a assinatura",
            "Garantia de 7 dias — satisfação garantida",
          ].map((benefit) => (
            <div key={benefit} className="flex items-start gap-3">
              <span className="text-[#F59E0B] text-lg mt-0.5">✓</span>
              <span className="text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget Placeholder */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <div className="bg-[#1a1a1a] border-2 border-dashed border-yellow-500/50 rounded-2xl p-8 text-center">
          <p className="text-yellow-500 text-xs font-mono mb-4 uppercase tracking-widest">
            ↓ Widget Hotmart (cole o código aqui) ↓
          </p>

          <div id="hotmart-widget" dangerouslySetInnerHTML={{ __html: WIDGET_CODE }} />

          <p className="text-yellow-500/60 text-xs font-mono mt-4 uppercase tracking-widest">
            ↑ Fim do Widget Hotmart ↑
          </p>
        </div>
      </div>

      {/* Trust */}
      <div className="max-w-xl mx-auto px-4 pb-10 text-center">
        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Compra 100% segura</span>
          </div>
          <div className="flex items-center gap-2">
            <span>↩️</span>
            <span>Garantia de 7 dias</span>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-6">
          ScanPlates © {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const WIDGET_CODE = `<!-- COLE O CÓDIGO DO WIDGET HOTMART AQUI -->
<!-- Vá em Hotmart → Ferramentas → Funil de Vendas → ScanPlates Upsell Funnel → Código do Widget -->
<!-- Copie o código e substitua este bloco -->
<script src="https://static.hotmart.com/checkout/widget.min.js"></script>
<div class="hotmart-fb"></div>`;

export default function UpsellPage() {
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
      <div className="bg-blue-600 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-3">
        <span>🛠 DEV: Página de Upsell (Vitalício)</span>
        <button
          onClick={handleCopyCode}
          className="bg-white text-blue-600 px-4 py-1 rounded font-bold text-xs hover:bg-blue-50 transition"
        >
          {copied ? "✓ Copiado!" : "Copiar HTML"}
        </button>
      </div>

      {/* Warning Bar */}
      <div className="bg-[#e63946] text-white text-center py-3 px-4">
        <p className="text-sm md:text-base font-bold tracking-wide animate-pulse">
          ⚠️ ATENÇÃO: NÃO FECHE ESTA PÁGINA — SUA OFERTA EXCLUSIVA ESTÁ LOGO ABAIXO ⚠️
        </p>
      </div>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
        <p className="text-[#10B981] font-semibold text-sm uppercase tracking-widest mb-3">
          Oferta exclusiva — disponível apenas agora
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          Garanta <span className="text-[#10B981]">Acesso Vitalício</span> ao ScanPlates e{" "}
          <span className="underline decoration-[#10B981]">
            nunca mais pague mensalidade
          </span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg mt-4">
          Você acabou de assinar o ScanPlates — parabéns! Mas antes de continuar, temos
          uma oferta única para você.
        </p>
      </div>

      {/* Savings Comparison */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-center mb-6">
            Veja quanto você economiza:
          </h2>

          {/* Monthly cost */}
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Plano Mensal (1 ano)</span>
            <span className="text-red-400 line-through text-lg">R$ 708,00</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Plano Mensal (2 anos)</span>
            <span className="text-red-400 line-through text-lg">R$ 1.416,00</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Plano Mensal (5 anos)</span>
            <span className="text-red-400 line-through text-lg">R$ 3.540,00</span>
          </div>

          {/* Lifetime */}
          <div className="flex items-center justify-between py-4 mt-2">
            <span className="text-[#10B981] font-bold text-lg">✅ Acesso Vitalício</span>
            <span className="text-[#10B981] font-extrabold text-2xl">R$ 1.120,00</span>
          </div>

          <div className="mt-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-4 text-center">
            <p className="text-[#10B981] font-bold text-lg">
              Você economiza até R$ 2.420,00
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Pagamento único — sem cobranças recorrentes, para sempre.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <h3 className="text-lg font-bold mb-4 text-center">
          O que você recebe com o Vitalício:
        </h3>
        <div className="space-y-3">
          {[
            "Acesso ilimitado ao scanner de calorias por IA",
            "Acompanhe calorias, macros e alimentação para sempre",
            "Todas as atualizações futuras incluídas",
            "Sem cobranças mensais — pague uma vez, use para sempre",
            "Suporte prioritário vitalício",
            "Garantia de 7 dias — satisfação garantida",
          ].map((benefit) => (
            <div key={benefit} className="flex items-start gap-3">
              <span className="text-[#10B981] text-lg mt-0.5">✓</span>
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

          {/* This div is where the Hotmart widget goes */}
          <div id="hotmart-widget" dangerouslySetInnerHTML={{ __html: WIDGET_CODE }} />

          <p className="text-yellow-500/60 text-xs font-mono mt-4 uppercase tracking-widest">
            ↑ Fim do Widget Hotmart ↑
          </p>
        </div>
      </div>

      {/* Trust / Urgency */}
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

'use client';
import { useState } from 'react';
import { Wallet, Copy, CheckCircle2 } from 'lucide-react';

export default function PaymentModal() {
  const [copied, setCopied] = useState(false);
  const aliasMP = "RWKIOSCO";

  const copyAlias = () => {
    navigator.clipboard.writeText(aliasMP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center pt-4">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
        <Wallet size={28} />
      </div>
      <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">Mercado Pago</h3>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">Copiá el alias para pagar</p>
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-6 border border-gray-100">
        <span className="font-black text-xs italic truncate p-2 mr-2 tracking-tight">{aliasMP}</span>
        <button onClick={copyAlias} className="text-blue-600 shrink-0">
          {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
        </button>
      </div>
      <p className="text-[9px] text-gray-400 font-bold leading-relaxed px-2 uppercase tracking-tight">
        Una vez realizada la transferencia, enviá el comprobante por WhatsApp.
      </p>
    </div>
  );
}
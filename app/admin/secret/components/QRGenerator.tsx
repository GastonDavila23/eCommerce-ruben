'use client';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Copy, Check, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { div } from 'framer-motion/client';

export default function QRGenerator() {
    const url = "https://e-commerce-ruben.vercel.app/";
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Carta Digital de Rubén',
                    text: 'Mirá nuestra carta actualizada y hacé tu pedido online:',
                    url: url,
                });
            } catch (error) {
                console.log('Error compartiendo', error);
            }
        } else {
            // Si el navegador no soporta share, copiamos al portapapeles
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadQR = () => {
        const svg = document.getElementById("qr-code");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg as any);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "QR_CARTA_RUBEN.png";
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="p-8 bg-white rounded-[2.5rem] text-black flex flex-col items-center gap-6 border border-gray-100 shadow-sm">

            <div className="flex flex-col items-center gap-1">

                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Herramientas de Difusión</h3>
                <p className="text-lg font-black italic uppercase tracking-tighter">Tu Carta Digital</p>
            </div>

            <div className="bg-white p-4 rounded-[2rem] border-4 border-gray-50 shadow-inner">
                <QRCodeSVG
                    id="qr-code"
                    value={url}
                    size={180}
                    level="H"
                />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                <button
                    onClick={downloadQR}
                    className="py-4 bg-black text-white rounded-2xl flex flex-col items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all"
                >
                    <Download size={18} /> Imprimir
                </button>

                <button
                    onClick={handleShare}
                    className="py-4 bg-orange-500 text-white rounded-2xl flex flex-col items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all"
                >
                    <Share2 size={18} /> Compartir
                </button>
            </div>

            <button
                onClick={copyToClipboard}
                className="text-[10px] font-bold text-gray-400 flex items-center gap-2 hover:text-black transition-colors"
            >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? '¡Copiado!' : 'Copiar enlace directo'}
            </button>
        </div>
    );
}
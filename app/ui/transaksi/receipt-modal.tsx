// app/ui/transaksi/receipt-modal.tsx
'use client';

import { Transaction } from '@/app/lib/definitions';
import { formatCurrency, formatDate, formatPhoneForWA } from '@/app/lib/utils';
import { X, Printer, Share2 } from 'lucide-react';
import { useMemo } from 'react';

export default function ReceiptModal({
    transaction,
    onClose,
    customerPhone
}: {
    transaction: Transaction;
    onClose: () => void;
    customerPhone?: string;
}) {

    const { subTotal, ongkir, discount, grandTotal } = useMemo(() => {
        const calculatedSubTotal = transaction.items?.reduce((sum, item) => {
            return sum + Number(item.subtotal);
        }, 0) || 0;

        const ongkirAmount = Number(transaction.ongkir || 0);
        const finalTotal = Number(transaction.total_amount);
        const disc = calculatedSubTotal + ongkirAmount - finalTotal;

        return {
            subTotal: calculatedSubTotal,
            ongkir: ongkirAmount,
            discount: disc,
            grandTotal: finalTotal
        };
    }, [transaction]);

    const generateWhatsAppMessage = () => {
        let message = `*STRUK PEMBAYARAN*\n`;
        message += `*BABIPEDIA*\n`;
        message += `All about Pork!\n\n`;
        
        message += `━━━━━━━━━━━━━━━━━━━\n`;
        message += `ID: *${transaction.id}*\n`;
        message += `Tanggal: ${formatDate(transaction.date)}\n`;
        message += `Pelanggan: ${transaction.customer_name}\n`;
        message += `━━━━━━━━━━━━━━━━━━━\n\n`;
        
        message += `*ITEM PESANAN:*\n`;
        transaction.items?.forEach((item, idx) => {
            message += `${idx + 1}. ${item.menu_name}\n`;
            message += `   ${item.quantity} x ${formatCurrency(Number(item.price))} = ${formatCurrency(Number(item.subtotal))}\n`;
        });
        
        message += `\n━━━━━━━━━━━━━━━━━━━\n`;
        message += `Subtotal: ${formatCurrency(subTotal)}\n`;
        
        if (ongkir > 0) {
            message += `Ongkir: +${formatCurrency(ongkir)}\n`;
        }
        
        if (discount > 0) {
            message += `Diskon: -${formatCurrency(discount)}\n`;
        }
        
        message += `\n*TOTAL: ${formatCurrency(grandTotal)}*\n`;
        message += `━━━━━━━━━━━━━━━━━━━\n\n`;
        
        message += `Terima kasih atas kunjungan Anda! 🙏\n`;
        message += `Jl. K.H. Muhdi Gang Komajaya, Maguwoharjo\n`;
        message += `Telp: 0811-251-8481`;
        
        return message;
    };

    const handleSendToWhatsApp = () => {
        const message = generateWhatsAppMessage();
        const encodedMessage = encodeURIComponent(message);
        
        let waUrl = '';
        
        if (customerPhone) {
            const formattedPhone = formatPhoneForWA(customerPhone);
            waUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        } else {
            waUrl = `https://wa.me/?text=${encodedMessage}`;
        }
        
        window.open(waUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0">
            <div className="absolute inset-0 print:hidden" onClick={onClose}></div>

            <div className="relative w-full max-w-sm bg-white shadow-2xl overflow-hidden rounded-sm print:shadow-none print:w-full">

                <div className="bg-pink-600 p-4 text-white flex justify-between items-center print:hidden">
                    <h3 className="font-bold">Detail Transaksi</h3>
                    <button onClick={onClose}><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 bg-white font-mono text-sm text-gray-700 print:p-0">

                    <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
                        <h2 className="text-xl font-bold text-pink-600 mb-1 print:text-black">BABIPEDIA</h2>
                        <p className="text-xs text-gray-500">Jl. K.H. Muhdi Gang Komajaya, Corongan, Maguwoharjo, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta</p>
                        <p className="text-xs text-gray-500">Telp: 0811-251-8481</p>
                    </div>

                    <div className="mb-4 space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>ID:</span>
                            <span className="font-bold">{transaction.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tanggal:</span>
                            <span>{formatDate(transaction.date)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Plg:</span>
                            <span>{transaction.customer_name}</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-300 py-2 mb-2">
                        {transaction.items?.map((item, idx) => (
                            <div key={idx} className="mb-2 last:mb-0">
                                <div className="font-bold truncate">{item.menu_name}</div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{item.quantity} x {formatCurrency(Number(item.price))}</span>
                                    <span className="text-gray-800">{formatCurrency(Number(item.subtotal))}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-300 pt-2 space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subTotal)}</span>
                        </div>

                        {ongkir > 0 && (
                            <div className="flex justify-between text-xs text-blue-600 font-medium">
                                <span>Ongkir</span>
                                <span>+{formatCurrency(ongkir)}</span>
                            </div>
                        )}

                        {discount > 0 && (
                            <div className="flex justify-between text-xs text-red-500 font-medium">
                                <span>Diskon</span>
                                <span>-{formatCurrency(discount)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-lg font-bold text-black border-t border-dashed border-gray-300 pt-2 mt-2">
                            <span>TOTAL</span>
                            <span>{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>

                    <div className="text-center text-xs text-gray-400 mt-6 print:mt-8">
                        <p>Terima kasih atas kunjungan Anda!</p>
                        <p>Simpan struk ini sebagai bukti pembayaran.</p>
                    </div>

                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 print:hidden">
                    <button
                        onClick={handleSendToWhatsApp}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                    >
                        <Share2 className="w-4 h-4" />
                        {customerPhone ? 'Kirim ke WA' : 'Share WA'}
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm font-semibold"
                    >
                        <Printer className="w-4 h-4" /> Cetak
                    </button>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { NequiLogo, PayPalLogo } from "./Logos";

interface PaymentCardProps {
  metodo: "nequi" | "paypal";
  selected: boolean;
  onSelect: () => void;
  monto: string;
  moneda: string;
  usd: string;
  dato: string;
  onCopy: (text: string, label: string) => void;
}

export function PaymentCard({ metodo, selected, onSelect, monto, moneda, usd, dato, onCopy }: PaymentCardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(selected);
  }, [selected]);

  const isNequi = metodo === "nequi";
  const detalle = isNequi
    ? { icon: <NequiLogo />, label: "Nequi", tipo: "Celular" }
    : { icon: <PayPalLogo />, label: "PayPal", tipo: "Email" };

  return (
    <div className={`payment-card ${selected ? "selected" : ""} ${flipped ? "flipped" : ""}`} onClick={onSelect}>
      <div className="card-inner">
        {/* Front - Selection */}
        <div className="card-front">
          <div className="card-icon-lg">{detalle.icon}</div>
          <div className="card-label">{detalle.label}</div>
          {selected && <div className="checkmark">✓</div>}
        </div>

        {/* Back - Payment Details */}
        <div className="card-back">
          <div className="card-icon">{detalle.icon}</div>
          <div className="card-label">{detalle.label}</div>
          
          <div className="payment-detail">
            <span className="detail-label">{detalle.tipo}</span>
            <div className="detail-value-row">
              <span className="detail-value">{dato}</span>
              <button 
                className="copy-btn" 
                onClick={(e) => { e.stopPropagation(); onCopy(dato, detalle.tipo); }}
                title={`Copiar ${detalle.tipo}`}
              >
                📋
              </button>
            </div>
          </div>

          <div className="payment-amount">
            <span className="amount-label">Monto a pagar</span>
            <div className="amount-value-row">
              <span className="amount-value">{isNequi ? `${monto} ${moneda}` : `US$${usd}`}</span>
              <button 
                className="copy-btn" 
                onClick={(e) => { e.stopPropagation(); onCopy(isNequi ? `${monto} ${moneda}` : `US$${usd}`, "Monto"); }}
                title="Copiar monto"
              >
                📋
              </button>
            </div>
          </div>

          {isNequi && (
            <p className="instruction">Escribe el código del pedido en el mensaje de Nequi</p>
          )}
          {!isNequi && (
            <p className="instruction">Escribe el código del pedido en la nota de PayPal</p>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useCallback } from "react";

interface FAQModalProps {
  open: boolean;
  onClose: () => void;
}

const faqs = [
  {
    q: "¿Cómo funciona?",
    a: "Escribe tu usuario o link de perfil, verificamos que la cuenta sea pública, eliges el paquete de seguidores/suscriptores y pagas por Nequi o PayPal. En cuanto confirmamos el pago, iniciamos el proceso."
  },
  {
    q: "¿Cuánto tarda la entrega?",
    a: "El tiempo de aumento es de <b>1 a 3 días</b> hábiles después de confirmar el pago. En la mayoría de casos empieza a verse en las primeras 24 horas."
  },
  {
    q: "¿Necesito dar mi contraseña?",
    a: "<b>No.</b> Solo pedimos tu usuario o link público y tu WhatsApp para enviarte la confirmación. Nunca solicitamos contraseñas ni accesos a tu cuenta."
  },
  {
    q: "¿Mi cuenta debe ser pública?",
    a: "<b>Sí.</b> Si tu cuenta es privada, no podemos procesar el pedido. Cámbiala a pública antes de verificar y vuelve a intentarlo."
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Nequi (Colombia) y PayPal (internacional). El total se muestra en COP y su equivalente en USD para PayPal."
  },
  {
    q: "¿Puedo pagar después de hacer el pedido?",
    a: "Sí. Al confirmar el pedido se genera un código. Puedes pagar en los siguientes 5 minutos y enviarnos el comprobante por WhatsApp, o pagar después y avisarnos."
  },
  {
    q: "¿Los seguidores son reales?",
    a: "Entregamos seguidores de alta calidad (cuentas con foto, bio y actividad). No son bots vacíos, pero el engagement orgánico depende de tu contenido."
  },
  {
    q: "¿Hay garantía?",
    a: "Si no ves el aumento en 3 días hábiles, contáctanos por WhatsApp y revisamos tu caso. Ofrecemos reposición si hubo caída en los primeros 30 días."
  },
  {
    q: "¿Puedo pedir para varias cuentas?",
    a: "Sí, repite el proceso por cada usuario. Cada pedido es independiente y tiene su propio código de seguimiento."
  },
  {
    q: "¿Funciona para cualquier país?",
    a: "Sí, entregamos en toda Latinoamérica y global. Los precios están en COP y el cambio a USD se calcula con la TRM del día."
  },
];

export function FAQModal({ open, onClose }: FAQModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="faq-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-title"
    >
      <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
        <div className="faq-header">
          <h2 id="faq-title">Preguntas frecuentes</h2>
          <button className="faq-close" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="faq-content">
          {faqs.map((item, i) => (
            <details key={i} className="faq-item">
              <summary>{item.q}</summary>
              <div className="faq-answer" dangerouslySetInnerHTML={{ __html: item.a }} />
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
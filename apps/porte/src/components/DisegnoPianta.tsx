import type { ConfigurazionePorta, RisultatoCalcolo } from "@/lib/tipi";

interface Props {
  config: ConfigurazionePorta;
  risultato: RisultatoCalcolo;
}

const COLORE_MURO = "#8a929c";
const COLORE_ANTA = "#a97e4f";
const COLORE_TRATTO = "#16212e";
const COLORE_QUOTA = "#1d4ed8";

/**
 * Pianta (vista dall'alto) con arco di apertura.
 * Convenzione: chi guarda è dal lato "a spingere"; la porta si apre
 * verso l'alto del disegno quando il movimento è "spingere".
 */
export function DisegnoPianta({ config, risultato: r }: Props) {
  const fm = config.foroMuro;
  const spessore = Math.max(fm.spessoreMuro, 80);
  const muroLato = 420;
  const margine = 340;
  const scorrevole =
    config.modello === "scorrevole_scomparsa" || config.modello === "scorrevole_esterno";

  const larghezzaDisegno = fm.larghezza + muroLato * 2 + margine * 2;
  const raggio = r.anta.larghezza;
  const altezzaDisegno = spessore + raggio + 320 + margine * 2;

  // Muro orizzontale; il vano è tra x=0 e x=fm.larghezza; muro tra y=0 e y=spessore.
  // Sotto il muro (y > spessore) = lato verso cui si SPINGE.
  const apreSotto = config.apertura.movimento === "spingere";
  const cardiniADestra = config.apertura.lato === "destra";
  const xCardine = cardiniADestra ? fm.larghezza : 0;
  const yCardine = apreSotto ? spessore : 0;
  const xPuntaAperta = xCardine;
  const yPuntaAperta = apreSotto ? spessore + raggio : -raggio;
  const xPuntaChiusa = cardiniADestra ? xCardine - raggio : xCardine + raggio;

  const sweep = apreSotto === cardiniADestra ? 0 : 1;

  const viewBox = `${-muroLato - margine} ${-(apreSotto ? margine + 160 : raggio + margine) } ${larghezzaDisegno} ${altezzaDisegno}`;

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={`Pianta apertura ${r.ferramenta.descrizioneApertura}`}
      className="h-auto w-full"
    >
      <defs>
        <pattern id="muroPianta" width={50} height={50} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={50} height={50} fill="#dfe3e8" />
          <line x1={0} y1={0} x2={0} y2={50} stroke="#b4bac2" strokeWidth={9} />
        </pattern>
      </defs>

      {/* Muri ai lati del vano */}
      <rect x={-muroLato} y={0} width={muroLato} height={spessore} fill="url(#muroPianta)" stroke={COLORE_MURO} strokeWidth={5} />
      <rect x={fm.larghezza} y={0} width={muroLato} height={spessore} fill="url(#muroPianta)" stroke={COLORE_MURO} strokeWidth={5} />

      {!scorrevole && (
        <g>
          {/* Anta chiusa (nel vano) */}
          <rect
            x={Math.min(xCardine, xPuntaChiusa)}
            y={spessore / 2 - 25}
            width={raggio}
            height={50}
            fill={COLORE_ANTA}
            opacity={0.45}
            stroke={COLORE_TRATTO}
            strokeWidth={3}
          />
          {/* Arco di apertura */}
          <path
            d={`M ${xPuntaChiusa} ${spessore / 2} A ${raggio} ${raggio} 0 0 ${sweep} ${xPuntaAperta} ${yPuntaAperta}`}
            fill="none"
            stroke={COLORE_TRATTO}
            strokeWidth={6}
            strokeDasharray="36 26"
          />
          {/* Anta aperta */}
          <line x1={xCardine} y1={yCardine} x2={xPuntaAperta} y2={yPuntaAperta} stroke={COLORE_ANTA} strokeWidth={46} strokeLinecap="round" />
          {/* Cardine */}
          <circle cx={xCardine} cy={yCardine} r={40} fill="#3f4954" />
          {config.modello === "ventola" && (
            <path
              d={`M ${xPuntaChiusa} ${spessore / 2} A ${raggio} ${raggio} 0 0 ${sweep === 0 ? 1 : 0} ${xPuntaAperta} ${apreSotto ? -raggio + spessore : spessore + raggio}`}
              fill="none"
              stroke={COLORE_TRATTO}
              strokeWidth={6}
              strokeDasharray="14 20"
              opacity={0.6}
            />
          )}
        </g>
      )}

      {scorrevole && (
        <g>
          {/* Binario / controtelaio */}
          <rect
            x={cardiniADestra ? 0 : -r.anta.larghezza}
            y={config.modello === "scorrevole_esterno" ? spessore + 20 : spessore / 2 - 25}
            width={fm.larghezza + r.anta.larghezza}
            height={50}
            fill="none"
            stroke={COLORE_MURO}
            strokeWidth={5}
            strokeDasharray="30 20"
            transform={cardiniADestra ? "" : `translate(${0} 0)`}
          />
          {/* Anta */}
          <rect
            x={cardiniADestra ? fm.larghezza - r.anta.larghezza / 2 : -r.anta.larghezza / 2}
            y={config.modello === "scorrevole_esterno" ? spessore + 20 : spessore / 2 - 25}
            width={r.anta.larghezza}
            height={50}
            fill={COLORE_ANTA}
            stroke={COLORE_TRATTO}
            strokeWidth={4}
          />
          {/* Freccia scorrimento */}
          <g stroke={COLORE_TRATTO} strokeWidth={10} fill="none">
            <line x1={fm.larghezza / 2 - 180} y1={spessore + 170} x2={fm.larghezza / 2 + 180} y2={spessore + 170} />
            <path
              d={
                cardiniADestra
                  ? `M ${fm.larghezza / 2 + 110} ${spessore + 110} L ${fm.larghezza / 2 + 180} ${spessore + 170} L ${fm.larghezza / 2 + 110} ${spessore + 230}`
                  : `M ${fm.larghezza / 2 - 110} ${spessore + 110} L ${fm.larghezza / 2 - 180} ${spessore + 170} L ${fm.larghezza / 2 - 110} ${spessore + 230}`
              }
            />
          </g>
        </g>
      )}

      {/* Quota larghezza vano */}
      <g stroke={COLORE_QUOTA} strokeWidth={4} fill={COLORE_QUOTA}>
        <line x1={0} y1={-90} x2={0} y2={-30} />
        <line x1={fm.larghezza} y1={-90} x2={fm.larghezza} y2={-30} />
        <line x1={0} y1={-60} x2={fm.larghezza} y2={-60} />
        <text x={fm.larghezza / 2} y={-95} textAnchor="middle" fontSize={58} stroke="none" fontFamily="var(--font-mono, monospace)">
          {fm.larghezza}
        </text>
      </g>

      {/* Etichetta verso */}
      {!scorrevole && (
        <text
          x={fm.larghezza / 2}
          y={apreSotto ? spessore + raggio * 0.72 : -raggio * 0.62}
          textAnchor="middle"
          fontSize={60}
          fontWeight={700}
          fill={COLORE_TRATTO}
        >
          {r.ferramenta.descrizioneApertura.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

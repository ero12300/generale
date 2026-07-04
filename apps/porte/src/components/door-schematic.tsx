import type { ConfigurazionePorta, RisultatoPorta } from "@/lib/door-engine";

interface DoorSchematicProps {
  config: ConfigurazionePorta;
  risultato: RisultatoPorta;
  /** Mostra le linee di quota con le misure */
  quote?: boolean;
  className?: string;
}

/**
 * Prospetto frontale in scala, visto dal lato di apertura (cerniere visibili,
 * convenzione DIN): mano destra = cerniere a destra, maniglia a sinistra.
 */
export function DoorSchematic({ config, risultato, quote = true, className }: DoorSchematicProps) {
  const { giochi } = config;
  const margine = quote ? 160 : 40;
  const W = config.foroLarghezza;
  const H = config.foroAltezza;

  // Coordinate: origine in alto a sinistra del foro muro; y cresce verso il basso.
  const telaioX = giochi.ariaLaterale;
  const telaioY = giochi.ariaSuperiore;
  const telaioW = risultato.telaio.larghezza;
  const telaioH = risultato.telaio.altezza;

  const m = giochi.montanteTelaio;
  const t = giochi.traversoTelaio;

  const fissoSinistra = config.fissoPosizione === "sinistra" || config.fissoPosizione === "entrambi";
  const fissoDestra = config.fissoPosizione === "destra" || config.fissoPosizione === "entrambi";
  const fw = risultato.fisso?.larghezza ?? 0;

  // Zona anta (luce) in coordinate assolute
  const anteX = telaioX + m + (fissoSinistra ? fw + m : 0);
  const sopraluceH = risultato.sopraluce?.altezza ?? 0;
  const anteY = telaioY + t + (risultato.sopraluce ? sopraluceH + t : 0);
  const anteW = risultato.luceNetta.larghezza;
  const anteH = risultato.luceNetta.altezza;

  const cerniereADestra = risultato.latoCerniere === "destra";
  const strokeW = Math.max(2, W / 300);
  const font = Math.max(28, W / 22);

  const vetro = "#cfe3ea";
  const legno = "#e9ddc8";
  const telaioColore = "#8a8378";

  const quotaOffset1 = 70;
  const quotaOffset2 = 130;

  function QuotaOrizzontale({ x1, x2, y, label, livello = 1 }: { x1: number; x2: number; y: number; label: string; livello?: number }) {
    const qy = y + (livello === 1 ? quotaOffset1 : quotaOffset2);
    return (
      <g stroke="#5a6472" strokeWidth={strokeW / 1.5} fill="#5a6472">
        <line x1={x1} y1={y} x2={x1} y2={qy + 8} strokeDasharray="6 6" opacity={0.5} />
        <line x1={x2} y1={y} x2={x2} y2={qy + 8} strokeDasharray="6 6" opacity={0.5} />
        <line x1={x1} y1={qy} x2={x2} y2={qy} />
        <path d={`M ${x1} ${qy} l 14 -7 v 14 z`} stroke="none" />
        <path d={`M ${x2} ${qy} l -14 -7 v 14 z`} stroke="none" />
        <text x={(x1 + x2) / 2} y={qy - 10} textAnchor="middle" fontSize={font} stroke="none" fontWeight={600}>
          {label}
        </text>
      </g>
    );
  }

  function QuotaVerticale({ y1, y2, x, label, livello = 1 }: { y1: number; y2: number; x: number; label: string; livello?: number }) {
    const qx = x + (livello === 1 ? quotaOffset1 : quotaOffset2);
    return (
      <g stroke="#5a6472" strokeWidth={strokeW / 1.5} fill="#5a6472">
        <line x1={x} y1={y1} x2={qx + 8} y2={y1} strokeDasharray="6 6" opacity={0.5} />
        <line x1={x} y1={y2} x2={qx + 8} y2={y2} strokeDasharray="6 6" opacity={0.5} />
        <line x1={qx} y1={y1} x2={qx} y2={y2} />
        <path d={`M ${qx} ${y1} l -7 14 h 14 z`} stroke="none" />
        <path d={`M ${qx} ${y2} l -7 -14 h 14 z`} stroke="none" />
        <text
          x={qx + 14}
          y={(y1 + y2) / 2}
          fontSize={font}
          stroke="none"
          fontWeight={600}
          transform={`rotate(90 ${qx + 14} ${(y1 + y2) / 2})`}
          textAnchor="middle"
        >
          {label}
        </text>
      </g>
    );
  }

  // Maniglia: sul lato opposto alle cerniere, ad altezza ~1050 mm da terra
  const manigliaY = anteY + anteH - 1050;
  const manigliaX = cerniereADestra ? anteX + 90 : anteX + anteW - 90;

  // Cerniere: 3 sul lato mano
  const cernieraX = cerniereADestra ? anteX + anteW - 8 : anteX - 22;
  const cerniereY = [anteY + 150, anteY + anteH / 2, anteY + anteH - 150];

  // Arco di apertura (proiezione in pianta stilizzata sotto forma di arco tratteggiato)
  const pernoX = cerniereADestra ? anteX + anteW : anteX;
  const arcoFine = cerniereADestra ? anteX : anteX + anteW;

  return (
    <svg
      viewBox={`${-margine} ${-margine} ${W + margine * 2} ${H + margine * 2 + (quote ? 60 : 0)}`}
      role="img"
      aria-label={`Schema porta: anta ${risultato.anta.larghezza} per ${risultato.anta.altezza} millimetri, ${risultato.etichettaApertura}`}
      className={className}
    >
      {/* Muro */}
      <rect x={-margine} y={-margine} width={W + margine * 2} height={H + margine} fill="#efe9dd" />
      <rect x={0} y={0} width={W} height={H} fill="#fbfaf7" stroke="#3c4652" strokeWidth={strokeW} />

      {/* Pavimento */}
      <line x1={-margine} y1={H} x2={W + margine} y2={H} stroke="#3c4652" strokeWidth={strokeW * 1.5} />

      {/* Telaio */}
      <rect x={telaioX} y={telaioY} width={telaioW} height={telaioH} fill={telaioColore} />
      <rect x={telaioX + m} y={telaioY + t} width={telaioW - 2 * m} height={telaioH - t} fill="#fbfaf7" />

      {/* Sopraluce */}
      {risultato.sopraluce && (
        <g>
          <rect
            x={telaioX + m}
            y={telaioY + t}
            width={risultato.sopraluce.larghezza}
            height={sopraluceH}
            fill={vetro}
            stroke="#7d9aa6"
            strokeWidth={strokeW}
          />
          {/* Traverso sotto il sopraluce */}
          <rect x={telaioX + m} y={telaioY + t + sopraluceH} width={telaioW - 2 * m} height={t} fill={telaioColore} />
          {config.sopraluceTipo === "compasso" && (
            <g stroke="#31576b" strokeWidth={strokeW} fill="none">
              {/* Simbolo apertura a compasso: V tratteggiata con vertice sul lato incernierato */}
              <path
                d={`M ${telaioX + m} ${telaioY + t + sopraluceH} L ${telaioX + m + risultato.sopraluce.larghezza / 2} ${telaioY + t} L ${telaioX + m + risultato.sopraluce.larghezza} ${telaioY + t + sopraluceH}`}
                strokeDasharray="14 10"
              />
            </g>
          )}
        </g>
      )}

      {/* Fissi laterali */}
      {fissoSinistra && risultato.fisso && (
        <g>
          <rect x={telaioX + m} y={anteY} width={fw} height={anteH} fill={vetro} stroke="#7d9aa6" strokeWidth={strokeW} />
          <rect x={telaioX + m + fw} y={anteY} width={m} height={anteH} fill={telaioColore} />
          <text x={telaioX + m + fw / 2} y={anteY + anteH / 2} textAnchor="middle" fontSize={font * 0.9} fill="#31576b" fontWeight={600}>
            FISSO
          </text>
        </g>
      )}
      {fissoDestra && risultato.fisso && (
        <g>
          <rect
            x={telaioX + telaioW - m - fw}
            y={anteY}
            width={fw}
            height={anteH}
            fill={vetro}
            stroke="#7d9aa6"
            strokeWidth={strokeW}
          />
          <rect x={telaioX + telaioW - 2 * m - fw} y={anteY} width={m} height={anteH} fill={telaioColore} />
          <text
            x={telaioX + telaioW - m - fw / 2}
            y={anteY + anteH / 2}
            textAnchor="middle"
            fontSize={font * 0.9}
            fill="#31576b"
            fontWeight={600}
          >
            FISSO
          </text>
        </g>
      )}

      {/* Anta */}
      <rect
        x={anteX}
        y={anteY}
        width={anteW}
        height={anteH - giochi.giocoPavimento}
        fill={legno}
        stroke="#7a6a4f"
        strokeWidth={strokeW}
      />

      {/* Display vetrato verticale */}
      {config.vetroDisplay && (
        <rect
          x={cerniereADestra ? anteX + anteW * 0.62 : anteX + anteW * 0.14}
          y={anteY + anteH * 0.08}
          width={anteW * 0.24}
          height={anteH * 0.78}
          fill={vetro}
          stroke="#7d9aa6"
          strokeWidth={strokeW}
          rx={10}
        />
      )}

      {/* Oblò ovale */}
      {config.oblo && (
        <ellipse
          cx={anteX + anteW / 2}
          cy={anteY + anteH * 0.28}
          rx={Math.min(anteW * 0.18, 170)}
          ry={Math.min(anteH * 0.13, 260)}
          fill={vetro}
          stroke="#7d9aa6"
          strokeWidth={strokeW}
        />
      )}

      {/* Arco di apertura */}
      <path
        d={`M ${arcoFine} ${anteY + anteH} A ${anteW} ${anteW} 0 0 ${cerniereADestra ? 0 : 1} ${pernoX} ${anteY + anteH - anteW}`}
        fill="none"
        stroke="#9a7b1a"
        strokeWidth={strokeW}
        strokeDasharray="16 12"
        opacity={0.8}
      />

      {/* Cerniere */}
      {cerniereY.map((cy) => (
        <rect key={cy} x={cernieraX} y={cy} width={30} height={90} rx={8} fill="#4d5661" />
      ))}

      {/* Maniglia */}
      <g fill="#2f363d">
        <circle cx={manigliaX} cy={manigliaY} r={26} />
        <rect
          x={cerniereADestra ? manigliaX : manigliaX - 130}
          y={manigliaY - 13}
          width={130}
          height={26}
          rx={13}
        />
      </g>

      {/* Quote */}
      {quote && (
        <g>
          <QuotaOrizzontale x1={0} x2={W} y={H} label={`Foro muro ${W}`} livello={2} />
          <QuotaOrizzontale x1={anteX} x2={anteX + anteW} y={H} label={`Luce ${anteW}`} livello={1} />
          <QuotaVerticale y1={0} y2={H} x={W} label={`Foro muro ${H}`} livello={2} />
          <QuotaVerticale y1={anteY} y2={anteY + anteH} x={W} label={`Luce ${anteH}`} livello={1} />
        </g>
      )}
    </svg>
  );
}

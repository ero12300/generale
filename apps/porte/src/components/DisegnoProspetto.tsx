import type { ConfigurazionePorta, RisultatoCalcolo } from "@/lib/tipi";
import { TELAIO_ALTEZZA } from "@/lib/costanti";

interface Props {
  config: ConfigurazionePorta;
  risultato: RisultatoCalcolo;
}

const COLORE_ANTA = "#c89a68";
const COLORE_ANTA_SCURO = "#a97e4f";
const COLORE_SEMIFISSA = "#d9b98e";
const COLORE_FISSO = "#e7d7c2";
const COLORE_VETRO = "#bfe0f0";
const COLORE_TELAIO = "#8a6a45";
const COLORE_QUOTA = "#1d4ed8";
const COLORE_TRATTO = "#16212e";

function QuotaOrizzontale({
  x0,
  x1,
  y,
  testo,
}: {
  x0: number;
  x1: number;
  y: number;
  testo: string;
}) {
  return (
    <g stroke={COLORE_QUOTA} strokeWidth={4} fill={COLORE_QUOTA}>
      <line x1={x0} y1={y - 30} x2={x0} y2={y + 30} />
      <line x1={x1} y1={y - 30} x2={x1} y2={y + 30} />
      <line x1={x0} y1={y} x2={x1} y2={y} />
      <text
        x={(x0 + x1) / 2}
        y={y - 22}
        textAnchor="middle"
        fontSize={64}
        stroke="none"
        fontFamily="var(--font-mono, monospace)"
      >
        {testo}
      </text>
    </g>
  );
}

function QuotaVerticale({
  y0,
  y1,
  x,
  testo,
}: {
  y0: number;
  y1: number;
  x: number;
  testo: string;
}) {
  return (
    <g stroke={COLORE_QUOTA} strokeWidth={4} fill={COLORE_QUOTA}>
      <line x1={x - 30} y1={y0} x2={x + 30} y2={y0} />
      <line x1={x - 30} y1={y1} x2={x + 30} y2={y1} />
      <line x1={x} y1={y0} x2={x} y2={y1} />
      <text
        x={x + 26}
        y={(y0 + y1) / 2}
        textAnchor="middle"
        fontSize={64}
        stroke="none"
        fontFamily="var(--font-mono, monospace)"
        transform={`rotate(90 ${x + 26} ${(y0 + y1) / 2})`}
      >
        {testo}
      </text>
    </g>
  );
}

/**
 * Prospetto frontale quotato della porta, in scala reale (coordinate in mm).
 * Vista dal lato "a spingere" (lato cardini visibile).
 */
export function DisegnoProspetto({ config, risultato: r }: Props) {
  const fm = config.foroMuro;
  const scorrevole =
    config.modello === "scorrevole_scomparsa" || config.modello === "scorrevole_esterno";

  const margine = 320;
  const larghezzaTotale = fm.larghezza + margine * 2;
  const altezzaTotale = fm.altezza + margine * 2;

  // Telaio: esterno telaio centrato in larghezza, appoggiato al pavimento.
  const ex0 = (fm.larghezza - r.esternoTelaio.larghezza) / 2;
  const ey0 = fm.altezza - r.esternoTelaio.altezza;
  const pavimento = fm.altezza;
  const spallaTelaio = (r.esternoTelaio.larghezza - r.lucePassaggio.larghezza - (r.pannelloFisso ? r.pannelloFisso.larghezza : 0)) / 2;

  // Zona interna al telaio, da sinistra a destra: [fisso sx] [ante] [fisso dx].
  const internoX0 = ex0 + spallaTelaio;
  const fissoSx = r.pannelloFisso?.lato === "sinistra" ? r.pannelloFisso : null;
  const anteX0 = internoX0 + (fissoSx ? fissoSx.larghezza : 0);
  const larghezzaAnte = r.anta.larghezza + (r.antaSemifissa ? r.antaSemifissa.larghezza : 0);
  const antaY0 = pavimento - r.anta.altezza;

  // Anta apribile adiacente al lato cardini.
  const cardiniADestra = (r.ferramenta.latoCerniere ?? config.apertura.lato) === "destra";
  const antaX0 = r.antaSemifissa ? (cardiniADestra ? anteX0 + r.antaSemifissa.larghezza : anteX0) : anteX0;
  const antaX1 = antaX0 + r.anta.larghezza;
  const semifissaX0 = r.antaSemifissa ? (cardiniADestra ? anteX0 : anteX0 + r.anta.larghezza) : 0;

  const xCerniere = cardiniADestra ? antaX1 : antaX0;
  const xManiglia = cardiniADestra ? antaX0 + 60 : antaX1 - 60;
  const yManiglia = pavimento - r.ferramenta.altezzaManiglia;
  const centroAntaX = (antaX0 + antaX1) / 2;

  const quoteCerniere = [0.12, 0.5, 0.88].slice(0, 3);
  const yCerniere =
    r.ferramenta.numeroCerniere === 4
      ? [0.08, 0.38, 0.62, 0.92]
      : quoteCerniere;

  return (
    <svg
      viewBox={`${-margine} ${-margine} ${larghezzaTotale} ${altezzaTotale}`}
      role="img"
      aria-label={`Prospetto porta ${r.anta.larghezza} per ${r.anta.altezza} millimetri`}
      className="h-auto w-full"
    >
      {/* Muro attorno al foro */}
      <defs>
        <pattern id="muro" width={60} height={60} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={60} height={60} fill="#e8eaed" />
          <line x1={0} y1={0} x2={0} y2={60} stroke="#c8ccd2" strokeWidth={10} />
        </pattern>
      </defs>
      <path
        d={`M ${-margine + 40} ${-margine + 40} H ${fm.larghezza + margine - 40} V ${pavimento} H ${fm.larghezza} V 0 H 0 V ${pavimento} H ${-margine + 40} Z`}
        fill="url(#muro)"
        stroke="#9aa1ab"
        strokeWidth={6}
      />
      {/* Pavimento */}
      <line x1={-margine + 40} y1={pavimento} x2={fm.larghezza + margine - 40} y2={pavimento} stroke={COLORE_TRATTO} strokeWidth={10} />

      {/* Controtelaio (opera morta) = foro muro */}
      <rect x={0} y={0} width={fm.larghezza} height={fm.altezza} fill="#fdfdfd" stroke="#6b7280" strokeWidth={6} strokeDasharray="40 24" />

      {!scorrevole && (
        <>
          {/* Telaio */}
          <rect x={ex0} y={ey0} width={r.esternoTelaio.larghezza} height={r.esternoTelaio.altezza} fill={COLORE_TELAIO} stroke={COLORE_TRATTO} strokeWidth={6} />

          {/* Display / sopraluce vetrato */}
          {r.vetroDisplay && (
            <g>
              <rect
                x={internoX0}
                y={ey0 + TELAIO_ALTEZZA}
                width={fm.larghezza - internoX0 * 2}
                height={r.vetroDisplay.altezza}
                fill={COLORE_VETRO}
                stroke={COLORE_TRATTO}
                strokeWidth={5}
              />
              <text x={fm.larghezza / 2} y={ey0 + TELAIO_ALTEZZA + r.vetroDisplay.altezza / 2 + 20} textAnchor="middle" fontSize={56} fill="#20536b">
                DISPLAY {r.vetroDisplay.larghezza}×{r.vetroDisplay.altezza}
              </text>
            </g>
          )}

          {/* Fisso laterale */}
          {r.pannelloFisso && (
            <g>
              <rect
                x={fissoSx ? internoX0 : anteX0 + larghezzaAnte}
                y={antaY0}
                width={r.pannelloFisso.larghezza}
                height={r.pannelloFisso.altezza}
                fill={COLORE_FISSO}
                stroke={COLORE_TRATTO}
                strokeWidth={5}
              />
              <text
                x={(fissoSx ? internoX0 : anteX0 + larghezzaAnte) + r.pannelloFisso.larghezza / 2}
                y={antaY0 + r.pannelloFisso.altezza / 2}
                textAnchor="middle"
                fontSize={52}
                fill="#6b5335"
                transform={`rotate(-90 ${(fissoSx ? internoX0 : anteX0 + larghezzaAnte) + r.pannelloFisso.larghezza / 2} ${antaY0 + r.pannelloFisso.altezza / 2})`}
              >
                FISSO {r.pannelloFisso.larghezza}×{r.pannelloFisso.altezza}
              </text>
            </g>
          )}

          {/* Anta semifissa (bussola) */}
          {r.antaSemifissa && (
            <g>
              <rect x={semifissaX0} y={antaY0} width={r.antaSemifissa.larghezza} height={r.antaSemifissa.altezza} fill={COLORE_SEMIFISSA} stroke={COLORE_TRATTO} strokeWidth={5} />
              <text x={semifissaX0 + r.antaSemifissa.larghezza / 2} y={antaY0 + 140} textAnchor="middle" fontSize={52} fill="#7a5c39">
                SEMIFISSA
              </text>
            </g>
          )}

          {/* Anta apribile */}
          <rect x={antaX0} y={antaY0} width={r.anta.larghezza} height={r.anta.altezza} fill={COLORE_ANTA} stroke={COLORE_TRATTO} strokeWidth={7} />
          <rect x={antaX0 + 55} y={antaY0 + 55} width={r.anta.larghezza - 110} height={r.anta.altezza - 110} fill="none" stroke={COLORE_ANTA_SCURO} strokeWidth={4} />

          {/* Simbolo verso di apertura (V tratteggiata dai cardini alla maniglia) */}
          <g stroke={COLORE_TRATTO} strokeWidth={5} strokeDasharray="34 26" fill="none" opacity={0.75}>
            <line x1={xCerniere} y1={antaY0} x2={cardiniADestra ? antaX0 : antaX1} y2={antaY0 + r.anta.altezza / 2} />
            <line x1={xCerniere} y1={pavimento} x2={cardiniADestra ? antaX0 : antaX1} y2={antaY0 + r.anta.altezza / 2} />
            {config.modello === "ventola" && (
              <>
                <line x1={cardiniADestra ? antaX0 : antaX1} y1={antaY0} x2={xCerniere} y2={antaY0 + r.anta.altezza / 2} />
                <line x1={cardiniADestra ? antaX0 : antaX1} y1={pavimento} x2={xCerniere} y2={antaY0 + r.anta.altezza / 2} />
              </>
            )}
          </g>

          {/* Cerniere */}
          {yCerniere.map((frazione) => (
            <rect
              key={frazione}
              x={cardiniADestra ? xCerniere - 18 : xCerniere - 22}
              y={antaY0 + r.anta.altezza * frazione - 45}
              width={40}
              height={90}
              rx={10}
              fill="#3f4954"
            />
          ))}

          {/* Maniglia */}
          {r.ferramenta.latoManiglia && (
            <g>
              <circle cx={xManiglia} cy={yManiglia} r={26} fill="#2f3843" />
              <rect
                x={cardiniADestra ? xManiglia : xManiglia - 120}
                y={yManiglia - 14}
                width={120}
                height={28}
                rx={14}
                fill="#2f3843"
              />
            </g>
          )}

          {/* Oblò */}
          {r.oblo &&
            (r.oblo.forma === "tondo" ? (
              <circle
                cx={centroAntaX}
                cy={pavimento - r.oblo.altezzaCentro}
                r={r.oblo.dimensione / 2}
                fill={COLORE_VETRO}
                stroke={COLORE_TRATTO}
                strokeWidth={7}
              />
            ) : (
              <rect
                x={centroAntaX - r.oblo.dimensione / 2}
                y={pavimento - r.oblo.altezzaCentro - r.oblo.dimensione / 2}
                width={r.oblo.dimensione}
                height={r.oblo.dimensione}
                fill={COLORE_VETRO}
                stroke={COLORE_TRATTO}
                strokeWidth={7}
              />
            ))}

          {/* Etichetta misura anta */}
          <text x={centroAntaX} y={antaY0 + r.anta.altezza / 2 + 130} textAnchor="middle" fontSize={62} fontWeight={700} fill="#5c4426" fontFamily="var(--font-mono, monospace)">
            ANTA {r.anta.larghezza}×{r.anta.altezza}
          </text>
        </>
      )}

      {scorrevole && (
        <g>
          {/* Anta scorrevole a lato del vano */}
          {(() => {
            const antaScorrevoleX0 =
              config.apertura.lato === "destra"
                ? fm.larghezza - r.anta.larghezza / 2
                : -r.anta.larghezza / 2;
            const centroScorrevoleX = antaScorrevoleX0 + r.anta.larghezza / 2;
            return (
              <g>
                <rect
                  x={antaScorrevoleX0}
                  y={pavimento - r.anta.altezza}
                  width={r.anta.larghezza}
                  height={r.anta.altezza}
                  fill={COLORE_ANTA}
                  stroke={COLORE_TRATTO}
                  strokeWidth={7}
                  opacity={0.92}
                />
                {r.oblo &&
                  (r.oblo.forma === "tondo" ? (
                    <circle
                      cx={centroScorrevoleX}
                      cy={pavimento - r.oblo.altezzaCentro}
                      r={r.oblo.dimensione / 2}
                      fill={COLORE_VETRO}
                      stroke={COLORE_TRATTO}
                      strokeWidth={7}
                    />
                  ) : (
                    <rect
                      x={centroScorrevoleX - r.oblo.dimensione / 2}
                      y={pavimento - r.oblo.altezzaCentro - r.oblo.dimensione / 2}
                      width={r.oblo.dimensione}
                      height={r.oblo.dimensione}
                      fill={COLORE_VETRO}
                      stroke={COLORE_TRATTO}
                      strokeWidth={7}
                    />
                  ))}
              </g>
            );
          })()}
          {/* Freccia direzione scorrimento */}
          <g stroke={COLORE_TRATTO} strokeWidth={12} fill="none">
            <line x1={fm.larghezza / 2 - 200} y1={fm.altezza / 2} x2={fm.larghezza / 2 + 200} y2={fm.altezza / 2} />
            <path
              d={
                config.apertura.lato === "destra"
                  ? `M ${fm.larghezza / 2 + 120} ${fm.altezza / 2 - 80} L ${fm.larghezza / 2 + 200} ${fm.altezza / 2} L ${fm.larghezza / 2 + 120} ${fm.altezza / 2 + 80}`
                  : `M ${fm.larghezza / 2 - 120} ${fm.altezza / 2 - 80} L ${fm.larghezza / 2 - 200} ${fm.altezza / 2} L ${fm.larghezza / 2 - 120} ${fm.altezza / 2 + 80}`
              }
            />
          </g>
          <text x={fm.larghezza / 2} y={pavimento - r.anta.altezza / 2 + 200} textAnchor="middle" fontSize={62} fontWeight={700} fill="#5c4426" fontFamily="var(--font-mono, monospace)">
            ANTA {r.anta.larghezza}×{r.anta.altezza}
          </text>
        </g>
      )}

      {/* Quote foro muro */}
      <QuotaOrizzontale x0={0} x1={fm.larghezza} y={pavimento + 170} testo={`FORO MURO ${fm.larghezza}`} />
      <QuotaVerticale y0={0} y1={pavimento} x={fm.larghezza + 170} testo={`FORO MURO ${fm.altezza}`} />
      {!scorrevole && (
        <QuotaVerticale y0={antaY0} y1={pavimento} x={-170} testo={`ANTA ${r.anta.altezza}`} />
      )}
    </svg>
  );
}

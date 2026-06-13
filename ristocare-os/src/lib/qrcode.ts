import QRCode from "qrcode";

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function equipmentQrUrl(qrToken: string): string {
  return `${appUrl()}/q/${qrToken}`;
}

// Genera un QR code come data URL PNG (renderizzabile in <img>).
export async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#0b0f0e", light: "#ffffff" },
  });
}

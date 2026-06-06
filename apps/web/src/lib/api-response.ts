import { NextResponse } from "next/server";

export function validationError(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFoundError(message = "Risorsa non trovata") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function upstreamError(message: string) {
  return NextResponse.json({ error: message }, { status: 502 });
}

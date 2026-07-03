import type { BookingStatus, ClientTier, PaymentMethod } from "./types";

export const STATUS_LABEL: Record<BookingStatus, string> = {
  richiesta: "Richiesta",
  confermata: "Confermata",
  completata: "Completata",
  annullata: "Annullata",
  no_show: "No show",
};

export const STATUS_TONE: Record<BookingStatus, "gold" | "green" | "blue" | "red" | "gray"> = {
  richiesta: "gold",
  confermata: "blue",
  completata: "green",
  annullata: "gray",
  no_show: "red",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  contanti: "Contanti",
  carta: "Carta",
  app: "App/Online",
  non_pagato: "Da incassare",
};

export const TIER_LABEL: Record<ClientTier, string> = {
  nuovo: "Nuovo",
  abituale: "Abituale",
  vip: "VIP",
};

export const TIER_TONE: Record<ClientTier, "gray" | "blue" | "gold"> = {
  nuovo: "gray",
  abituale: "blue",
  vip: "gold",
};

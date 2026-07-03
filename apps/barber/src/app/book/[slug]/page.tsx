import { BookingPage } from "@/components/booking/booking-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  return <BookingPage slug={slug} />;
}

import prisma from "@/lib/prisma";
import StoreClient from "./components/StoreClient";

// High-resolution tech fallbacks
function getFallbackImage(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("headphone") || lower.includes("audio"))
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
  if (lower.includes("keyboard"))
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80";
  if (lower.includes("monitor") || lower.includes("screen"))
    return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80";
}

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map products with fallback images before passing to client
  const formattedProducts = products.map((p: any) => ({
    ...p,
    imageUrl: p.imageUrl || getFallbackImage(p.title || p.name || ""),
  }));

  return <StoreClient initialProducts={formattedProducts} />;
}
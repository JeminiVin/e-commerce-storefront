import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

function getFallbackImage(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("headphone") || lower.includes("audio"))
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
  if (lower.includes("keyboard"))
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80";
  if (lower.includes("monitor") || lower.includes("screen"))
    return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80";
}

async function addReview(formData: FormData) {
  "use server";
  const productId = formData.get("productId") as string;
  const author = formData.get("author") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const comment = formData.get("comment") as string;

  if (!productId || !author || !rating || !comment) return;

  await prisma.review.create({
    data: {
      productId,
      author,
      rating,
      comment,
    },
  });

  revalidatePath(`/product/${productId}`);
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const imageUrl = product.image || getFallbackImage(product.name || "");
  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-[#0a051b] text-white font-sans antialiased p-6 sm:p-12 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-700/30 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          ← Back to Storefront
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gradient-to-b from-purple-950/30 to-[#0d0722]/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-purple-950/50 border border-purple-900/50 relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-purple-900/60 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30">
                  In Stock • Ready to Ship
                </span>
                <span className="text-amber-400 text-sm font-bold flex items-center gap-1">
                  ★ {avgRating} <span className="text-slate-400 text-xs">({product.reviews.length} reviews)</span>
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-white mt-4">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-purple-300 mt-2">
                ${product.price}
              </p>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                {product.description ||
                  "High performance developer gear engineered for maximum efficiency, sleek aesthetics, and long-term durability."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-purple-900/40">
              <div className="text-xs text-slate-400 space-y-1.5 mb-6">
                <p>✓ Free Global Shipping on orders over $50</p>
                <p>✓ 30-Day Money-Back Guarantee</p>
                <p>✓ 24/7 Priority Developer Support</p>
              </div>
              <Link
                href="/"
                className="block text-center w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/40 transition-all active:scale-95"
              >
                Return to Store & Buy
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-gradient-to-b from-purple-950/30 to-[#0d0722]/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            Customer Reviews & Ratings ⭐
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Write Review Form */}
            <div className="bg-purple-950/30 border border-purple-900/50 p-5 rounded-2xl h-fit">
              <h3 className="text-sm font-bold text-purple-200 uppercase tracking-wider mb-3">
                Leave a Review
              </h3>
              <form action={addReview} className="space-y-3">
                <input type="hidden" name="productId" value={product.id} />

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="author"
                    required
                    placeholder="Vinayak Jaimini"
                    className="w-full bg-purple-950/50 border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Rating</label>
                  <select
                    name="rating"
                    defaultValue="5"
                    className="w-full bg-purple-950/50 border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5 Exceptional)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5 Great)</option>
                    <option value="3">⭐⭐⭐ (3/5 Average)</option>
                    <option value="2">⭐⭐ (2/5 Poor)</option>
                    <option value="1">⭐ (1/5 Bad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Review Comment</label>
                  <textarea
                    name="comment"
                    required
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full bg-purple-950/50 border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {product.reviews.length === 0 ? (
                <p className="text-slate-400 text-sm italic py-8 text-center bg-purple-950/20 rounded-2xl border border-dashed border-purple-900/40">
                  No reviews yet. Be the first developer to leave a review!
                </p>
              ) : (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-purple-950/20 border border-purple-900/40 p-4 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-white">{rev.author}</span>
                      <span className="text-amber-400 text-xs font-bold">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block mt-2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
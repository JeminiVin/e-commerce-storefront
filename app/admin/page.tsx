import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

// Server Actions for Add & Delete
async function addProduct(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as string;

  if (!name || !price) return;

  await prisma.product.create({
    data: {
      name,
      description: description || "High performance hardware component.",
      price,
      image: image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      stock: 10,
      category: "Hardware",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0a051b] text-white font-sans antialiased p-6 sm:p-12 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-purple-700/30 to-transparent blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-900/40">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard 🛠️</h1>
            <p className="text-sm text-slate-400 mt-1">Manage store inventory and add new hardware products</p>
          </div>
          <Link
            href="/"
            className="bg-purple-950/60 border border-purple-800/50 hover:bg-purple-900/60 text-purple-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            ← View Storefront
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="bg-gradient-to-b from-purple-950/30 to-[#0d0722]/80 border border-purple-800/40 rounded-3xl p-6 backdrop-blur-md shadow-2xl h-fit">
            <h2 className="text-lg font-bold mb-4 text-purple-200">Add New Product</h2>
            <form action={addProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Mechanical Keyboard"
                  className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  required
                  placeholder="149.99"
                  className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Enter product features..."
                  className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                Create Product +
              </button>
            </form>
          </div>

          {/* Product Inventory List */}
          <div className="lg:col-span-2 bg-gradient-to-b from-purple-950/30 to-[#0d0722]/80 border border-purple-800/40 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-purple-200">Existing Inventory ({products.length})</h2>
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {products.length === 0 ? (
                <p className="text-slate-400 text-center py-12">No products found in database.</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-purple-950/20 border border-purple-900/40 p-3.5 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-purple-800/40"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white">{product.name}</h4>
                        <p className="text-xs text-purple-300 font-semibold mt-0.5">${product.price}</p>
                      </div>
                    </div>

                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 text-xs px-3 py-1.5 rounded-xl transition-all active:scale-95 font-semibold"
                      >
                        Delete
                      </button>
                    </form>
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
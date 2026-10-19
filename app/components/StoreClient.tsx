"use client";
import { useState, createContext, useContext, ReactNode, FormEvent } from "react";
import Link from "next/link";

// --- TYPES ---
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  createdAt?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSuccessOpen: boolean;
  setIsSuccessOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSuccessOpen,
        setIsSuccessOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}

// --- ORDER SUCCESS MODAL ---
function SuccessModal() {
  const { isSuccessOpen, setIsSuccessOpen } = useStore();

  if (!isSuccessOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsSuccessOpen(false)} />
      <div className="relative bg-[#0d0722] border border-purple-800/60 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl z-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg shadow-emerald-500/30">
          ✓
        </div>
        <h3 className="text-2xl font-extrabold text-white">Order Placed Successfully!</h3>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          Thank you for your purchase. Your digital hardware order has been successfully confirmed.
        </p>
        <button
          onClick={() => setIsSuccessOpen(false)}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95"
        >
          Back to Storefront
        </button>
      </div>
    </div>
  );
}

// --- CHECKOUT MODAL ---
function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, setIsSuccessOpen, totalPrice, clearCart } = useStore();
  const [formData, setFormData] = useState({ name: "", email: "", address: "", card: "" });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    clearCart();
    setIsSuccessOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsCheckoutOpen(false)} />
      <div className="relative bg-[#0d0722] border border-purple-800/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl z-10 my-8">
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-4 mb-6">
          <h2 className="text-xl font-bold">Secure Checkout 💳</h2>
          <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Vinayak Jaimini"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="vinayak@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Shipping Address</label>
            <textarea
              required
              rows={2}
              placeholder="Enter your full street address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">Card Number (Simulated)</label>
            <input
              type="text"
              required
              placeholder="4242 •••• •••• 4242"
              value={formData.card}
              onChange={(e) => setFormData({ ...formData, card: e.target.value })}
              className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-base font-bold">
            <span>Total Amount:</span>
            <span className="text-purple-300 text-xl">${totalPrice.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/40 transition-all active:scale-95 mt-2"
          >
            Complete Order →
          </button>
        </form>
      </div>
    </div>
  );
}

// --- WISHLIST DRAWER ---
function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsWishlistOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d0722] border-l border-purple-950 p-6 flex flex-col justify-between text-white shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
              <h2 className="text-xl font-bold">Your Wishlist ❤️</h2>
              <button onClick={() => setIsWishlistOpen(false)} className="text-slate-400 hover:text-white text-lg px-2 py-1">✕</button>
            </div>

            <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {wishlist.length === 0 ? (
                <p className="text-slate-400 text-center py-12">No saved items in your wishlist.</p>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-purple-950/30 border border-purple-900/40 p-3 rounded-2xl gap-3">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-purple-800/40"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-purple-300 font-bold mt-0.5">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                      >
                        + Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(item)}
                        className="text-red-400 hover:text-red-300 text-xs p-1.5"
                      >
                        ✕
                      </button>
                    </div>
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

// --- CART DRAWER ---
function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, totalPrice, setIsCheckoutOpen } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d0722] border-l border-purple-950 p-6 flex flex-col justify-between text-white shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
              <h2 className="text-xl font-bold">Shopping Cart 🛒</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white text-lg px-2 py-1">✕</button>
            </div>

            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <p className="text-slate-400 text-center py-12">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-purple-950/30 border border-purple-900/40 p-3 rounded-2xl">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-purple-300 mt-0.5">${item.price} × {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-purple-900/40 pt-6">
            <div className="flex items-center justify-between text-base font-semibold mb-4">
              <span className="text-slate-300">Subtotal</span>
              <span className="text-2xl font-black text-purple-300">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/40 transition-all active:scale-95"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- STORE CONTENT ---
function StoreContent({ initialProducts }: { initialProducts: Product[] }) {
  const { addToCart, totalItems, setIsCartOpen, wishlist, toggleWishlist, isInWishlist, setIsWishlistOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(initialProducts.map((p) => p.category || "Hardware")))];

  // Filter products by search & category
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (product.category || "Hardware") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0a051b] text-white font-sans selection:bg-purple-500 selection:text-white antialiased overflow-x-hidden">
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <SuccessModal />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-700/30 via-indigo-600/20 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed top-96 right-0 w-[400px] h-[400px] bg-pink-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a051b]/70 border-b border-purple-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center font-black text-lg shadow-lg shadow-purple-600/40">
              H
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              STOREFRONT<span className="text-purple-400">.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm font-semibold text-purple-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/40"
            >
              Admin Panel 🛠️
            </Link>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/50 text-white text-sm font-semibold px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5"
            >
              <span>❤️</span>
              {wishlist.length > 0 && (
                <span className="bg-pink-500 text-white text-xs font-bold px-1.5 py-0.2 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>🛒 Cart</span>
              {totalItems > 0 && (
                <span className="bg-white text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Powered by AI & Next.js 16
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
          Your idea, online. <br />
          <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
            Made easy.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          One platform powered by Next.js & Prisma for everything you need to build, scale, and grow your modern store.
        </p>

        {/* Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto bg-purple-950/40 border border-purple-800/40 rounded-2xl p-2 backdrop-blur-md shadow-2xl flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <span className="text-purple-400 text-lg">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, hardware, gear..."
              className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
            />
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-purple-900/30 pb-6 mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Trending Hardware & Gear
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top picks fetched directly from your seeded database
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-purple-950/60 border border-purple-800/50 text-purple-200 text-xs font-semibold px-4 py-2 rounded-xl focus:outline-none focus:border-purple-500"
            >
              <option value="newest" className="bg-[#0d0722]">Newest Arrivals</option>
              <option value="price-low" className="bg-[#0d0722]">Price: Low to High</option>
              <option value="price-high" className="bg-[#0d0722]">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                  : "bg-purple-950/40 text-slate-300 border border-purple-800/40 hover:bg-purple-900/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-purple-950/20 rounded-3xl border border-dashed border-purple-800/40">
            <p className="text-slate-300 text-lg font-medium">No matching products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
              const favorited = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative bg-gradient-to-b from-purple-950/30 to-[#0d0722]/80 border border-purple-800/30 rounded-3xl overflow-hidden hover:border-purple-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/20 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <Link href={`/product/${product.id}`} className="h-56 w-full relative overflow-hidden bg-purple-950/50 block">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0722] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 bg-purple-900/80 backdrop-blur-md text-purple-200 text-[11px] font-bold px-3 py-1 rounded-full border border-purple-500/30">
                      {product.category || "Hardware"}
                    </span>
                  </Link>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-sm transition-transform active:scale-75 hover:bg-black/60"
                  >
                    {favorited ? "❤️" : "🤍"}
                  </button>

                  <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.description || "High performance developer gear engineered for maximum efficiency."}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-purple-900/30 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Price</span>
                        <span className="text-2xl font-black text-white tracking-tight">
                          ${product.price}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <span>Add to Cart</span>
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// --- EXPORTED DEFAULT WRAPPER ---
export default function StoreClient({ initialProducts }: { initialProducts: Product[] }) {
  return (
    <StoreProvider>
      <StoreContent initialProducts={initialProducts} />
    </StoreProvider>
  );
}
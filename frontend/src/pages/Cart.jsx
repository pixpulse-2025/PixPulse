import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { useAuth } from "../hooks/useAuth";
import {
    purchaseWithWallet,
    fetchWalletBalance,
    selectWalletBalance,
    selectPurchaseLoading,
    selectPurchaseSuccess,
    selectLastOrder,
    clearPurchaseSuccess,
} from "../redux/slices/walletSlice";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, total, loading, error } = useSelector((state) => state.cart);
    const walletBalance = useSelector(selectWalletBalance);
    const purchaseLoading = useSelector(selectPurchaseLoading);
    const purchaseSuccess = useSelector(selectPurchaseSuccess);
    const lastOrder = useSelector(selectLastOrder);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart());
            dispatch(fetchWalletBalance());
        }
    }, [dispatch, user]);

    // Redirect on successful purchase
    useEffect(() => {
        if (purchaseSuccess && lastOrder) {
            dispatch(clearPurchaseSuccess());
            dispatch(fetchCart()); // Refresh cart (will be empty)
            navigate("/my-purchases");
        }
    }, [purchaseSuccess, lastOrder, dispatch, navigate]);

    const handleWalletPurchase = () => {
        if (walletBalance < total) {
            alert(`Insufficient balance. You need $${total.toFixed(2)} but have $${walletBalance.toFixed(2)}. Please add funds to your wallet.`);
            return;
        }
        if (window.confirm(`Pay $${total.toFixed(2)} from your wallet?`)) {
            dispatch(purchaseWithWallet());
        }
    };

    const handleRemove = (itemId) => {
        if (window.confirm("Remove this item from your cart?")) {
            dispatch(removeFromCart(itemId));
        }
    };

    const handleClearCart = () => {
        if (window.confirm("Clear your entire cart?")) {
            dispatch(clearCart());
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-40 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/explore" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Shopping Cart
                            </h1>
                        </div>
                        <p className="text-base text-gray-400">
                            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-all"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-lg mb-6">
                        Error: {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="card-surface py-20 text-center">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
                        <p className="text-gray-400 mb-6">Looks like you haven't added anything yet</p>
                        <Link to="/explore" className="btn-primary inline-block">
                            Browse Artworks
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const artwork = item.artwork;
                                if (!artwork) return null;

                                return (
                                    <div key={item._id} className="card-surface p-6">
                                        <div className="flex gap-6">
                                            <Link
                                                to={`/artwork/${artwork._id}`}
                                                className="w-24 h-24 bg-[#141821] rounded-lg overflow-hidden flex-shrink-0"
                                            >
                                                {(() => {
                                                    const BASE_URL = "http://localhost:5000";
                                                    const hasValidPreview = artwork.previewUrl && !artwork.previewUrl.includes('default-preview');
                                                    const isImageFile = (url) => {
                                                        if (!url) return false;
                                                        const ext = url.split('.').pop().toLowerCase().split('?')[0];
                                                        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                                                    };

                                                    const mediaUrl = artwork.fileUrl ? `${BASE_URL}${artwork.fileUrl}` : null;

                                                    const coverUrl = hasValidPreview
                                                        ? `${BASE_URL}${artwork.previewUrl}`
                                                        : (mediaUrl && isImageFile(mediaUrl) ? mediaUrl : null);

                                                    return (
                                                        <img
                                                            src={coverUrl || `https://picsum.photos/400/400?random=${artwork._id}`}
                                                            alt={artwork.title}
                                                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                                                        />
                                                    );
                                                })()}
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <Link to={`/artwork/${artwork._id}`} className="block mb-2">
                                                    <h3 className="font-semibold text-white hover:text-[#8B5CF6] transition-colors truncate">
                                                        {artwork.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-400 mb-2">
                                                    by {artwork.artist?.name || 'Unknown Artist'}
                                                </p>
                                                <p className="text-lg font-bold text-white">
                                                    ${artwork.price?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors self-start"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card-surface p-6 sticky top-32">
                                <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Processing Fee</span>
                                        <span className="font-semibold">$0.00</span>
                                    </div>
                                    <div className="border-t border-white/5 pt-4">
                                        <div className="flex justify-between text-lg font-bold text-white">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet Payment */}
                                <div className="mb-4 flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        <span className="text-sm text-gray-400">Wallet Balance</span>
                                    </div>
                                    <span className={`text-sm font-bold tabular-nums ${walletBalance >= total ? 'text-emerald-400' : 'text-red-400'}`}>
                                        ${walletBalance.toFixed(2)}
                                    </span>
                                </div>

                                {walletBalance < total && (
                                    <Link
                                        to="/wallet"
                                        className="block mb-3 text-center text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                                    >
                                        + Add funds to your wallet
                                    </Link>
                                )}

                                <button
                                    onClick={handleWalletPurchase}
                                    disabled={purchaseLoading || walletBalance < total}
                                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                                >
                                    {purchaseLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            Pay ${total.toFixed(2)} with Wallet
                                        </>
                                    )}
                                </button>

                                <Link to="/explore" className="btn-secondary w-full text-center block">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;

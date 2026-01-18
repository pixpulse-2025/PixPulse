import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart, removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { useAuth } from "../hooks/useAuth";

const Cart = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { items, total, loading, error } = useSelector((state) => state.cart);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart());
        }
    }, [dispatch, user]);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Shopping Cart
                        </h1>
                        <p className="text-base text-gray-600 dark:text-gray-400">
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
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-6">
                        Error: {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="card-surface py-20 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added anything yet</p>
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
                                                className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                                            >
                                                <img
                                                    src={artwork.imageUrl ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `http://localhost:5000${artwork.imageUrl}`) : `https://picsum.photos/400/400?random=${artwork._id}`}
                                                    alt={artwork.title}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                                                />
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <Link to={`/artwork/${artwork._id}`} className="block mb-2">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-accent transition-colors truncate">
                                                        {artwork.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    by {artwork.artist?.name || 'Unknown Artist'}
                                                </p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
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
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Processing Fee</span>
                                        <span className="font-semibold">$0.00</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/checkout" className="btn-primary w-full text-center block mb-3">
                                    Proceed to Checkout
                                </Link>
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

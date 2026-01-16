import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart, removeFromCart, clearCart } from "../redux/slices/cartSlice";

const Cart = () => {
    const dispatch = useDispatch();
    const { items, total, loading, error } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = (itemId) => {
        if (window.confirm("Remove this item from cart?")) {
            dispatch(removeFromCart(itemId));
        }
    };

    const handleClearCart = () => {
        if (window.confirm("Clear all items from cart?")) {
            dispatch(clearCart());
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {items.length} {items.length === 1 ? 'item' : 'items'} in cart
                        </p>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="glass rounded-3xl p-16 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Discover amazing artworks and add them to your cart!
                        </p>
                        <Link
                            to="/marketplace"
                            className="inline-block px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
                        >
                            Browse Marketplace
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
                                    <div key={item._id} className="glass rounded-2xl overflow-hidden">
                                        <div className="md:flex">
                                            {/* Image */}
                                            <Link
                                                to={`/artwork/${artwork._id}`}
                                                className="md:w-48 h-48 md:h-auto bg-gray-200 dark:bg-gray-800 flex-shrink-0 block"
                                            >
                                                <img
                                                    src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                                    alt={artwork.title}
                                                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                                    onError={(e) => {
                                                        e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                                    }}
                                                />
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <Link to={`/artwork/${artwork._id}`}>
                                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 hover:text-primary-600 transition-colors">
                                                                {artwork.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                            {artwork.category} • {item.licenseType} License
                                                        </p>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <img
                                                                src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name}&background=random`}
                                                                alt={artwork.artist?.name}
                                                                className="w-6 h-6 rounded-full"
                                                            />
                                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                                {artwork.artist?.name || "Anonymous"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(item._id)}
                                                        className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        File Size: {artwork.fileSize ? `${(artwork.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        ${item.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass rounded-3xl p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                        <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                                        <span className="font-medium">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                        <span>Processing Fee</span>
                                        <span className="font-medium">$0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all mb-3">
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/marketplace"
                                    className="block w-full py-4 text-center border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        <span>🔒</span>
                                        <span>Secure checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        <span>✓</span>
                                        <span>Instant download</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>💳</span>
                                        <span>Money-back guarantee</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;

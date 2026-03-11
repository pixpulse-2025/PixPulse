import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchWalletBalance,
    depositFunds,
    selectWalletBalance,
    selectWalletTransactions,
    selectWalletLoading,
    selectDepositLoading,
    selectWalletError,
    clearError,
} from "../redux/slices/walletSlice";
import { useAuth } from "../hooks/useAuth";

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];

const Wallet = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const balance = useSelector(selectWalletBalance);
    const transactions = useSelector(selectWalletTransactions);
    const loading = useSelector(selectWalletLoading);
    const depositLoading = useSelector(selectDepositLoading);
    const error = useSelector(selectWalletError);

    const [customAmount, setCustomAmount] = useState("");
    const [password, setPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(fetchWalletBalance());
        }
    }, [dispatch, user]);

    const handleDeposit = async (amount) => {
        if (!password) return;
        const result = await dispatch(depositFunds({ amount, password }));
        if (depositFunds.fulfilled.match(result)) {
            setShowSuccess(true);
            setCustomAmount("");
            setPassword("");
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const handleCustomDeposit = (e) => {
        e.preventDefault();
        const amount = parseFloat(customAmount);
        if (amount > 0 && password) {
            handleDeposit(amount);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "deposit":
                return (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                );
            case "purchase":
                return (
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                );
            case "earning":
                return (
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                );
            case "refund":
                return (
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    </div>
                );
            case "admin_commission":
                return (
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 rounded-xl bg-gray-500/15 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" /></svg>
                    </div>
                );
        }
    };

    if (loading && !transactions.length) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-40 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[1200px] px-6">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Wallet</h1>
                    <p className="text-gray-400">Manage your funds and view transaction history</p>
                </div>

                {/* Success Banner */}
                {showSuccess && (
                    <div className="mb-6 px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-3 animate-fadeIn">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Funds added to your wallet successfully!
                    </div>
                )}

                {error && (
                    <div className="mb-6 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => dispatch(clearError())} className="text-red-400/60 hover:text-red-400">✕</button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Balance Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Main Balance */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 via-[#141821] to-indigo-600/20 border border-white/5 p-8">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Available Balance</p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-xs text-gray-400 font-medium">$</span>
                                    <span className="text-5xl font-bold text-white tabular-nums">
                                        {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-violet-300/60">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Test wallet — add funds below
                                </div>
                            </div>
                        </div>

                        {/* Quick Add Funds */}
                        <div className="rounded-2xl bg-[#141821] border border-white/5 p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Add Funds</h2>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {QUICK_AMOUNTS.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setCustomAmount(amount.toString())}
                                        disabled={depositLoading}
                                        className={`py-3 rounded-xl border font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 ${customAmount === amount.toString() ? 'bg-violet-500/20 border-violet-500/50 text-white' : 'bg-white/5 hover:bg-violet-500/20 border-white/5 hover:border-violet-500/30 text-white'}`}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleCustomDeposit} className="flex flex-col gap-3">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="Amount"
                                        min="1"
                                        max="10000"
                                        step="0.01"
                                        required
                                        className="w-full pl-7 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!customAmount || !password || depositLoading}
                                    className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                                >
                                    {depositLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Add Funds"
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-2xl bg-[#141821] border border-white/5 p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <Link
                                    to="/cart"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all group"
                                >
                                    <svg className="w-5 h-5 text-gray-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <span className="text-sm font-medium">View Cart</span>
                                </Link>
                                <Link
                                    to="/explore"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all group"
                                >
                                    <svg className="w-5 h-5 text-gray-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <span className="text-sm font-medium">Browse Artworks</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl bg-[#141821] border border-white/5">
                            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">Transaction History</h2>
                                <span className="text-xs text-gray-500 font-medium">{transactions.length} transactions</span>
                            </div>

                            {transactions.length === 0 ? (
                                <div className="py-16 text-center">
                                    <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-gray-500 font-medium">No transactions yet</p>
                                    <p className="text-gray-600 text-sm mt-1">Add funds or make a purchase to get started</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {transactions.map((tx) => (
                                        <div key={tx._id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                            {getTypeIcon(tx.type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {tx.description}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {formatTime(tx.createdAt)}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className={`text-sm font-bold tabular-nums ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-0.5 tabular-nums">
                                                    bal ${tx.balanceAfter?.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;

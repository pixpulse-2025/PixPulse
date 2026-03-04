/**
 * @file walletRoutes.js
 * @description Routes for wallet operations — balance, deposits, purchases, transactions.
 */

import express from "express";
import {
    getWalletBalance,
    depositFunds,
    purchaseWithWallet,
    getTransactions,
} from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All wallet routes require authentication
router.get("/balance", protect, getWalletBalance);
router.post("/deposit", protect, depositFunds);
router.post("/purchase", protect, purchaseWithWallet);
router.get("/transactions", protect, getTransactions);

export default router;

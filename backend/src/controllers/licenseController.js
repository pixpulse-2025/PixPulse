import PDFDocument from "pdfkit";
import License from "../models/License.js";
import Order from "../models/Order.js";

export const downloadLicense = async (req, res) => {
    const { orderId, artworkId } = req.params;

    // ── Step 1: Find order ─────────────────────────────────────────────
    let order;
    try {
        order = await Order.findOne({ _id: orderId, user: req.user._id });
    } catch (err) {
        console.error("❌ [License] findOrder failed:", err.message);
        return res.status(500).json({ success: false, message: "DB error finding order: " + err.message });
    }
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ── Step 2: Verify artwork is in the order ─────────────────────────
    const item = order.items.find((i) => i.artwork && i.artwork.toString() === artworkId);
    if (!item) {
        return res.status(404).json({ success: false, message: "Artwork not found in this order" });
    }

    // ── Step 3: Find or create license record ─────────────────────────
    let license;
    try {
        license = await License.findOne({ order: orderId, artwork: artworkId, user: req.user._id });
        if (!license) {
            license = await License.create({
                user: req.user._id,
                order: orderId,
                artwork: artworkId,
                buyerName: req.user.name || "Unknown",
                buyerEmail: req.user.email || "Unknown",
                productName: item.title || "Digital Product",
                orderIdString: order.orderNumber || `ORD-${orderId}`,
                licenseType: order.licenseType || "Personal",
            });
            console.log(`✅ [License] Created: ${license.licenseId}`);
        } else {
            console.log(`✅ [License] Found: ${license.licenseId}`);
        }
    } catch (err) {
        console.error("❌ [License] DB license error:", err.message);
        return res.status(500).json({ success: false, message: "DB error creating license: " + err.message });
    }

    // ── Step 4: Build PDF ──────────────────────────────────────────────
    try {
        const doc = new PDFDocument({ margin: 60, size: "A4" });
        const chunks = [];

        await new Promise((resolve, reject) => {
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", resolve);
            doc.on("error", reject);

            // Always use the specific item's licenseType as source of truth. Old orders have it here, not on the root order.
            const isCommercial = (item.licenseType || order.licenseType || license.licenseType) === "Commercial";
            console.log("DEBUG: isCommercial evaluated to", isCommercial, "item:", item.licenseType, "order:", order.licenseType, "license:", license.licenseType);

            // Header
            doc.rect(0, 0, doc.page.width, 85).fill("#1a0533");
            doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold")
                .text("PixPulse Digital Marketplace", 60, 18, { width: doc.page.width - 120, align: "center" });
            doc.fillColor("#a78bfa").fontSize(11).font("Helvetica")
                .text(isCommercial ? "Commercial License Agreement" : "Personal-Use License Agreement",
                    60, 45, { width: doc.page.width - 120, align: "center" });
            doc.fillColor("#7c5cbf").fontSize(9)
                .text("Automatically generated upon verified purchase.",
                    60, 63, { width: doc.page.width - 120, align: "center" });

            doc.moveDown(3.5);

            // Section 1: License Details
            doc.fillColor("#1a0533").fontSize(13).font("Helvetica-Bold").text("1. License Details");
            doc.moveDown(0.4);

            const purchaseDate = new Date(license.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
            });

            const details = [
                ["Buyer Name", String(license.buyerName)],
                ["Buyer Email", String(license.buyerEmail)],
                ["Product", String(license.productName)],
                ["Order ID", String(license.orderIdString)],
                ["Purchase Date", purchaseDate],
                ["License ID", String(license.licenseId)],
                ["License Key", String(license.licenseKey)],
                ["License Type", isCommercial ? "Commercial" : "Personal"],
                ["Issued By", String(license.platformName)],
            ];

            details.forEach(([label, value]) => {
                doc.fillColor("#5b21b6").font("Helvetica-Bold").fontSize(10)
                    .text(label + ": ", { continued: true });
                doc.fillColor("#333333").font("Helvetica")
                    .text(value);
                doc.moveDown(0.25);
            });

            doc.moveDown(1);

            // Section 2: Terms — differ by license type
            doc.fillColor("#1a0533").fontSize(13).font("Helvetica-Bold").text("2. Terms and Conditions");
            doc.moveDown(0.4);

            const terms = isCommercial ? [
                ["1. Grant of License",
                    "PixPulse grants the buyer a non-exclusive, worldwide, royalty-free commercial license to use this digital asset in commercial projects, client work, monetized videos, games, apps, websites, and other commercial media."],
                ["2. Permitted Uses",
                    "• You may use this asset for any commercial purpose, including advertising, client work, or monetized content\n• Use in monetized videos, games, apps, or digital media\n• Modification or adaptation of the asset for commercial purposes\n• Incorporation into derivative works distributed commercially"],
                ["3. Restrictions",
                    "• You may NOT resell, sublicense, or redistribute the original unmodified asset file\n• You may NOT upload this asset to any marketplace, asset library, or stock platform\n• You may NOT claim authorship or ownership of the original asset\n• Commercial use is permitted only as part of a new, derivative work — the raw file may not be sold as-is"],
                ["4. Ownership",
                    "All intellectual property rights, copyrights, and ownership of the original asset remain exclusively with PixPulse and/or the original creator. This license grants commercial usage rights only — it does not transfer ownership."],
                ["5. Termination",
                    "This license is immediately and automatically terminated if the buyer violates any of the restrictions above. Upon termination, the buyer must cease all use and destroy all copies of the asset in their possession."],
            ] : [
                ["1. Grant of License",
                    "PixPulse grants the buyer a non-exclusive, non-transferable license to use this digital asset for personal, non-commercial purposes only."],
                ["2. Permitted Uses",
                    "• Personal use, hobbies, and non-commercial creative projects\n• Private display or personal portfolio (non-monetized)\n• Educational or learning purposes (non-commercial)"],
                ["3. Restrictions",
                    "• You may NOT use this asset for any commercial purpose, including advertising, client work, or monetized content\n• You may NOT resell, sublicense, share, or redistribute the asset in any form\n• You may NOT use this asset in merchandise, products, or services offered for sale"],
                ["4. Ownership",
                    "All intellectual property rights, copyrights, and ownership of the original asset remain exclusively with PixPulse and/or the original creator. This license grants personal usage rights only — it does not transfer ownership."],
                ["5. Termination",
                    "This license is immediately and automatically terminated if the buyer violates any of the above terms. Upon termination, the buyer must cease all use and destroy all copies of the asset."],
            ];

            terms.forEach(([title, body]) => {
                doc.fillColor("#5b21b6").font("Helvetica-Bold").fontSize(10).text(title);
                // Split on \n to render each bullet on its own line
                const lines = body.split("\n");
                lines.forEach((line) => {
                    doc.fillColor("#444444").font("Helvetica").fontSize(10)
                        .text(line.trim(), { align: "justify" });
                });
                doc.moveDown(0.6);
            });

            // Footer
            doc.moveDown(1.5);
            doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).strokeColor("#d4b3ff").stroke();
            doc.moveDown(0.5);
            const genDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            doc.fillColor("#999999").fontSize(8).font("Helvetica")
                .text(`Generated by PixPulse on ${genDate}. For support, visit pixpulse.com.`, { align: "center" });
            doc.moveDown(0.4);
            doc.fillColor("#7c3aed").fontSize(10).font("Helvetica-Bold")
                .text("Thank you for supporting digital creators on PixPulse!", { align: "center" });

            doc.end();
        });

        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Length", pdfBuffer.length);
        res.setHeader("Content-Disposition", `attachment; filename="PixPulse-License-${license.licenseId}.pdf"`);
        return res.send(pdfBuffer);

    } catch (err) {
        console.error("❌ [License] PDF generation error:", err.message, err.stack);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "PDF generation failed: " + err.message });
        }
    }
};

const QRCode = require("qrcode");

/**
 * Generate QR Code for user vehicle
 * @param {String} userId
 * @param {String} plateNumber
 * @returns {String} QR Code (Base64)
 */
exports.generateUserQrCode = async (userId, plateNumber) => {
    try {
        // QR me jo data encode ho ga
        const qrData = JSON.stringify({
            userId,
            plateNumber,
            issuedAt: new Date().toISOString()
        });

        // Base64 QR code generate
        const qrCode = await QRCode.toDataURL(qrData);

        return qrCode;
    } catch (error) {
        console.error("QR Code Generation Error:", error);
        throw new Error("Failed to generate QR Code");
    }
};

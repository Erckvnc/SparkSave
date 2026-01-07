// Format currency (Philippine Peso)
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '₱0.00';
    return '₱' + Number(amount).toLocaleString('en-PH');
};

// Calculate percentage
export const calculatePercent = (saved, target) => {
    const s = parseFloat(saved) || 0;
    const t = parseFloat(target) || 1; // Avoid divide by zero
    if (t === 0) return 0;
    return Math.min(100, Math.round((s / t) * 100 * 10) / 10);
};

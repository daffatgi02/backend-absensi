const crypto = require('crypto');
const path = require('path');

class Helpers {
  // Generate random string
  static generateRandomString(length = 10) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Format date to Indonesian format
  static formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return d.toLocaleDateString('id-ID');
    }
  }

  // Format time to HH:MM
  static formatTime(time) {
    if (!time) return '';
    return time.substring(0, 5);
  }

  // Generate employee ID
  static generateEmployeeId(divisionCode, lastNumber = 0) {
    const nextNumber = String(lastNumber + 1).padStart(3, '0');
    return `${divisionCode}${nextNumber}`;
  }

  // Validate file type
  static validateFileType(filename, allowedTypes = ['jpg', 'jpeg', 'png', 'pdf']) {
    const ext = path.extname(filename).toLowerCase().substring(1);
    return allowedTypes.includes(ext);
  }

  // Calculate pagination
  static calculatePagination(page, limit, total) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;

    return {
      currentPage,
      itemsPerPage,
      totalPages,
      total,
      offset,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  }

  // Sanitize filename
  static sanitizeFilename(filename) {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }
}

module.exports = Helpers;
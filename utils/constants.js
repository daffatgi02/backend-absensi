const CONSTANTS = {
  ROLES: {
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
  },

  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    EARLY_LEAVE: 'early_leave'
  },

  REQUEST_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },

  ANNOUNCEMENT_TARGET: {
    ALL: 'all',
    DIVISION: 'division',
    INDIVIDUAL: 'individual'
  },

  ANNOUNCEMENT_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },

  ENTRY_EXIT_TYPE: {
    ENTRY: 'entry',
    EXIT: 'exit'
  },

  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['jpg', 'jpeg', 'png', 'pdf'],
    UPLOAD_PATH: './uploads/'
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  }
};

module.exports = CONSTANTS;
// User validation
const validateUser = (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  const isUpdate = req.method === 'PUT';
  const errors = [];

  // For POST, all fields are required. For PUT, only validate provided fields.
  if (!isUpdate) {
    if (!firstname || firstname.trim() === '') {
      errors.push('firstname is required');
    }
    if (!lastname || lastname.trim() === '') {
      errors.push('lastname is required');
    }
    if (!email || email.trim() === '') {
      errors.push('email is required');
    }
    if (!password || password.trim() === '') {
      errors.push('password is required');
    }
  }

  // Validate firstname if provided
  if (firstname !== undefined) {
    if (!firstname || firstname.trim() === '') {
      errors.push('firstname cannot be empty');
    } else if (/\d/.test(firstname)) {
      errors.push('firstname cannot contain numbers');
    }
  }

  // Validate lastname if provided
  if (lastname !== undefined) {
    if (!lastname || lastname.trim() === '') {
      errors.push('lastname cannot be empty');
    }
  }

  // Validate email if provided
  if (email !== undefined) {
    if (!email || email.trim() === '') {
      errors.push('email cannot be empty');
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('email must be a valid email address');
      }
    }
  }

  // Validate password if provided
  if (password !== undefined) {
    if (!password || password.trim() === '') {
      errors.push('password cannot be empty');
    } else if (password.length < 8) {
      errors.push('password must be at least 8 characters long');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Event validation (for POST - all fields required)
const validateEvent = (req, res, next) => {
  const { title, description, start_date, end_date, location, user_id } = req.body;
  const isUpdate = req.method === 'PUT';
  const errors = [];

  // For POST, all fields are required. For PUT, only validate provided fields.
  if (!isUpdate) {
    if (!title || title.trim() === '') {
      errors.push('title is required');
    } else if (title.trim().length < 3) {
      errors.push('title must be at least 3 characters long');
    }

    if (!start_date || start_date.trim() === '') {
      errors.push('start_date is required');
    }

    if (!end_date || end_date.trim() === '') {
      errors.push('end_date is required');
    }

    if (!location || location.trim() === '') {
      errors.push('location is required');
    }

    if (!user_id) {
      errors.push('user_id is required');
    }
  }

  // Validate title if provided
  if (title !== undefined) {
    if (!title || title.trim() === '') {
      errors.push('title cannot be empty');
    } else if (title.trim().length < 3) {
      errors.push('title must be at least 3 characters long');
    }
  }

  // Validate start_date if provided
  if (start_date !== undefined) {
    if (!start_date || start_date.trim() === '') {
      errors.push('start_date cannot be empty');
    } else {
      const startDate = new Date(start_date);
      if (isNaN(startDate.getTime())) {
        errors.push('start_date must be a valid date');
      } else if (!isUpdate) {
        // Only check past date for creation, not updates
        const now = new Date();
        if (startDate < now) {
          errors.push('start_date cannot be in the past');
        }
      }
    }
  }

  // Validate end_date if provided
  if (end_date !== undefined) {
    if (!end_date || end_date.trim() === '') {
      errors.push('end_date cannot be empty');
    } else {
      const endDate = new Date(end_date);
      if (isNaN(endDate.getTime())) {
        errors.push('end_date must be a valid date');
      } else {
        // Check if end_date is after start_date (if start_date is also provided)
        if (start_date !== undefined && start_date.trim() !== '') {
          const startDate = new Date(start_date);
          if (!isNaN(startDate.getTime()) && endDate <= startDate) {
            errors.push('end_date must be after start_date');
          }
        }
      }
    }
  }

  // Validate location if provided
  if (location !== undefined) {
    if (!location || location.trim() === '') {
      errors.push('location cannot be empty');
    } else if (location.trim().length < 3) {
      errors.push('location must be at least 3 characters long');
    }
  }

  // Validate user_id if provided
  if (user_id !== undefined && !user_id) {
    errors.push('user_id cannot be empty');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateUser, validateEvent };

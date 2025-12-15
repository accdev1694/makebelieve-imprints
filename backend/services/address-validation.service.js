/**
 * Address Validation Service
 * Validates address formats for different countries
 */

/**
 * Postal code regex patterns by country
 */
const POSTAL_CODE_PATTERNS = {
  GB: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, // UK: SW1A 1AA
  US: /^\d{5}(-\d{4})?$/, // USA: 12345 or 12345-6789
  CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, // Canada: K1A 0B1
  AU: /^\d{4}$/, // Australia: 2000
  NZ: /^\d{4}$/, // New Zealand: 1010
  DE: /^\d{5}$/, // Germany: 10115
  FR: /^\d{5}$/, // France: 75001
  IT: /^\d{5}$/, // Italy: 00100
  ES: /^\d{5}$/, // Spain: 28001
  NL: /^\d{4}\s?[A-Z]{2}$/i, // Netherlands: 1012 AB
  BE: /^\d{4}$/, // Belgium: 1000
  AT: /^\d{4}$/, // Austria: 1010
  CH: /^\d{4}$/, // Switzerland: 8000
  IE: /^[A-Z]\d{2}\s?[A-Z0-9]{4}$/i, // Ireland: D02 AF30
  PT: /^\d{4}-\d{3}$/, // Portugal: 1000-001
  PL: /^\d{2}-\d{3}$/, // Poland: 00-001
  SE: /^\d{3}\s?\d{2}$/, // Sweden: 123 45
  DK: /^\d{4}$/, // Denmark: 1000
  FI: /^\d{5}$/, // Finland: 00100
  NO: /^\d{4}$/, // Norway: 0001
  JP: /^\d{3}-\d{4}$/, // Japan: 100-0001
  KR: /^\d{5}$/, // South Korea: 12345
  CN: /^\d{6}$/, // China: 100000
  IN: /^\d{6}$/, // India: 110001
  BR: /^\d{5}-\d{3}$/, // Brazil: 01310-100
  MX: /^\d{5}$/, // Mexico: 01000
}

/**
 * Phone number regex patterns by country
 */
const PHONE_PATTERNS = {
  GB: /^(\+44|0)\s?\d{2,4}\s?\d{3,4}\s?\d{3,4}$/, // UK: +44 20 1234 5678
  US: /^(\+1|1)?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, // USA: (123) 456-7890
  CA: /^(\+1|1)?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, // Canada: same as US
  AU: /^(\+61|0)\s?\d{1}\s?\d{4}\s?\d{4}$/, // Australia: +61 4 1234 5678
  // Add more as needed
}

/**
 * Validate postal/zip code for a country
 */
const validatePostalCode = (postalCode, countryCode) => {
  if (!postalCode) {
    return { valid: false, message: 'Postal code is required' }
  }

  const country = countryCode?.toUpperCase()
  const pattern = POSTAL_CODE_PATTERNS[country]

  if (!pattern) {
    // No specific pattern for this country, accept any non-empty value
    return { valid: true }
  }

  const trimmed = postalCode.trim()
  const isValid = pattern.test(trimmed)

  return {
    valid: isValid,
    message: isValid ? undefined : `Invalid postal code format for ${country}`,
  }
}

/**
 * Validate phone number
 */
const validatePhone = (phone, countryCode) => {
  if (!phone) {
    return { valid: false, message: 'Phone number is required' }
  }

  const country = countryCode?.toUpperCase()
  const pattern = PHONE_PATTERNS[country]

  if (!pattern) {
    // Basic validation - just check it has digits
    const hasDigits = /\d{7,}/.test(phone)
    return {
      valid: hasDigits,
      message: hasDigits
        ? undefined
        : 'Phone number must contain at least 7 digits',
    }
  }

  const isValid = pattern.test(phone)

  return {
    valid: isValid,
    message: isValid ? undefined : `Invalid phone number format for ${country}`,
  }
}

/**
 * Validate complete address
 */
const validateAddress = (address) => {
  const errors = []
  const warnings = []

  // Required fields
  if (!address.firstName?.trim()) {
    errors.push('First name is required')
  }

  if (!address.lastName?.trim()) {
    errors.push('Last name is required')
  }

  if (!address.address1?.trim()) {
    errors.push('Street address is required')
  }

  if (!address.city?.trim()) {
    errors.push('City is required')
  }

  if (!address.country?.trim()) {
    errors.push('Country is required')
  }

  // Country-specific state/province validation
  const country = address.country?.toUpperCase()
  if (['US', 'CA', 'AU'].includes(country)) {
    if (!address.state?.trim()) {
      errors.push(`State/province is required for ${country}`)
    }
  }

  // Postal code validation
  if (address.postalCode) {
    const postalValidation = validatePostalCode(
      address.postalCode,
      address.country
    )
    if (!postalValidation.valid) {
      errors.push(postalValidation.message)
    }
  } else {
    errors.push('Postal code is required')
  }

  // Phone validation
  if (address.phone) {
    const phoneValidation = validatePhone(address.phone, address.country)
    if (!phoneValidation.valid) {
      errors.push(phoneValidation.message)
    }
  } else {
    errors.push('Phone number is required')
  }

  // Warnings for missing optional fields
  if (!address.address2?.trim()) {
    warnings.push('Address line 2 is empty (optional)')
  }

  // Check for suspicious patterns
  if (address.address1?.toLowerCase().includes('po box') && country === 'GB') {
    warnings.push('PO Box addresses may have delivery restrictions')
  }

  // Length validations
  if (address.firstName && address.firstName.length > 50) {
    errors.push('First name is too long (max 50 characters)')
  }

  if (address.lastName && address.lastName.length > 50) {
    errors.push('Last name is too long (max 50 characters)')
  }

  if (address.address1 && address.address1.length > 100) {
    errors.push('Address line 1 is too long (max 100 characters)')
  }

  if (address.city && address.city.length > 50) {
    errors.push('City is too long (max 50 characters)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Format address for display
 */
const formatAddress = (address) => {
  const lines = []

  // Name
  const fullName = [address.firstName, address.lastName]
    .filter(Boolean)
    .join(' ')
  if (fullName) lines.push(fullName)

  // Company (if exists)
  if (address.company?.trim()) lines.push(address.company)

  // Address lines
  if (address.address1?.trim()) lines.push(address.address1)
  if (address.address2?.trim()) lines.push(address.address2)

  // City, State, Postal Code
  const cityLine = [address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(', ')
  if (cityLine) lines.push(cityLine)

  // Country
  if (address.country?.trim()) lines.push(address.country)

  // Phone
  if (address.phone?.trim()) lines.push(`Phone: ${address.phone}`)

  return lines.join('\n')
}

/**
 * Normalize address (trim, uppercase postal code, etc.)
 */
const normalizeAddress = (address) => {
  return {
    firstName: address.firstName?.trim() || '',
    lastName: address.lastName?.trim() || '',
    company: address.company?.trim() || '',
    address1: address.address1?.trim() || '',
    address2: address.address2?.trim() || '',
    city: address.city?.trim() || '',
    state: address.state?.trim().toUpperCase() || '',
    postalCode: address.postalCode?.trim().toUpperCase() || '',
    country: address.country?.trim().toUpperCase() || '',
    phone: address.phone?.trim() || '',
  }
}

module.exports = {
  validateAddress,
  validatePostalCode,
  validatePhone,
  formatAddress,
  normalizeAddress,
  POSTAL_CODE_PATTERNS,
  PHONE_PATTERNS,
}

/**
 * Tax Calculation Service
 * Handles tax rate calculation based on shipping address
 */

// UK VAT rate (as of 2025)
const UK_VAT_RATE = 0.2 // 20%

// EU VAT rates (simplified - in production, use exact rates per country)
const EU_VAT_RATES = {
  IE: 0.23, // Ireland
  FR: 0.2, // France
  DE: 0.19, // Germany
  ES: 0.21, // Spain
  IT: 0.22, // Italy
  NL: 0.21, // Netherlands
  BE: 0.21, // Belgium
  AT: 0.2, // Austria
  PT: 0.23, // Portugal
  PL: 0.23, // Poland
  SE: 0.25, // Sweden
  DK: 0.25, // Denmark
  FI: 0.24, // Finland
}

/**
 * Calculate tax rate based on shipping address
 * @param {Object} address - Shipping address object
 * @param {string} address.country - Country code (ISO 2-letter)
 * @param {string} address.state - State/region
 * @param {string} address.postalCode - Postal/ZIP code
 * @returns {Object} Tax calculation result
 */
const calculateTaxRate = (address) => {
  const { country, state, postalCode } = address

  // Default result
  const result = {
    rate: 0,
    percentage: '0%',
    taxType: 'None',
    country: country || 'Unknown',
    taxableAmount: 0,
    taxAmount: 0,
  }

  if (!country) {
    return result
  }

  const countryCode = country.toUpperCase()

  // UK - Standard VAT
  if (countryCode === 'GB' || countryCode === 'UK') {
    result.rate = UK_VAT_RATE
    result.percentage = '20%'
    result.taxType = 'UK VAT'
    return result
  }

  // EU countries - VAT
  if (EU_VAT_RATES[countryCode]) {
    result.rate = EU_VAT_RATES[countryCode]
    result.percentage = `${(EU_VAT_RATES[countryCode] * 100).toFixed(0)}%`
    result.taxType = 'EU VAT'
    return result
  }

  // USA - State sales tax (simplified)
  if (countryCode === 'US') {
    const stateTaxRates = {
      CA: 0.0725, // California
      NY: 0.04, // New York (+ local)
      TX: 0.0625, // Texas
      FL: 0.06, // Florida
      IL: 0.0625, // Illinois
      PA: 0.06, // Pennsylvania
      OH: 0.0575, // Ohio
      // Add more states as needed
    }

    const stateCode = state?.toUpperCase()
    if (stateCode && stateTaxRates[stateCode]) {
      result.rate = stateTaxRates[stateCode]
      result.percentage = `${(stateTaxRates[stateCode] * 100).toFixed(2)}%`
      result.taxType = `${stateCode} Sales Tax`
      return result
    }

    // Default US tax if state not found
    result.rate = 0.0
    result.percentage = '0%'
    result.taxType = 'No Sales Tax'
    return result
  }

  // Canada - GST/HST (simplified)
  if (countryCode === 'CA') {
    const provinceTaxRates = {
      ON: 0.13, // Ontario - HST
      QC: 0.14975, // Quebec - GST + QST
      BC: 0.12, // British Columbia - GST + PST
      AB: 0.05, // Alberta - GST only
      NS: 0.15, // Nova Scotia - HST
      NB: 0.15, // New Brunswick - HST
      // Add more provinces as needed
    }

    const provinceCode = state?.toUpperCase()
    if (provinceCode && provinceTaxRates[provinceCode]) {
      result.rate = provinceTaxRates[provinceCode]
      result.percentage = `${(provinceTaxRates[provinceCode] * 100).toFixed(
        2
      )}%`
      result.taxType = `${provinceCode} Tax`
      return result
    }

    // Default to GST only
    result.rate = 0.05
    result.percentage = '5%'
    result.taxType = 'GST'
    return result
  }

  // Australia - GST
  if (countryCode === 'AU') {
    result.rate = 0.1
    result.percentage = '10%'
    result.taxType = 'GST'
    return result
  }

  // New Zealand - GST
  if (countryCode === 'NZ') {
    result.rate = 0.15
    result.percentage = '15%'
    result.taxType = 'GST'
    return result
  }

  // Other countries - no tax (for international shipping)
  result.rate = 0
  result.percentage = '0%'
  result.taxType = 'No Tax'
  return result
}

/**
 * Calculate tax amount for an order
 * @param {number} subtotal - Order subtotal
 * @param {Object} address - Shipping address
 * @returns {Object} Tax calculation with amount
 */
const calculateTax = (subtotal, address) => {
  const taxInfo = calculateTaxRate(address)

  const taxableAmount = parseFloat(subtotal)
  const taxAmount = taxableAmount * taxInfo.rate

  return {
    ...taxInfo,
    taxableAmount: parseFloat(taxableAmount.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
  }
}

/**
 * Validate if an address is within a taxable jurisdiction
 * @param {Object} address - Shipping address
 * @returns {boolean} Whether the address requires tax collection
 */
const isTaxable = (address) => {
  const taxInfo = calculateTaxRate(address)
  return taxInfo.rate > 0
}

module.exports = {
  calculateTaxRate,
  calculateTax,
  isTaxable,
  UK_VAT_RATE,
  EU_VAT_RATES,
}

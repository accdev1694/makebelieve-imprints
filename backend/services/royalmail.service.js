const axios = require('axios')

/**
 * Royal Mail Click and Drop API Integration
 * API Documentation: https://api.royalmail.net/shipping/v3/
 *
 * Services supported:
 * - UK Tracked 24/48
 * - Special Delivery
 * - International Standard/Tracked
 * - International Tracked & Signed
 */

class RoyalMailService {
  constructor() {
    this.baseURL =
      process.env.ROYALMAIL_API_URL || 'https://api.royalmail.net/shipping/v3'
    this.clientId = process.env.ROYALMAIL_CLIENT_ID
    this.clientSecret = process.env.ROYALMAIL_CLIENT_SECRET
    this.apiKey = process.env.ROYALMAIL_API_KEY
    this.accountNumber = process.env.ROYALMAIL_ACCOUNT_NUMBER

    // Cache for access token
    this.accessToken = null
    this.tokenExpiry = null
  }

  /**
   * Authenticate with Royal Mail API
   */
  async authenticate() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/oauth2/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-IBM-Client-Id': this.apiKey,
          },
        }
      )

      this.accessToken = response.data.access_token
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000

      return this.accessToken
    } catch (error) {
      console.error(
        'Royal Mail authentication error:',
        error.response?.data || error.message
      )
      throw new Error('Failed to authenticate with Royal Mail API')
    }
  }

  /**
   * Get available shipping services based on destination
   * @param {Object} params - { weight, dimensions, fromPostcode, toPostcode, toCountry }
   */
  async getShippingRates(params) {
    const { weight, dimensions, fromPostcode, toPostcode, toCountry } = params
    const isInternational = toCountry && toCountry !== 'GB'

    // Mock rates until API is configured
    if (!this.clientId || !this.apiKey) {
      return this.getMockShippingRates(isInternational)
    }

    try {
      const token = await this.authenticate()

      const response = await axios.post(
        `${this.baseURL}/rates`,
        {
          accountNumber: this.accountNumber,
          weight: weight || 100, // grams
          dimensions: dimensions || { length: 10, width: 10, height: 2 }, // cm
          fromPostcode,
          toPostcode,
          toCountry: toCountry || 'GB',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-IBM-Client-Id': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      )

      return this.formatShippingRates(response.data, isInternational)
    } catch (error) {
      console.error(
        'Royal Mail rates error:',
        error.response?.data || error.message
      )
      // Fallback to mock rates
      return this.getMockShippingRates(isInternational)
    }
  }

  /**
   * Create a shipment and generate label
   * @param {Object} orderData - Complete order information
   */
  async createShipment(orderData) {
    const {
      orderId,
      serviceCode,
      recipientAddress,
      senderAddress,
      parcels,
      customsDeclaration, // Required for international
    } = orderData

    if (!this.clientId || !this.apiKey) {
      throw new Error('Royal Mail API credentials not configured')
    }

    try {
      const token = await this.authenticate()

      const shipmentData = {
        accountNumber: this.accountNumber,
        orderReference: orderId,
        serviceCode,
        sender: this.formatAddress(senderAddress),
        recipient: this.formatAddress(recipientAddress),
        parcels: parcels.map((parcel) => ({
          weight: parcel.weight,
          dimensions: parcel.dimensions,
          contents: parcel.contents,
        })),
      }

      // Add customs declaration for international shipments
      if (customsDeclaration) {
        shipmentData.customsDeclaration = {
          categoryType: customsDeclaration.categoryType || 'MERCHANDISE',
          deliveryTerms: customsDeclaration.deliveryTerms || 'DDU',
          items: customsDeclaration.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            value: item.value,
            weight: item.weight,
            originCountryCode: 'GB',
            tariffCode: item.tariffCode,
          })),
        }
      }

      const response = await axios.post(
        `${this.baseURL}/shipments`,
        shipmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-IBM-Client-Id': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        trackingNumber: response.data.trackingNumber,
        labelUrl: response.data.labelUrl,
        shipmentId: response.data.shipmentId,
        estimatedDelivery: response.data.estimatedDelivery,
      }
    } catch (error) {
      console.error(
        'Royal Mail shipment creation error:',
        error.response?.data || error.message
      )
      throw new Error('Failed to create shipment with Royal Mail')
    }
  }

  /**
   * Track a shipment
   * @param {string} trackingNumber - Royal Mail tracking number
   */
  async trackShipment(trackingNumber) {
    if (!this.clientId || !this.apiKey) {
      return this.getMockTrackingData(trackingNumber)
    }

    try {
      const token = await this.authenticate()

      const response = await axios.get(
        `${this.baseURL}/tracking/${trackingNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-IBM-Client-Id': this.apiKey,
          },
        }
      )

      return this.formatTrackingData(response.data)
    } catch (error) {
      console.error(
        'Royal Mail tracking error:',
        error.response?.data || error.message
      )
      return this.getMockTrackingData(trackingNumber)
    }
  }

  /**
   * Get mock shipping rates (development/fallback)
   */
  getMockShippingRates(isInternational) {
    if (isInternational) {
      return [
        {
          id: 'RM_INTL_STANDARD',
          serviceCode: 'INTL_STD',
          name: 'Royal Mail International Standard',
          description: 'Untracked international delivery in 5-7 working days',
          price: 8.5,
          estimatedDays: '5-7 working days',
          tracked: false,
        },
        {
          id: 'RM_INTL_TRACKED',
          serviceCode: 'INTL_TRK',
          name: 'Royal Mail International Tracked',
          description: 'Tracked international delivery in 3-5 working days',
          price: 15.5,
          estimatedDays: '3-5 working days',
          tracked: true,
        },
        {
          id: 'RM_INTL_SIGNED',
          serviceCode: 'INTL_SGN',
          name: 'Royal Mail International Tracked & Signed',
          description:
            'Tracked and signed international delivery in 3-5 working days',
          price: 18.95,
          estimatedDays: '3-5 working days',
          tracked: true,
          signature: true,
        },
      ]
    }

    return [
      {
        id: 'RM_48',
        serviceCode: 'TRK48',
        name: 'Royal Mail Tracked 48',
        description: 'Tracked delivery in 2-3 working days',
        price: 3.35,
        estimatedDays: '2-3 working days',
        tracked: true,
      },
      {
        id: 'RM_24',
        serviceCode: 'TRK24',
        name: 'Royal Mail Tracked 24',
        description: 'Tracked next day delivery',
        price: 5.65,
        estimatedDays: '1 working day',
        tracked: true,
      },
      {
        id: 'RM_SD_9AM',
        serviceCode: 'SD9',
        name: 'Special Delivery Guaranteed by 9am',
        description: 'Guaranteed delivery by 9am next working day',
        price: 22.25,
        estimatedDays: 'Next day by 9am',
        tracked: true,
        signature: true,
      },
      {
        id: 'RM_SD_1PM',
        serviceCode: 'SD1',
        name: 'Special Delivery Guaranteed by 1pm',
        description: 'Guaranteed delivery by 1pm next working day',
        price: 8.25,
        estimatedDays: 'Next day by 1pm',
        tracked: true,
        signature: true,
      },
    ]
  }

  /**
   * Format address for Royal Mail API
   */
  formatAddress(address) {
    return {
      fullName: `${address.firstName} ${address.lastName}`,
      companyName: address.company || '',
      addressLine1: address.street,
      addressLine2: address.street2 || '',
      city: address.city,
      county: address.state || address.county || '',
      postcode: address.zipCode || address.postcode,
      countryCode: address.country || 'GB',
      phoneNumber: address.phone || '',
      emailAddress: address.email || '',
    }
  }

  /**
   * Format shipping rates response
   */
  formatShippingRates(data, isInternational) {
    // Transform Royal Mail API response to our format
    return data.services.map((service) => ({
      id: service.serviceCode,
      serviceCode: service.serviceCode,
      name: service.serviceName,
      description: service.description,
      price: parseFloat(service.price),
      estimatedDays: service.estimatedDeliveryDays,
      tracked: service.tracked,
      signature: service.signatureRequired,
    }))
  }

  /**
   * Format tracking data response
   */
  formatTrackingData(data) {
    return {
      trackingNumber: data.trackingNumber,
      status: data.status,
      statusDescription: data.statusDescription,
      estimatedDelivery: data.estimatedDelivery,
      events: data.events.map((event) => ({
        date: event.timestamp,
        location: event.location,
        status: event.status,
        description: event.description,
      })),
    }
  }

  /**
   * Mock tracking data (development/fallback)
   */
  getMockTrackingData(trackingNumber) {
    return {
      trackingNumber,
      status: 'IN_TRANSIT',
      statusDescription: 'Your item is on its way',
      estimatedDelivery: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      events: [
        {
          date: new Date().toISOString(),
          location: 'National Distribution Centre',
          status: 'IN_TRANSIT',
          description: 'Item in transit',
        },
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: 'Local Delivery Office',
          status: 'COLLECTED',
          description: 'Item collected',
        },
      ],
    }
  }
}

module.exports = new RoyalMailService()

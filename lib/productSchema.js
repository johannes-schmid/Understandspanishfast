const SELLING_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'US', 'CA', 'AU', 'NZ', 'CH', 'NO', 'IS', 'MX', 'AR', 'CO', 'CL', 'PE',
  'BR', 'IN', 'SG', 'ZA', 'IL', 'JP', 'KR', 'AE', 'PH', 'TR',
]

export const REFUND_DAYS = 14

export const returnPolicy = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: SELLING_COUNTRIES,
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: REFUND_DAYS,
  returnFees: 'https://schema.org/FreeReturn',
  refundType: 'https://schema.org/FullRefund',
  merchantReturnLink: 'https://mostcommonspanish.com/terms#refunds',
}

const instantDelivery = {
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'EUR' },
  shippingDestination: SELLING_COUNTRIES.map((c) => ({ '@type': 'DefinedRegion', addressCountry: c })),
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
  },
}

export function productSchema({ name, description, image, sku, price, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    brand: { '@type': 'Brand', name: 'Most Common Spanish' },
    offers: {
      '@type': 'Offer',
      url,
      price: (price / 100).toFixed(2),
      priceCurrency: 'EUR',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: instantDelivery,
      hasMerchantReturnPolicy: returnPolicy,
    },
  }
}

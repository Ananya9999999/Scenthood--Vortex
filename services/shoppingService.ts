
/**
 * Modular service for managing brand URLs and shopping navigation.
 * This simulates the 'backend division' requirement for modular URL generation.
 */

export const getBrandOfficialUrl = (brandName: string, perfumeName: string): string => {
  const query = encodeURIComponent(`${brandName} ${perfumeName} official website`);
  return `https://www.google.com/search?q=${query}&btnI=1`;
};

export const getFlipkartUrl = (brandName: string, perfumeName: string): string => {
  const query = encodeURIComponent(`${brandName} ${perfumeName} perfume`);
  return `https://www.flipkart.com/search?q=${query}`;
};

export const getAmazonUrl = (brandName: string, perfumeName: string): string => {
  const query = encodeURIComponent(`${brandName} ${perfumeName} perfume`);
  return `https://www.amazon.in/s?k=${query}`;
};

export const formatPrice = (price: number, currencyCode: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
};

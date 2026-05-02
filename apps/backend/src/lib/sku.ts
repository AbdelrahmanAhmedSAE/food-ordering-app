export default function generateSku(
  productName: string,
  variantName: string,
  index: number = 1,
): string {
  const namePart = productName
    .toUpperCase()
    .replace(/\s+/g, '-')
    // eslint-disable-next-line no-useless-escape
    .replace(/[^A-Z0-9\-]/g, '');

  const variantPart = variantName.charAt(0).toUpperCase(); // S, M, L
  const indexPart = index.toString().padStart(3, '0'); // 001, 002, ...

  return `${namePart}-${variantPart}-${indexPart}`;
}

/**
 * Returns: size of the string in bytes.
 */
function getByteSize(text: string) {
  return new TextEncoder().encode(text).length;
}

export default getByteSize;

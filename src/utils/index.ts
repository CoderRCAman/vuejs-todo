export function isSameCordinatesArray(first: any[], second: any[]) {
  if (first === second) return true;
  if (first == null || second == null) return false;
  if (first.length !== second.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < first.length; ++i) {
    if (first[i].lat !== second[i].lat) return false;
    if (first[i].lng !== second[i].lng) return false;
  }
  return true;
}

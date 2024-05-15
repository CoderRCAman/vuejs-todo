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

export function getRandomColor(): string {
  return "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
}

export function ifPolygonsIntersect(
  zone1: google.maps.Polygon,
  zone2: google.maps.Polygon
) { 
  console.log(zone1,zone2)
  if (!zone1 || !zone2) return alert("Something went wrong!");
  const path1 = zone1.getPath().getArray();
  const path2 = zone2.getPath().getArray();
  if (
    path1.some((path) =>
      google.maps.geometry.poly.containsLocation(path, zone2)
    )
  )
    return true;
  if (
    path2.some((path) =>
      google.maps.geometry.poly.containsLocation(path, zone1)
    )
  )
    return true;
  return false;
}

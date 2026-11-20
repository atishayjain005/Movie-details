import {normalizeMovie, releaseDate, safeMediaUrl} from "./movieData";
test("handles partial and malformed records", () => {
  expect(normalizeMovie(null,0)).toBeNull();
  expect(normalizeMovie([],0)).toBeNull();
  expect(normalizeMovie({title:{bad:true}},0)).toMatchObject({title:"Untitled movie",director:"Not available",runtime:"Runtime not available"});
});
test("formats metadata and Unix timestamps", () => {
  expect(normalizeMovie({director:["One",null,"Two"],runTime:120},0)).toMatchObject({director:"One, Two",runtime:"120 mins"});
  expect(releaseDate(1656633600)).toBe("Jul 01, 2022");
  expect(releaseDate(1656633600000)).toBe("Jul 01, 2022");
  expect(releaseDate(null)).toBe("Not available");
  expect(releaseDate("broken")).toBe("Not available");
});
test("rejects insecure and executable media URLs", () => {
  for (const url of ["javascript:alert(1)","data:image/svg+xml,foo","http://example.com",null]) expect(safeMediaUrl(url)).toBeNull();
  expect(safeMediaUrl("https://example.com/a.jpg")).toBe("https://example.com/a.jpg");
});

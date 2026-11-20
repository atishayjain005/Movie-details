import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

beforeEach(() => { global.fetch = jest.fn(() => new Promise(() => {})); });
test.each(["/", "/dashboard"])("%s loads movie browsing", (path) => {
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  expect(fetch).toHaveBeenCalled();
});
test("unknown route offers recovery and brand navigation preserves storage", () => {
  localStorage.setItem("unrelated", "keep");
  render(<MemoryRouter initialEntries={["/missing"]}><App /></MemoryRouter>);
  expect(screen.getByRole("heading", {name: "Page not found"})).toBeTruthy();
  fireEvent.click(screen.getByRole("link", {name: "GeekSynergy"}));
  expect(localStorage.getItem("unrelated")).toBe("keep");
  expect(fetch).toHaveBeenCalled();
});

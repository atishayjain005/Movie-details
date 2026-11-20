import {render, screen, fireEvent, act} from "@testing-library/react";
import DashboardContent from "./DashboardContent";

afterEach(() => jest.useRealTimers());
test("announces loading and empty results; sends JSON", async () => {
  global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => ({result: []})});
  render(<DashboardContent />);
  expect(screen.getByRole("status").textContent).toMatch(/Loading/);
  expect(await screen.findByText(/No movies/)).toBeTruthy();
  expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe("application/json");
});
test.each([{ok:false}, {ok:true, json:async () => ({result:null})}])("errors recover on retry", async (response) => {
  global.fetch = jest.fn().mockResolvedValueOnce(response).mockResolvedValue({ok:true,json:async () => ({result:[]})});
  render(<DashboardContent />);
  expect(await screen.findByRole("alert")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", {name:"Try again"}));
  expect(await screen.findByText(/No movies/)).toBeTruthy();
});
test("times out and cancels on unmount", async () => {
  jest.useFakeTimers();
  let signal;
  global.fetch = jest.fn((url, options) => new Promise((resolve, reject) => {
    signal = options.signal;
    signal.addEventListener("abort", () => reject(new Error("aborted")));
  }));
  const view = render(<DashboardContent />);
  await act(async () => jest.advanceTimersByTime(10000));
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(signal.aborted).toBe(true);
  fireEvent.click(screen.getByRole("button", {name:"Try again"}));
  view.unmount();
  expect(signal.aborted).toBe(true);
});

test("renders incomplete records without crashing or interactive fake trailers", async () => {
  global.fetch = jest.fn().mockResolvedValue({ok:true,json:async () => ({result:[null,{title:"A movie",runTime:90,director:["One","Two"]},{}]})});
  render(<DashboardContent />);
  expect(await screen.findByRole("heading",{name:"A movie"})).toBeTruthy();
  expect(screen.getByText("One, Two")).toBeTruthy();
  expect(screen.getByText(/90 mins/)).toBeTruthy();
  expect(screen.queryByRole("button",{name:"Watch Trailer"})).toBeNull();
});

import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";

export function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

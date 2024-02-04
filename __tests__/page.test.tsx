import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "../app/page";

it("Page", () => {
    render(<HomePage />);
    expect(screen.getByText("Hello world")).toBeDefined();
});

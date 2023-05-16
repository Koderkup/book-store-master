import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer component", () => {
  it("should render without errors", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should display correct information", () => {
    render(<Footer />);
    expect(
      screen.getByText("Мы являемся поставщиками интересных книг по всему городу.")
    ).toBeInTheDocument();
    expect(screen.getByText(/\+375 \(25\) 772-93-44/i)).toBeInTheDocument();
  });

  it("should have social media links", () => {
    render(<Footer />);
    expect(screen.getByTitle("Viber")).toHaveAttribute(
      "href",
      "viber://chat?number=375257729344"
    );
    expect(screen.getByTitle("Telegram")).toHaveAttribute(
      "href",
      "https://telegram.me/koderkup"
    );
    expect(screen.getByTitle("Instagram")).toHaveAttribute(
      "href",
      "https://instagram.com/koderkup/"
    );
  });

  it("should have headings", () => {
    render(<Footer />);
    expect(screen.getByText("О нас")).toBeInTheDocument();
    expect(screen.getByText("Контакты")).toBeInTheDocument();
  });

  it("should display email address", () => {
    render(<Footer />);
    expect(screen.getByText(/itlearn.ku@gmail.com/i)).toBeInTheDocument();
  });

  it("should display correct address", () => {
    render(<Footer />);
    expect(
      screen.getByText("Наш адрес: ул. В.Интернационалистов, д. 7, г. Витебск")
    ).toBeInTheDocument();
  });
});

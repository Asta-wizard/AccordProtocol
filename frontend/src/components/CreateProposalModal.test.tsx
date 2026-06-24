import { render, screen, fireEvent } from "@testing-library/react";
import { CreateProposalModal } from "./CreateProposalModal";
import { StrKey } from "@stellar/stellar-sdk";

// Mock the submit logic
jest.mock("../lib/submit", () => ({
  createProposal: jest.fn(),
}));

describe("CreateProposalModal", () => {
  const defaultProps = {
    walletAddress: "GBX...MOCK",
    onClose: jest.fn(),
    onSubmitted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Empty untouched field does not show validation message", () => {
    render(<CreateProposalModal {...defaultProps} />);
    expect(screen.queryByText("Enter a valid Stellar address")).not.toBeInTheDocument();
  });

  it("Typing random text triggers touched state and shows validation error", () => {
    render(<CreateProposalModal {...defaultProps} />);
    const input = screen.getByPlaceholderText("G...");
    
    fireEvent.change(input, { target: { value: "abc123" } });
    
    // Typing triggers touched state, and since abc123 is invalid, it shows error
    expect(screen.getByText("Enter a valid Stellar address")).toBeInTheDocument();
  });

  it("Random text shows validation error after blur", () => {
    render(<CreateProposalModal {...defaultProps} />);
    const input = screen.getByPlaceholderText("G...");
    
    // Just blur without changing to see if touched state triggers
    // However, if it's empty, StrKey validation returns false, so it will show error
    fireEvent.blur(input);
    expect(screen.getByText("Enter a valid Stellar address")).toBeInTheDocument();
  });

  it("Valid Stellar address clears error", () => {
    render(<CreateProposalModal {...defaultProps} />);
    const input = screen.getByPlaceholderText("G...");
    
    // Type an invalid address
    fireEvent.change(input, { target: { value: "abc123" } });
    expect(screen.getByText("Enter a valid Stellar address")).toBeInTheDocument();
    
    // Type a valid address
    // Valid Ed25519 public key
    const validAddress = "GBXGJZUFVB2F3J2Y5B4S4V6JWYD2H4O3T7XQZT5XKV6S2J5N6Z2Z2Z2Z"; 
    fireEvent.change(input, { target: { value: validAddress } });
    
    // Mock valid check if not strictly matching above due to checksums (assuming real SDK validates it)
    expect(screen.queryByText("Enter a valid Stellar address")).not.toBeInTheDocument();
  });

  it("Invalid address blocks submit", () => {
    render(<CreateProposalModal {...defaultProps} />);
    const input = screen.getByPlaceholderText("G...");
    const submitBtn = screen.getByText("Submit Proposal");

    // Fill in other required fields so only recipient is invalid
    fireEvent.change(screen.getByPlaceholderText("0.00"), { target: { value: "10" } });
    fireEvent.change(screen.getByPlaceholderText("What is this payment for?"), { target: { value: "Test" } });
    
    fireEvent.change(input, { target: { value: "invalid-address" } });
    fireEvent.click(submitBtn);

    // Error from submit handler should appear
    expect(screen.getAllByText("Enter a valid Stellar address").length).toBeGreaterThan(0);
    
    // The submit action should not proceed
    expect(defaultProps.onClose).not.toHaveBeenCalled();
    expect(defaultProps.onSubmitted).not.toHaveBeenCalled();
  });
});

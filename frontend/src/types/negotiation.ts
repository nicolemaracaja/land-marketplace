export type NegotiationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED";

export type Negotiation = {
  id: number;
  landName: string;
  landPrice: number;
  offer: number;
  person: string;
  status: NegotiationStatus;
  type: "received" | "sent";
};

export type NegotiationRequest = {
  landId: number;
  offer: number;
};
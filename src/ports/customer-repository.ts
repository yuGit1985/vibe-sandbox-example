export type CustomerStatus = "active" | "follow-up" | "inactive";

export type CustomerNote = {
  id: string;
  body: string;
  createdAt: string;
  author: string;
};

export type Customer = {
  id: string;
  name: string;
  kana: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  status: CustomerStatus;
  lastContactedAt: string;
  registeredAt: string;
  avatarTone: "coral" | "blue" | "green" | "purple" | "amber";
  notes: CustomerNote[];
};

export interface CustomerRepository {
  list(): Promise<Customer[]>;
}

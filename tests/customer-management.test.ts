import { describe, expect, it } from "vitest";
import { prepareNote } from "@/inputs/prepare-note";
import type { Customer } from "@/ports/customer-repository";
import { addCustomerNote } from "@/usecases/add-customer-note";
import { searchCustomers } from "@/usecases/search-customers";

const customer: Customer = {
  id: "cus-test",
  name: "佐藤 美咲",
  kana: "さとう みさき",
  company: "株式会社アトラス",
  role: "部長",
  email: "sato@example.com",
  phone: "03-0000-0000",
  location: "東京都",
  status: "active",
  rank: "S",
  lastContactedAt: "2026-09-28",
  registeredAt: "2024-04-12",
  avatarTone: "coral",
  notes: [],
};

describe("searchCustomers", () => {
  it("名前の一部で顧客を絞り込む", () => {
    expect(searchCustomers([customer], "美咲")).toEqual([customer]);
  });

  it("ふりがなと前後の空白を正規化して検索する", () => {
    expect(searchCustomers([customer], "  さとう  ")).toEqual([customer]);
  });

  it("空の検索語では全顧客を返す", () => {
    expect(searchCustomers([customer], "   ")).toEqual([customer]);
  });
});

describe("addCustomerNote", () => {
  it("新しいメモを先頭に追加し、元の顧客を変更しない", () => {
    const updated = addCustomerNote({
      customer,
      body: "次回の打ち合わせ日程を調整する。",
      author: "高橋 健太",
      now: new Date("2026-10-01T01:00:00.000Z"),
    });

    expect(updated.notes[0]).toEqual({
      id: "note-1790816400000",
      body: "次回の打ち合わせ日程を調整する。",
      author: "高橋 健太",
      createdAt: "2026-10-01T01:00:00.000Z",
    });
    expect(customer.notes).toHaveLength(0);
  });
});

describe("prepareNote", () => {
  it("前後の空白を取り除く", () => {
    expect(prepareNote("  確認済み  ")).toEqual({
      ok: true,
      value: "確認済み",
    });
  });

  it("空のメモを拒否する", () => {
    expect(prepareNote("  ")).toEqual({
      ok: false,
      message: "メモを入力してください。",
    });
  });
});

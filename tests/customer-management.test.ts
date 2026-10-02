import { describe, expect, it } from "vitest";
import { InMemoryAuthentication } from "@/fakes/in-memory-authentication";
import { InMemoryEmailSender } from "@/fakes/in-memory-email-sender";
import { prepareCustomerEmail } from "@/inputs/prepare-customer-email";
import { prepareLogin } from "@/inputs/prepare-login";
import { prepareNote } from "@/inputs/prepare-note";
import type { Customer } from "@/ports/customer-repository";
import { addCustomerNote } from "@/usecases/add-customer-note";
import { getAuthenticatedUser } from "@/usecases/get-authenticated-user";
import { login } from "@/usecases/login";
import { logout } from "@/usecases/logout";
import { searchCustomers } from "@/usecases/search-customers";
import { sendCustomerEmail } from "@/usecases/send-customer-email";

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

describe("customer email", () => {
  it("顧客へのメールを送信する", async () => {
    const emailSender = new InMemoryEmailSender();

    await expect(
      sendCustomerEmail({
        emailSender,
        recipientEmail: customer.email,
        subject: "次回のお打ち合わせについて",
        body: "候補日をご確認ください。",
        senderName: "高橋 健太",
      }),
    ).resolves.toEqual({ deliveryId: "email-1" });
    expect(emailSender.listSentEmails()).toEqual([
      {
        to: customer.email,
        subject: "次回のお打ち合わせについて",
        body: "候補日をご確認ください。",
        senderName: "高橋 健太",
      },
    ]);
  });

  it("メール入力を正規化する", () => {
    expect(
      prepareCustomerEmail(
        " cus-test ",
        " 次回のお打ち合わせについて ",
        " 候補日をご確認ください。 ",
      ),
    ).toEqual({
      ok: true,
      value: {
        customerId: "cus-test",
        subject: "次回のお打ち合わせについて",
        body: "候補日をご確認ください。",
      },
    });
  });

  it("空の件名と本文を拒否する", () => {
    expect(prepareCustomerEmail("cus-test", " ", " ")).toEqual({
      ok: false,
      fieldErrors: {
        subject: "件名を入力してください。",
        body: "本文を入力してください。",
      },
    });
  });
});

describe("authentication", () => {
  it("有効な認証情報でセッションを作成し、ユーザーを取得する", async () => {
    const authentication = new InMemoryAuthentication();
    const result = await login({
      authenticator: authentication,
      sessions: authentication,
      email: "kenta.takahashi@orbit.jp",
      password: "orbit-demo",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    await expect(
      getAuthenticatedUser(authentication, result.token),
    ).resolves.toMatchObject({
      id: "usr-001",
      name: "高橋 健太",
      role: "管理者",
    });

    await logout(authentication, result.token);
    await expect(
      getAuthenticatedUser(authentication, result.token),
    ).resolves.toBeNull();
  });

  it("無効な認証情報を拒否する", async () => {
    const authentication = new InMemoryAuthentication();

    await expect(
      login({
        authenticator: authentication,
        sessions: authentication,
        email: "kenta.takahashi@orbit.jp",
        password: "wrong-password",
      }),
    ).resolves.toEqual({ ok: false });
  });

  it("ログイン入力を正規化し、必須項目を検証する", () => {
    expect(prepareLogin("  KENTA.TAKAHASHI@ORBIT.JP ", "orbit-demo")).toEqual({
      ok: true,
      email: "kenta.takahashi@orbit.jp",
      password: "orbit-demo",
    });
    expect(prepareLogin("", "")).toEqual({
      ok: false,
      fieldErrors: {
        email: "メールアドレスを入力してください。",
        password: "パスワードを入力してください。",
      },
    });
  });
});

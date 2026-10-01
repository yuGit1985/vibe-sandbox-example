"use client";

import { type FormEvent, useMemo, useState } from "react";
import { prepareNote } from "@/inputs/prepare-note";
import type { Customer, CustomerStatus } from "@/ports/customer-repository";
import { addCustomerNote } from "@/usecases/add-customer-note";
import { searchCustomers } from "@/usecases/search-customers";

type IconName =
  | "bell"
  | "chevron"
  | "company"
  | "dashboard"
  | "email"
  | "help"
  | "location"
  | "note"
  | "people"
  | "phone"
  | "search"
  | "settings"
  | "sparkle";

const statusDetails: Record<
  CustomerStatus,
  { label: string; className: string }
> = {
  active: { label: "取引中", className: "status-active" },
  "follow-up": { label: "フォロー中", className: "status-follow" },
  inactive: { label: "休眠", className: "status-inactive" },
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    company: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h6" />
      </>
    ),
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.7 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.2.9-1.2 1.7M12 17h.01" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    note: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </>
    ),
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.17.61.77 1 1.4 1h.2v4h-.08a1.7 1.7 0 0 0-1.52 1Z" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3-1 3.5A5 5 0 0 1 7.5 10L4 11l3.5 1A5 5 0 0 1 11 15.5l1 3.5 1-3.5a5 5 0 0 1 3.5-3.5l3.5-1-3.5-1A5 5 0 0 1 13 6.5Z" />
        <path d="m5 3-.4 1.4L3 5l1.6.6L5 7l.4-1.4L7 5l-1.6-.6Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Avatar({
  customer,
  large = false,
}: {
  customer: Customer;
  large?: boolean;
}) {
  const initials = customer.name
    .split(" ")
    .map((part) => part.at(0))
    .join("");
  return (
    <span
      className={`avatar avatar-${customer.avatarTone}${large ? " avatar-large" : ""}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function StatusBadge({ status }: { status: CustomerStatus }) {
  const detail = statusDetails[status];
  return (
    <span className={`status-badge ${detail.className}`}>
      <span className="status-dot" />
      {detail.label}
    </span>
  );
}

function formatDate(value: string, includeYear = true): string {
  return new Intl.DateTimeFormat("ja-JP", {
    ...(includeYear ? { year: "numeric" as const } : {}),
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatNoteDate(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

export function CustomerDashboard({
  initialCustomers,
}: {
  initialCustomers: Customer[];
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialCustomers[0]?.id ?? "");
  const [noteDraft, setNoteDraft] = useState("");
  const [noteMessage, setNoteMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const filteredCustomers = useMemo(
    () => searchCustomers(customers, query),
    [customers, query],
  );
  const selectedCustomer =
    customers.find((customer) => customer.id === selectedId) ?? customers[0];
  const activeCount = customers.filter(
    (customer) => customer.status === "active",
  ).length;

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCustomer) return;

    const prepared = prepareNote(noteDraft);
    if (!prepared.ok) {
      setNoteMessage({ type: "error", text: prepared.message });
      return;
    }

    const updatedCustomer = addCustomerNote({
      customer: selectedCustomer,
      body: prepared.value,
      author: "高橋 健太",
    });
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === selectedCustomer.id ? updatedCustomer : customer,
      ),
    );
    setNoteDraft("");
    setNoteMessage({ type: "success", text: "メモを追加しました。" });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="sparkle" size={22} />
          </span>
          <span>Orbit</span>
        </div>
        <nav className="main-nav" aria-label="メインナビゲーション">
          <p className="nav-label">ワークスペース</p>
          <a href="#dashboard">
            <Icon name="dashboard" />
            ダッシュボード
          </a>
          <a href="#customers" className="active">
            <Icon name="people" />
            顧客管理<span className="nav-count">{customers.length}</span>
          </a>
          <a href="#companies">
            <Icon name="company" />
            企業
          </a>
          <a href="#activities">
            <Icon name="note" />
            アクティビティ
          </a>
          <p className="nav-label nav-label-spaced">システム</p>
          <a href="#settings">
            <Icon name="settings" />
            設定
          </a>
          <a href="#help">
            <Icon name="help" />
            ヘルプ
          </a>
        </nav>
        <div className="sidebar-profile">
          <span className="profile-avatar">高</span>
          <span>
            <strong>高橋 健太</strong>
            <small>管理者</small>
          </span>
          <Icon name="chevron" size={16} />
        </div>
      </aside>

      <main className="main-content" id="customers">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark">
              <Icon name="sparkle" size={19} />
            </span>
            Orbit
          </div>
          <div className="breadcrumbs">
            <span>顧客管理</span>
            <Icon name="chevron" size={14} />
            <strong>顧客一覧</strong>
          </div>
          <button className="icon-button" type="button" aria-label="通知を確認">
            <Icon name="bell" size={19} />
            <span className="notification-dot" />
          </button>
        </header>

        <div className="workspace">
          <section className="page-heading">
            <div>
              <span className="eyebrow">CUSTOMER RELATIONSHIPS</span>
              <h1>顧客管理</h1>
              <p>顧客情報とコミュニケーションを、ひとつの場所で。</p>
            </div>
            <div className="summary-strip">
              <div>
                <span>総顧客数</span>
                <strong>{customers.length}</strong>
              </div>
              <div>
                <span>取引中</span>
                <strong className="summary-active">{activeCount}</strong>
              </div>
            </div>
          </section>

          <div className="customer-workspace">
            <section
              className="customer-list-panel"
              aria-labelledby="customer-list-title"
            >
              <div className="panel-header list-header">
                <div>
                  <h2 id="customer-list-title">顧客一覧</h2>
                  <span>{filteredCustomers.length}名を表示</span>
                </div>
              </div>
              <div className="search-wrap">
                <Icon name="search" size={19} />
                <label className="sr-only" htmlFor="customer-search">
                  顧客名で検索
                </label>
                <input
                  id="customer-search"
                  type="search"
                  placeholder="名前で顧客を検索..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="検索をクリア"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="customer-list">
                {filteredCustomers.map((customer) => (
                  <button
                    className={`customer-row${customer.id === selectedCustomer?.id ? " selected" : ""}`}
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(customer.id);
                      setNoteMessage(null);
                    }}
                  >
                    <Avatar customer={customer} />
                    <span className="customer-row-main">
                      <span className="customer-row-top">
                        <strong>{customer.name}</strong>
                        <StatusBadge status={customer.status} />
                      </span>
                      <span>{customer.company}</span>
                      <small>
                        最終連絡 {formatDate(customer.lastContactedAt, false)}
                      </small>
                    </span>
                    <Icon name="chevron" size={16} />
                  </button>
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="empty-search">
                    <span>
                      <Icon name="search" size={22} />
                    </span>
                    <strong>該当する顧客が見つかりません</strong>
                    <p>別の名前で検索してみてください。</p>
                  </div>
                )}
              </div>
            </section>

            {selectedCustomer && (
              <section
                className="customer-detail-panel"
                aria-labelledby="customer-detail-title"
              >
                <div className="detail-hero">
                  <Avatar customer={selectedCustomer} large />
                  <div className="detail-identity">
                    <div className="detail-name-row">
                      <h2 id="customer-detail-title">
                        {selectedCustomer.name}
                      </h2>
                      <StatusBadge status={selectedCustomer.status} />
                    </div>
                    <p>{selectedCustomer.kana}</p>
                    <strong>{selectedCustomer.company}</strong>
                    <span>{selectedCustomer.role}</span>
                  </div>
                  <button
                    className="more-button"
                    type="button"
                    aria-label="その他の操作"
                  >
                    •••
                  </button>
                </div>

                <div className="detail-body">
                  <section
                    className="detail-section"
                    aria-labelledby="contact-title"
                  >
                    <div className="section-title">
                      <div>
                        <span className="section-icon">
                          <Icon name="people" size={18} />
                        </span>
                        <h3 id="contact-title">基本情報</h3>
                      </div>
                      <span className="registered-date">
                        登録日 {formatDate(selectedCustomer.registeredAt)}
                      </span>
                    </div>
                    <dl className="contact-grid">
                      <div>
                        <dt>
                          <Icon name="email" size={17} />
                          メールアドレス
                        </dt>
                        <dd>
                          <a href={`mailto:${selectedCustomer.email}`}>
                            {selectedCustomer.email}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <Icon name="phone" size={17} />
                          電話番号
                        </dt>
                        <dd>
                          <a href={`tel:${selectedCustomer.phone}`}>
                            {selectedCustomer.phone}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <Icon name="company" size={17} />
                          会社名
                        </dt>
                        <dd>{selectedCustomer.company}</dd>
                      </div>
                      <div>
                        <dt>
                          <Icon name="location" size={17} />
                          所在地
                        </dt>
                        <dd>{selectedCustomer.location}</dd>
                      </div>
                    </dl>
                  </section>

                  <section
                    className="detail-section notes-section"
                    aria-labelledby="notes-title"
                  >
                    <div className="section-title">
                      <div>
                        <span className="section-icon section-icon-warm">
                          <Icon name="note" size={18} />
                        </span>
                        <h3 id="notes-title">メモ</h3>
                        <span className="note-count">
                          {selectedCustomer.notes.length}
                        </span>
                      </div>
                    </div>
                    <form className="note-form" onSubmit={handleAddNote}>
                      <label className="sr-only" htmlFor="note-body">
                        顧客メモを追加
                      </label>
                      <textarea
                        id="note-body"
                        value={noteDraft}
                        maxLength={500}
                        onChange={(event) => {
                          setNoteDraft(event.target.value);
                          setNoteMessage(null);
                        }}
                        placeholder={`${selectedCustomer.name}さんについてメモを残す...`}
                      />
                      <div className="note-form-footer">
                        <output
                          className={
                            noteMessage
                              ? `form-message ${noteMessage.type}`
                              : "character-count"
                          }
                        >
                          {noteMessage?.text ?? `${noteDraft.length} / 500`}
                        </output>
                        <button type="submit">
                          <Icon name="note" size={16} />
                          メモを追加
                        </button>
                      </div>
                    </form>
                    <div className="notes-timeline">
                      {selectedCustomer.notes.map((note) => (
                        <article className="note-item" key={note.id}>
                          <span className="timeline-dot" />
                          <div className="note-card">
                            <p>{note.body}</p>
                            <footer>
                              <span className="mini-avatar">高</span>
                              <strong>{note.author}</strong>
                              <time dateTime={note.createdAt}>
                                {formatNoteDate(note.createdAt)}
                              </time>
                            </footer>
                          </div>
                        </article>
                      ))}
                      {selectedCustomer.notes.length === 0 && (
                        <div className="empty-notes">
                          <span>
                            <Icon name="note" size={20} />
                          </span>
                          <div>
                            <strong>まだメモはありません</strong>
                            <p>
                              最初のメモを追加して、やり取りを記録しましょう。
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

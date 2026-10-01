import { redirect } from "next/navigation";
import { prototypeCredentials } from "@/fakes/in-memory-authentication";
import { readAuthenticatedUser } from "@/inputs/read-authenticated-user";
import { LoginForm } from "@/ui/login-form";

export default async function LoginPage() {
  const user = await readAuthenticatedUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand-mark" aria-hidden="true">
            ✦
          </span>
          <span>Orbit</span>
        </div>
        <div className="login-copy">
          <span className="eyebrow">CUSTOMER RELATIONSHIPS</span>
          <h1 id="login-title">おかえりなさい</h1>
          <p>顧客管理ワークスペースにログインしてください。</p>
        </div>
        <LoginForm
          defaultEmail={prototypeCredentials.email}
          defaultPassword={prototypeCredentials.password}
        />
        <aside className="demo-credentials">
          <strong>デモアカウント</strong>
          <span>{prototypeCredentials.email}</span>
          <span>{prototypeCredentials.password}</span>
        </aside>
      </section>
    </main>
  );
}

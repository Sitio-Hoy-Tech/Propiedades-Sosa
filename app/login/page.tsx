import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Acceso admin</h1>

      <form action={login}>
        <label htmlFor="email" style={{ display: "block", marginTop: 12 }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />

        <label htmlFor="password" style={{ display: "block", marginTop: 12 }}>
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />

        {error === "invalid_credentials" && (
          <p style={{ color: "red", marginTop: 8, fontSize: 14 }}>
            Email o contraseña incorrectos.
          </p>
        )}

        <button
          type="submit"
          style={{ width: "100%", padding: 10, marginTop: 16, background: "#000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

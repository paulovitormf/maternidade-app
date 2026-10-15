export default function VacinaGestante() {
  return (
    <main className="min-h-screen bg-[#FDF7F8] p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Calendário de Vacinação
        </h1>

        <p className="mt-2 text-slate-600">
          Acompanhe as vacinas recomendadas durante sua gestação.
        </p>
      </header>

      <section className="rounded-2xl border border-rose-200/60 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Minhas vacinas
        </h2>

        <p className="mt-2 text-slate-600">
          O calendário de vacinação estará aqui.
        </p>
      </section>
    </main>
  );
}
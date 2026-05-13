export default function BetterTrentoHomepage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Better<span className="text-cyan-400">Trento</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#services" className="hover:text-cyan-400 transition">Servizi</a>
            <a href="#features" className="hover:text-cyan-400 transition">Funzionalità</a>
            <a href="#about" className="hover:text-cyan-400 transition">Chi siamo</a>
            <button className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-2 rounded-xl font-semibold text-slate-950">
              Accedi
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-sm text-cyan-300 mb-6">
              Smart City Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
              La tua città,
              <span className="text-cyan-400 block">più intelligente.</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-xl mb-10">
              BetterTrento connette cittadini e amministrazione tramite segnalazioni urbane,
              eventi territoriali, calendario rifiuti e servizi digitali intelligenti.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 rounded-2xl text-slate-950 font-bold text-lg shadow-2xl shadow-cyan-500/30">
                Inizia ora
              </button>

              <button className="border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 transition px-8 py-4 rounded-2xl text-lg font-semibold">
                Scopri di più
              </button>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl rounded-full" />

            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-slate-400 text-sm">Segnalazioni attive</p>
                  <h2 className="text-4xl font-black mt-1">124</h2>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-3xl">
                  📍
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Illuminazione pubblica</h3>
                    <span className="text-yellow-400 text-sm">In carico</span>
                  </div>
                  <p className="text-slate-400 text-sm">Via Brennero - Lampione non funzionante</p>
                </div>

                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Rifiuti urbani</h3>
                    <span className="text-green-400 text-sm">Risolta</span>
                  </div>
                  <p className="text-slate-400 text-sm">Raccolta straordinaria programmata</p>
                </div>

                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-5 text-slate-950 font-semibold mt-6">
                  Prossimo evento urbano:
                  <div className="text-2xl font-black mt-2">Lavori stradali - Centro storico</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Servizi intelligenti per la città
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Una piattaforma unica per migliorare la comunicazione tra cittadini e amministrazione.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🚨',
                title: 'Segnalazioni',
                text: 'Segnala problemi urbani in tempo reale con foto e geolocalizzazione.'
              },
              {
                icon: '🗓️',
                title: 'Calendario Rifiuti',
                text: 'Consulta il calendario settimanale della raccolta rifiuti.'
              },
              {
                icon: '📢',
                title: 'Eventi Urbani',
                text: 'Ricevi aggiornamenti su eventi e lavori nella tua zona.'
              },
              {
                icon: '📍',
                title: 'Geolocalizzazione',
                text: 'Servizi personalizzati in base al tuo indirizzo.'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-cyan-400 transition duration-300 hover:-translate-y-2"
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-2xl p-6">
                  <div className="text-4xl font-black text-cyan-400">1000+</div>
                  <div className="text-slate-400 mt-2">Utenti supportati</div>
                </div>

                <div className="bg-slate-800 rounded-2xl p-6">
                  <div className="text-4xl font-black text-cyan-400">99%</div>
                  <div className="text-slate-400 mt-2">Affidabilità sistema</div>
                </div>

                <div className="bg-slate-800 rounded-2xl p-6">
                  <div className="text-4xl font-black text-cyan-400">24/7</div>
                  <div className="text-slate-400 mt-2">Servizi online</div>
                </div>

                <div className="bg-slate-800 rounded-2xl p-6">
                  <div className="text-4xl font-black text-cyan-400">OAuth</div>
                  <div className="text-slate-400 mt-2">Login Google sicuro</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-5xl font-black leading-tight mb-8">
              Una piattaforma moderna per cittadini moderni.
            </h2>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  ⚡
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Prestazioni elevate</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Interfaccia veloce, responsive e progettata per offrire un’esperienza fluida su ogni dispositivo.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  🔒
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Sicurezza avanzata</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Sistema di autenticazione sicuro con gestione token e integrazione Google OAuth.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  🌍
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Accessibilità totale</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Progettato per essere intuitivo e accessibile anche per utenti meno esperti.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[40px] p-14 text-center text-slate-950 shadow-2xl">
          <h2 className="text-5xl font-black mb-6">
            Migliora la tua città.
          </h2>

          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Unisciti a BetterTrento e contribuisci alla gestione intelligente del territorio.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <button className="bg-slate-950 text-white hover:bg-slate-900 transition px-8 py-4 rounded-2xl font-bold text-lg">
              Registrati
            </button>

            <button className="border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition px-8 py-4 rounded-2xl font-bold text-lg">
              Accedi con Google
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-slate-800 py-10 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 items-center">
          <div>
            <h3 className="text-2xl font-black">
              Better<span className="text-cyan-400">Trento</span>
            </h3>
            <p className="text-slate-500 mt-2">
              Smart city platform per cittadini e amministrazione.
            </p>
          </div>

          <div className="text-slate-500 text-sm text-center md:text-right">
            © 2026 BetterTrento — Progetto universitario
          </div>
        </div>
      </footer>
    </div>
  )
}

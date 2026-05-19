import Link from "next/link";
import Image from "next/image";
import { landingCopy } from "./copy";

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] bg-clip-text text-transparent">
            Hey Publi
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            {landingCopy.nav.features}
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            {landingCopy.nav.howItWorks}
          </a>
          <a
            href="#brands"
            className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            {landingCopy.nav.brands}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground sm:inline-block"
          >
            {landingCopy.nav.login}
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30"
          >
            {landingCopy.nav.signup}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#F56040]/8 via-[#E1306C]/8 to-[#C13584]/8 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            {landingCopy.hero.badge}
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {landingCopy.hero.title}{" "}
            <span className="bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] bg-clip-text text-transparent">
              {landingCopy.hero.titleHighlight}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground-secondary md:text-xl">
            {landingCopy.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/cadastro"
              className="w-full rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 sm:w-auto"
            >
              {landingCopy.hero.cta}
            </Link>
            <a
              href="#how-it-works"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-background-secondary sm:w-auto"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {landingCopy.hero.secondaryCta}
            </a>
          </div>
          <p className="mt-6 text-sm text-foreground-secondary">
            {landingCopy.hero.socialProof}
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-black/5">
            <div className="flex items-center gap-2 border-b border-border bg-background-secondary px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 text-xs text-foreground-secondary">
                heypubli.com/dashboard
              </span>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop&crop=top"
              alt="Dashboard Hey Publi — painel do influenciador"
              width={1200}
              height={600}
              className="w-full"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -left-6 -z-10 h-full w-full rounded-2xl bg-gradient-to-br from-[#F56040]/10 via-[#E1306C]/10 to-[#C13584]/10" />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-border bg-background-secondary py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {landingCopy.stats.items.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-foreground-secondary">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const brandLogos = [
  { name: "Natura", width: 120 },
  { name: "Boticário", width: 120 },
  { name: "Havaianas", width: 120 },
  { name: "Farm", width: 80 },
  { name: "Amaro", width: 100 },
  { name: "Nubank", width: 110 },
  { name: "iFood", width: 90 },
  { name: "Magazine Luiza", width: 130 },
];

function Brands() {
  return (
    <section id="brands" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {landingCopy.brands.title}
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary">
            {landingCopy.brands.subtitle}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-2 items-center gap-x-12 gap-y-10 sm:grid-cols-4 md:gap-x-16">
          {brandLogos.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100"
            >
              <div className="flex h-12 items-center justify-center rounded-lg text-xl font-bold tracking-tight text-foreground-secondary">
                {brand.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stepIcons = [
  <svg
    key="connect"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.915-3.656a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.5 8.25"
    />
  </svg>,
  <svg
    key="content"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
    />
  </svg>,
  <svg
    key="money"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>,
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {landingCopy.howItWorks.title}
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary">
            {landingCopy.howItWorks.subtitle}
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {landingCopy.howItWorks.steps.map((step, i) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F56040] via-[#E1306C] to-[#C13584] text-white">
                {stepIcons[i]}
              </div>
              <span className="text-sm font-bold text-accent">{step.number}</span>
              <h3 className="mt-2 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-foreground-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const featureIcons: Record<string, React.ReactNode> = {
  calendar: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  ),
  chart: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  ),
  shield: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),
  message: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  ),
};

function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {landingCopy.features.title}
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary">
            {landingCopy.features.subtitle}
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {landingCopy.features.items.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-white p-8 transition-all hover:border-accent/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-gradient-to-br group-hover:from-[#F56040] group-hover:via-[#E1306C] group-hover:to-[#C13584] group-hover:text-white">
                {featureIcons[feature.icon]}
              </div>
              <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
              <p className="mt-2 leading-relaxed text-foreground-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F56040] via-[#E1306C] to-[#C13584] px-8 py-16 text-center md:px-16 md:py-24">
          <div className="absolute inset-0 -z-0">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              {landingCopy.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {landingCopy.cta.subtitle}
            </p>
            <Link
              href="/cadastro"
              className="mt-8 inline-block rounded-full bg-white px-10 py-4 text-base font-semibold text-accent shadow-lg transition-all hover:shadow-xl"
            >
              {landingCopy.cta.button}
            </Link>
            <p className="mt-4 text-sm text-white/60">{landingCopy.cta.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="text-sm text-foreground-secondary">
          {landingCopy.footer.copyright}
        </div>
        <div className="flex gap-6 text-sm text-foreground-secondary">
          <a href="#" className="transition-colors hover:text-foreground">
            {landingCopy.footer.links.terms}
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            {landingCopy.footer.links.privacy}
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            {landingCopy.footer.links.contact}
          </a>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Brands />
      <HowItWorks />
      <Features />
      <CtaSection />
      <Footer />
    </div>
  );
}

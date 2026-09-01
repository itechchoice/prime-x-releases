import {
  AndroidLogo,
  AppleLogo,
  ArrowDown,
  ArrowRight,
  Check,
  Copy,
  DownloadSimple,
  GithubLogo,
  HardDrives,
  Key,
  ListChecks,
  LockKey,
  Moon,
  PlugsConnected,
  ShieldCheck,
  Sun,
  Translate,
  UserFocus,
  WarningCircle,
  WindowsLogo,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { copy, type Language } from "./copy";
import {
  detectPlatform,
  formatBytes,
  type DownloadAsset,
  type Platform,
  useLatestRelease,
} from "./release";

type IconComponent = ComponentType<{
  size?: number | string;
  weight?: "regular" | "bold" | "fill";
  "aria-hidden"?: boolean;
}>;

const REPOSITORY_URL = "https://github.com/itechchoice/prime-x-releases";

/* [京哥 2026-09-01「iOS 先放一个测试链接即可」] **占位，不是真邀请链接。**
   iOS 没有侧载这条路（见移动端 docs/安装与发版.md §7），只能走 TestFlight，
   而那卡在两件要 Apple 开发者账号的事上。换成正式链接时只改这一行。 */
const IOS_TESTFLIGHT_URL = "https://testflight.apple.com/";
const ASSET_BASE = `${import.meta.env.BASE_URL}assets`;

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#006fd6] px-6 text-base font-semibold text-white shadow-[0_10px_24px_rgba(8,127,245,0.24)] transition-[background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#005fc2] hover:shadow-[0_12px_28px_rgba(8,127,245,0.3)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087ff5]";
const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 text-[15px] font-semibold text-slate-900 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-slate-300 hover:bg-white active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087ff5] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10";
const iconButton =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-slate-300 hover:bg-white active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087ff5] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10";

function usePreferenceState() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("prime-x-language");
    if (saved === "en" || saved === "zh") return saved;
    return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  });
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    localStorage.setItem("prime-x-language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title =
      language === "zh" ? "Prime-X 技术预览版" : "Prime-X Technical Preview";
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("prime-x-theme", dark ? "dark" : "light");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", dark ? "#080b10" : "#f7f8fb");
  }, [dark]);

  return {
    language,
    setLanguage,
    dark,
    setDark,
  };
}

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Brand({ homeLabel }: { homeLabel: string }) {
  return (
    <a
      className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087ff5]"
      href="#top"
      aria-label={homeLabel}
    >
      <img
        className="size-9 rounded-[11px] shadow-sm"
        src={`${ASSET_BASE}/prime-x-icon.png`}
        alt=""
        width="36"
        height="36"
      />
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
        Prime-X
      </span>
    </a>
  );
}

function PlatformCard({
  platform,
  asset,
  language,
  copied,
  onCopy,
}: {
  platform: Platform;
  asset: DownloadAsset;
  language: Language;
  copied: boolean;
  onCopy: () => void;
}) {
  const t = copy[language];
  const content = t.download[platform];
  const Icon =
    platform === "mac"
      ? AppleLogo
      : platform === "windows"
        ? WindowsLogo
        : AndroidLogo;

  return (
    <article className="group flex min-w-0 flex-col justify-between overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:p-8 dark:border-white/10 dark:bg-[#11161e] dark:shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      <div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-[#e9f3ff] text-[#087ff5] dark:bg-[#0d2a48] dark:text-[#78b9ff]">
              <Icon size={25} weight="fill" aria-hidden />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {content.platform}
            </p>
            <h3 className="mt-1 text-[clamp(1.65rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              {content.title}
            </h3>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
              {content.detail}
            </p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 font-mono text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            {formatBytes(asset.size)}
          </span>
        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-5 dark:border-white/10">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {t.download.checksum}
            </span>
            {asset.checksum ? (
              <button
                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#087ff5] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#e9f3ff] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087ff5] dark:hover:bg-[#0d2a48]"
                type="button"
                onClick={onCopy}
                aria-label={t.download.copy}
              >
                {copied ? (
                  <Check size={15} weight="bold" />
                ) : (
                  <Copy size={15} />
                )}
                {copied ? t.download.copied : t.download.copy}
              </button>
            ) : null}
          </div>
          <code className="mt-2 block min-h-10 break-all font-mono text-[11px] leading-5 text-slate-500 dark:text-slate-400">
            {asset.checksum ?? asset.name}
          </code>
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-5 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {content.note}
        </p>
        <a className={`${primaryButton} w-full`} href={asset.url}>
          <DownloadSimple size={19} weight="bold" aria-hidden />
          {content.action}
        </a>
      </div>
    </article>
  );
}

/* 还没有安装包的那一档：Android 等签名密钥库、iOS 等 Apple 账号。
   **刻意不复用 PlatformCard**：它的每一处都在承诺一个真实产物（体积、SHA-256、
   直接下载）。把它们填成占位值就是在骗人：用户会去核一个不存在的校验值。
   这张卡只说两件事：现在没有、以及去哪看。 */
function PendingCard({
  kind,
  language,
  href,
}: {
  kind: "android" | "ios";
  language: Language;
  href: string;
}) {
  const t = copy[language];
  const content = t.download[kind];
  const Icon = kind === "android" ? AndroidLogo : AppleLogo;

  return (
    <article className="group flex min-w-0 flex-col justify-between overflow-hidden rounded-[28px] border border-dashed border-slate-300 bg-white/60 p-6 sm:p-8 dark:border-white/15 dark:bg-[#11161e]/60">
      <div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <Icon size={25} weight="fill" aria-hidden />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {content.platform}
            </p>
            <h3 className="mt-1 text-[clamp(1.65rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              {content.title}
            </h3>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
              {content.detail}
            </p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
            {t.download.pendingBadge}
          </span>
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-5 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {content.pending}
        </p>
        <a className={`${secondaryButton} w-full`} href={href}>
          <ArrowRight size={19} weight="bold" aria-hidden />
          {content.pendingAction}
        </a>
      </div>
    </article>
  );
}

function FlowPoint({
  Icon,
  title,
  body,
}: {
  Icon: IconComponent;
  title: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-slate-200 py-5 first:border-t-0 first:pt-0 dark:border-white/10">
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#e9f3ff] text-[#087ff5] dark:bg-[#0d2a48] dark:text-[#78b9ff]">
        <Icon size={21} weight="regular" aria-hidden />
      </span>
      <div>
        <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
          {body}
        </p>
      </div>
    </div>
  );
}

function InstallSteps({
  Icon,
  title,
  steps,
}: {
  Icon: IconComponent;
  title: string;
  steps: readonly string[];
}) {
  return (
    <div className="border-t border-slate-300 pt-6 dark:border-white/15">
      <div className="mb-7 flex items-center gap-3">
        <Icon size={25} weight="fill" aria-hidden />
        <h3 className="text-xl font-semibold tracking-[-0.03em]">{title}</h3>
      </div>
      <ol className="space-y-5">
        {steps.map((step, index) => (
          <li className="grid grid-cols-[1.75rem_1fr] gap-3" key={step}>
            <span className="inline-flex size-7 items-center justify-center rounded-full border border-slate-300 font-mono text-xs text-slate-500 dark:border-white/15 dark:text-slate-400">
              {index + 1}
            </span>
            <span className="pt-0.5 text-[15px] leading-6 text-slate-600 dark:text-slate-300">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function App() {
  const preferences = usePreferenceState();
  const { release, status } = useLatestRelease();
  const [copiedPlatform, setCopiedPlatform] = useState<Platform | null>(null);
  const platform = useMemo(() => detectPlatform(), []);
  const t = copy[preferences.language];

  useReveal();

  useEffect(() => {
    if (!copiedPlatform) return;
    const timer = window.setTimeout(() => setCopiedPlatform(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copiedPlatform]);

  const preferredAsset = platform ? release[platform] : null;
  const preferredLabel =
    platform === "mac"
      ? t.hero.macCta
      : platform === "windows"
        ? t.hero.windowsCta
        : t.hero.chooseCta;

  async function copyChecksum(platformToCopy: Platform) {
    /* `release.android` 可空（安卓包还没挂上来时是 null），所以这里不能直接点出去。 */
    const checksum = release[platformToCopy]?.checksum;
    if (!checksum) return;
    try {
      await navigator.clipboard.writeText(checksum);
      setCopiedPlatform(platformToCopy);
    } catch {
      setCopiedPlatform(null);
    }
  }

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-[#f7f8fb] text-slate-950 antialiased dark:bg-[#080b10] dark:text-white"
    >
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f7f8fb]/88 backdrop-blur-xl dark:border-white/8 dark:bg-[#080b10]/88">
        <nav
          className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12"
          aria-label="Primary"
        >
          <Brand homeLabel={t.aria.home} />
          <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a
              className="rounded-md transition-colors duration-200 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087ff5] dark:hover:text-white"
              href="#downloads"
            >
              {t.nav.download}
            </a>
            <a
              className="rounded-md transition-colors duration-200 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087ff5] dark:hover:text-white"
              href="#how-it-works"
            >
              {t.nav.safety}
            </a>
            <a
              className="rounded-md transition-colors duration-200 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087ff5] dark:hover:text-white"
              href="#install"
            >
              {t.nav.install}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`${iconButton} w-auto gap-1.5 px-3`}
              type="button"
              aria-label={`${t.aria.language}: ${preferences.language === "zh" ? "EN" : "中文"}`}
              onClick={() =>
                preferences.setLanguage(
                  preferences.language === "zh" ? "en" : "zh",
                )
              }
            >
              <Translate size={18} aria-hidden />
              <span className="text-xs font-semibold">
                {preferences.language === "zh" ? "EN" : "中文"}
              </span>
            </button>
            <button
              className={iconButton}
              type="button"
              aria-label={t.aria.theme}
              onClick={() => preferences.setDark(!preferences.dark)}
            >
              {preferences.dark ? (
                <Sun size={18} aria-hidden />
              ) : (
                <Moon size={18} aria-hidden />
              )}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-grid relative border-b border-slate-200/80 dark:border-white/8">
          <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-20">
            <div className="relative z-10 max-w-[650px]" data-reveal>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#087ff5]/20 bg-[#e9f3ff] px-3.5 py-2 text-xs font-semibold tracking-[0.08em] text-[#006dcc] uppercase dark:border-[#78b9ff]/20 dark:bg-[#0d2a48] dark:text-[#78b9ff]">
                <span className="size-1.5 rounded-full bg-[#087ff5]" />
                {t.hero.eyebrow}
              </div>
              <h1 className="max-w-[720px] text-[clamp(3rem,5.4vw,4.75rem)] leading-[0.94] font-semibold tracking-[-0.065em]">
                <span className="block whitespace-nowrap">
                  {t.hero.titleLine1}
                </span>
                <span className="mt-2 block whitespace-nowrap text-[#087ff5]">
                  {t.hero.titleLine2}
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-[clamp(1.05rem,2vw,1.25rem)] leading-8 text-slate-600 dark:text-slate-300">
                {t.hero.body}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  className={primaryButton}
                  href={preferredAsset?.url ?? "#downloads"}
                >
                  <DownloadSimple size={19} weight="bold" aria-hidden />
                  {preferredLabel}
                </a>
                <a className={secondaryButton} href={release.pageUrl}>
                  {t.hero.releaseNotes}
                  <ArrowRight size={18} weight="bold" aria-hidden />
                </a>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                <span>{release.tag.replace("-internal.", " preview ")}</span>
                <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span>{t.hero.preview}</span>
              </div>
            </div>

            <div
              className="relative min-h-[420px] overflow-hidden rounded-[34px] border border-slate-800 bg-[#0b1017] p-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.17)] sm:p-10 lg:min-h-[610px] dark:border-white/10 dark:shadow-[0_32px_100px_rgba(0,0,0,0.35)]"
              data-reveal
            >
              <div className="absolute top-0 right-0 h-full w-[28%] bg-[#087ff5]" />
              <div className="absolute top-[22%] right-[17%] size-52 rounded-full border border-white/15 sm:size-72" />
              <div className="absolute top-[30%] right-[21%] size-32 rounded-full border border-white/10 sm:size-48" />
              <div className="relative flex min-h-[calc(420px-3.5rem)] flex-col justify-between lg:min-h-[calc(610px-5rem)]">
                <div className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.14em] text-white/55 uppercase">
                  <span>Prime-X / Desktop runtime</span>
                  <span className="flex items-center gap-2 text-white">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Preview 01
                  </span>
                </div>
                <div className="relative z-10 max-w-md">
                  <img
                    className="size-24 rounded-[26px] shadow-[0_22px_50px_rgba(0,0,0,0.35)] sm:size-28"
                    src={`${ASSET_BASE}/prime-x-icon.png`}
                    alt=""
                    width="112"
                    height="112"
                  />
                  <p className="mt-7 text-[clamp(2.25rem,5vw,4.6rem)] leading-[0.95] font-semibold tracking-[-0.065em]">
                    Private by default.
                    <br />
                    Governed by design.
                  </p>
                </div>
                <div className="relative z-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-5 text-sm text-white/65">
                  <span className="inline-flex items-center gap-2">
                    <AppleLogo size={18} weight="fill" aria-hidden />
                    Apple silicon
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <WindowsLogo size={18} weight="fill" aria-hidden />
                    Windows x64
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-b border-slate-200/80 bg-white dark:border-white/8 dark:bg-[#0c1016]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
            {[HardDrives, Key, ShieldCheck, PlugsConnected].map(
              (Icon, index) => (
                <div
                  className="flex min-h-24 items-center gap-3 border-slate-200 px-2 py-5 even:border-l sm:px-5 lg:border-l lg:first:border-l-0 dark:border-white/8"
                  key={t.trust[index]}
                >
                  <Icon
                    className="shrink-0 text-[#087ff5]"
                    size={21}
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.trust[index]}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <section
          id="downloads"
          className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-[1240px]">
            <div
              className="grid items-end gap-6 lg:grid-cols-[1fr_0.72fr]"
              data-reveal
            >
              <h2 className="max-w-3xl text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] font-semibold tracking-[-0.06em] text-balance">
                {t.download.title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end dark:text-slate-400">
                {t.download.body}
              </p>
            </div>

            <div className="mt-10 flex min-h-8 items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              {status === "fallback" ? (
                <>
                  <WarningCircle
                    size={18}
                    className="text-amber-600"
                    aria-hidden
                  />
                  <span>{t.download.fallback}</span>
                </>
              ) : (
                <>
                  <span
                    className={`size-2 rounded-full ${status === "loading" ? "animate-pulse bg-slate-400" : "bg-emerald-500"}`}
                  />
                  <span>{t.download.latest}</span>
                </>
              )}
            </div>

            <div
              className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]"
              data-reveal
            >
              <PlatformCard
                platform="mac"
                asset={release.mac}
                language={preferences.language}
                copied={copiedPlatform === "mac"}
                onCopy={() => void copyChecksum("mac")}
              />
              <PlatformCard
                platform="windows"
                asset={release.windows}
                language={preferences.language}
                copied={copiedPlatform === "windows"}
                onCopy={() => void copyChecksum("windows")}
              />
            </div>

            <div
              className="mt-16 grid items-end gap-6 lg:grid-cols-[1fr_0.72fr]"
              data-reveal
            >
              <h2 className="max-w-3xl text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.05em] text-balance">
                {t.download.mobileTitle}
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end dark:text-slate-400">
                {t.download.mobileBody}
              </p>
            </div>

            <div
              className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]"
              data-reveal
            >
              {/* 安卓包一旦挂进 Release 就自动变成真下载卡，不用再改这里。 */}
              {release.android ? (
                <PlatformCard
                  platform="android"
                  asset={release.android}
                  language={preferences.language}
                  copied={copiedPlatform === "android"}
                  onCopy={() => void copyChecksum("android")}
                />
              ) : (
                <PendingCard
                  kind="android"
                  language={preferences.language}
                  href={release.pageUrl}
                />
              )}
              <PendingCard
                kind="ios"
                language={preferences.language}
                href={IOS_TESTFLIGHT_URL}
              />
            </div>

            <p className="sr-only" aria-live="polite">
              {copiedPlatform ? t.download.copied : ""}
            </p>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-16 border-y border-slate-200/80 bg-white px-5 py-24 sm:px-8 lg:px-12 lg:py-32 dark:border-white/8 dark:bg-[#0c1016]"
        >
          <div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
            <div
              className="relative overflow-hidden rounded-[32px] bg-[#0b1017] p-7 text-white sm:p-10 lg:min-h-[580px]"
              data-reveal
            >
              <div className="absolute -top-20 -right-20 size-72 rounded-full border-[48px] border-[#087ff5] opacity-90" />
              <div className="relative flex h-full min-h-[460px] flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-white/50 uppercase">
                  <span>Governed execution path</span>
                  <ShieldCheck
                    size={20}
                    className="text-[#78b9ff]"
                    aria-hidden
                  />
                </div>
                <div className="relative mx-auto w-full max-w-md py-8">
                  <div className="absolute top-12 bottom-12 left-[1.45rem] w-px bg-white/15" />
                  {[
                    {
                      label:
                        preferences.language === "zh"
                          ? "本地执行"
                          : "Local runtime",
                      detail:
                        preferences.language === "zh"
                          ? "模型与工具在你的设备上运行"
                          : "Models and tools run on your device",
                      Icon: HardDrives,
                    },
                    {
                      label:
                        preferences.language === "zh"
                          ? "用户审批"
                          : "Human approval",
                      detail:
                        preferences.language === "zh"
                          ? "敏感操作先获得明确许可"
                          : "Sensitive actions request clear consent",
                      Icon: UserFocus,
                    },
                    {
                      label:
                        preferences.language === "zh"
                          ? "可审计记录"
                          : "Audit record",
                      detail:
                        preferences.language === "zh"
                          ? "治理决定对授权团队可见"
                          : "Governance decisions stay visible",
                      Icon: ListChecks,
                    },
                  ].map(({ label, detail, Icon }, index) => (
                    <div
                      className="relative grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5"
                      key={label}
                    >
                      <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-[#141b25] text-[#78b9ff]">
                        <Icon size={21} aria-hidden />
                      </span>
                      <div>
                        <p className="font-semibold tracking-[-0.02em]">
                          {label}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-white/50">
                          {detail}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-white/35">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/50">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  {preferences.language === "zh"
                    ? "边界清晰，状态可见"
                    : "Clear boundaries, visible state"}
                </div>
              </div>
            </div>
            <div data-reveal>
              <h2 className="text-[clamp(2.35rem,5vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.055em] text-balance">
                {t.flow.title}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
                {t.flow.body}
              </p>
              <div className="mt-9">
                <FlowPoint
                  Icon={LockKey}
                  title={t.flow.points[0].title}
                  body={t.flow.points[0].body}
                />
                <FlowPoint
                  Icon={UserFocus}
                  title={t.flow.points[1].title}
                  body={t.flow.points[1].body}
                />
                <FlowPoint
                  Icon={ListChecks}
                  title={t.flow.points[2].title}
                  body={t.flow.points[2].body}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="install"
          className="scroll-mt-16 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-[1240px]" data-reveal>
            <div className="grid gap-7 lg:grid-cols-[0.88fr_1.12fr]">
              <h2 className="max-w-2xl text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] font-semibold tracking-[-0.06em] text-balance">
                {t.install.title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end dark:text-slate-400">
                {t.install.body}
              </p>
            </div>
            <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
              <InstallSteps
                Icon={AppleLogo}
                title={t.install.macTitle}
                steps={t.install.macSteps}
              />
              <InstallSteps
                Icon={WindowsLogo}
                title={t.install.windowsTitle}
                steps={t.install.windowsSteps}
              />
            </div>
            <div className="mt-14 flex justify-center">
              <a className={secondaryButton} href="#downloads">
                {t.nav.download}
                <ArrowDown size={18} weight="bold" aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white px-5 dark:border-white/8 dark:bg-[#0c1016] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 py-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Brand homeLabel={t.aria.home} />
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-[#e9f3ff] px-3 py-1.5 font-semibold text-[#006dcc] dark:bg-[#0d2a48] dark:text-[#78b9ff]">
                {t.footer.status}
              </span>
              <span>{t.footer.source}</span>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {t.footer.privacy}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <a className={secondaryButton} href={`${REPOSITORY_URL}/releases`}>
              <GithubLogo size={19} weight="fill" aria-hidden />
              {t.footer.releases}
            </a>
            <a
              className={iconButton}
              href={REPOSITORY_URL}
              aria-label={t.aria.github}
            >
              <GithubLogo size={19} weight="fill" aria-hidden />
            </a>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-slate-200/80 py-6 font-mono text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:border-white/8 dark:text-slate-400">
          <span>© 2026 iTechchoice. All rights reserved.</span>
          <span>{release.tag}</span>
        </div>
      </footer>
    </div>
  );
}

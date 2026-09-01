import { useEffect, useState } from "react";

/* Android 与桌面一样是「Release 里挂着一个安装包」，所以同属 Platform；
   iOS 不是：它没有可侧载的产物，只能给 TestFlight 链接，所以不在这里。 */
export type Platform = "mac" | "windows" | "android";

/** 只有桌面两端能从 UA 推断出来，首屏 CTA 用它。 */
export type DesktopPlatform = "mac" | "windows";

export type DownloadAsset = {
  name: string;
  url: string;
  size: number;
  checksum: string | null;
};

export type ReleaseInfo = {
  tag: string;
  name: string;
  publishedAt: string;
  pageUrl: string;
  mac: DownloadAsset;
  windows: DownloadAsset;
  /* **可空是刻意的**：安卓包要等移动端签名密钥库就位后才会挂进 Release。
     在那之前页面照常渲染，安卓卡片走「即将提供」态：不能因为少一个包
     就把整页拖进 fallback（那会连桌面下载一起降级）。 */
  android: DownloadAsset | null;
  source: "github" | "fallback";
};

type GitHubAsset = {
  name: string;
  browser_download_url: string;
  size: number;
  digest?: string | null;
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
  assets: GitHubAsset[];
};

const REPOSITORY = "itechchoice/prime-x-releases";
const FALLBACK_TAG = "v0.1.0-internal.10";
const FALLBACK_RELEASE_URL = `https://github.com/${REPOSITORY}/releases/tag/${FALLBACK_TAG}`;
const FALLBACK_ASSET_URL = `https://github.com/${REPOSITORY}/releases/download/${FALLBACK_TAG}`;

export const fallbackRelease: ReleaseInfo = {
  tag: FALLBACK_TAG,
  name: "Prime-X v0.1.0-internal.10 (TP10)",
  publishedAt: "2026-07-22T08:05:26Z",
  pageUrl: FALLBACK_RELEASE_URL,
  source: "fallback",
  android: null,
  mac: {
    name: "Prime-X-0.1.0-mac-arm64.dmg",
    url: `${FALLBACK_ASSET_URL}/Prime-X-0.1.0-mac-arm64.dmg`,
    size: 125_779_597,
    checksum:
      "dcc891b0d960d5a1b8a62fb455549c36bbac2ccac9d916151788d24705f185bb",
  },
  windows: {
    name: "Prime-X-0.1.0-win-x64.exe",
    url: `${FALLBACK_ASSET_URL}/Prime-X-0.1.0-win-x64.exe`,
    size: 103_011_175,
    checksum:
      "ed6bdca26a0baf2f0d63920f0f9480518abf6a4561faf68e0bdd6c1cd10418bc",
  },
};

function findAsset(assets: GitHubAsset[], platform: Platform) {
  const installer = assets.find((asset) => {
    const name = asset.name.toLowerCase();
    if (platform === "mac") {
      return (
        name.endsWith(".dmg") &&
        (name.includes("arm64") || name.includes("aarch64"))
      );
    }
    if (platform === "windows") {
      return (
        name.endsWith(".exe") && (name.includes("x64") || name.includes("win"))
      );
    }
    /* universal APK（见移动端 docs/安装与发版.md：刻意不出 split-per-abi，
       让用户挑 abi 就是把发布责任推回给用户）。AAB 不是给人装的，排除掉。 */
    return name.endsWith(".apk");
  });

  if (!installer) return null;

  const digest = installer.digest?.startsWith("sha256:")
    ? installer.digest.slice("sha256:".length)
    : null;

  return {
    installer,
    checksumAsset: assets.find(
      (asset) =>
        asset.name.toLowerCase() === `${installer.name.toLowerCase()}.sha256`,
    ),
    digest,
  };
}

async function readChecksum(asset?: GitHubAsset) {
  if (!asset) return null;

  try {
    const response = await fetch(asset.browser_download_url, {
      headers: { Accept: "text/plain" },
    });
    if (!response.ok) return null;
    const match = (await response.text()).match(/[a-f0-9]{64}/i);
    return match?.[0]?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

async function toDownloadAsset(
  assets: GitHubAsset[],
  platform: Platform,
): Promise<DownloadAsset | null> {
  const match = findAsset(assets, platform);
  if (!match) return null;

  return {
    name: match.installer.name,
    url: match.installer.browser_download_url,
    size: match.installer.size,
    checksum: match.digest ?? (await readChecksum(match.checksumAsset)),
  };
}

async function fetchLatestRelease(signal: AbortSignal): Promise<ReleaseInfo> {
  const response = await fetch(
    `https://api.github.com/repos/${REPOSITORY}/releases?per_page=10`,
    {
      signal,
      headers: { Accept: "application/vnd.github+json" },
    },
  );

  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

  const releases = (await response.json()) as GitHubRelease[];
  // GitHub's list-releases order is not reliably by publish date (this repo's
  // tags were bulk-created on one day, so the array order is stale), so sort
  // by published_at ourselves instead of trusting array order.
  const byPublishedDesc = [...releases].sort(
    (a, b) =>
      new Date(b.published_at ?? 0).getTime() -
      new Date(a.published_at ?? 0).getTime(),
  );
  const release =
    byPublishedDesc.find((item) => item.prerelease && !item.draft) ??
    byPublishedDesc.find((item) => !item.draft);

  if (!release) throw new Error("No published release found");

  const [mac, windows, android] = await Promise.all([
    toDownloadAsset(release.assets, "mac"),
    toDownloadAsset(release.assets, "windows"),
    toDownloadAsset(release.assets, "android"),
  ]);

  /* 只有桌面两端缺了才算这次 Release 不可用。**安卓缺了不抛**：见 ReleaseInfo.android。 */
  if (!mac || !windows)
    throw new Error("Release is missing a supported desktop installer");

  return {
    tag: release.tag_name,
    name: release.name ?? release.tag_name,
    publishedAt: release.published_at ?? fallbackRelease.publishedAt,
    pageUrl: release.html_url,
    mac,
    windows,
    android,
    source: "github",
  };
}

export function useLatestRelease() {
  const [release, setRelease] = useState(fallbackRelease);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchLatestRelease(controller.signal)
      .then((result) => {
        setRelease(result);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setStatus("fallback");
      });

    return () => controller.abort();
  }, []);

  return { release, status };
}

export function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function detectPlatform(): DesktopPlatform | null {
  const value = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (value.includes("mac")) return "mac";
  if (value.includes("win")) return "windows";
  return null;
}

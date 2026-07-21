import { useEffect, useState } from "react";

export type Platform = "mac" | "windows";

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
const FALLBACK_TAG = "v0.1.0-internal.8";
const FALLBACK_RELEASE_URL = `https://github.com/${REPOSITORY}/releases/tag/${FALLBACK_TAG}`;
const FALLBACK_ASSET_URL = `https://github.com/${REPOSITORY}/releases/download/${FALLBACK_TAG}`;

export const fallbackRelease: ReleaseInfo = {
  tag: FALLBACK_TAG,
  name: "Prime-X v0.1.0-internal.8 (TP8)",
  publishedAt: "2026-07-21T11:48:09Z",
  pageUrl: FALLBACK_RELEASE_URL,
  source: "fallback",
  mac: {
    name: "Prime-X-0.1.0-mac-arm64.dmg",
    url: `${FALLBACK_ASSET_URL}/Prime-X-0.1.0-mac-arm64.dmg`,
    size: 125_534_690,
    checksum:
      "a0aa006aca26a478e97466f2769ec29ceba375036d139567569735dece0b14ab",
  },
  windows: {
    name: "Prime-X-0.1.0-win-x64.exe",
    url: `${FALLBACK_ASSET_URL}/Prime-X-0.1.0-win-x64.exe`,
    size: 102_821_690,
    checksum:
      "7ab08ec58ac1a8755d38ed6da29c837ace3be9e5c81681e4f93d518b0c86eedd",
  },
};

function findAsset(assets: GitHubAsset[], platform: Platform) {
  const installer = assets.find((asset) => {
    const name = asset.name.toLowerCase();
    return platform === "mac"
      ? name.endsWith(".dmg") &&
          (name.includes("arm64") || name.includes("aarch64"))
      : name.endsWith(".exe") && (name.includes("x64") || name.includes("win"));
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
  const release =
    releases.find((item) => item.prerelease && !item.draft) ??
    releases.find((item) => !item.draft);

  if (!release) throw new Error("No published release found");

  const [mac, windows] = await Promise.all([
    toDownloadAsset(release.assets, "mac"),
    toDownloadAsset(release.assets, "windows"),
  ]);

  if (!mac || !windows)
    throw new Error("Release is missing a supported installer");

  return {
    tag: release.tag_name,
    name: release.name ?? release.tag_name,
    publishedAt: release.published_at ?? fallbackRelease.publishedAt,
    pageUrl: release.html_url,
    mac,
    windows,
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

export function detectPlatform(): Platform | null {
  const value = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (value.includes("mac")) return "mac";
  if (value.includes("win")) return "windows";
  return null;
}

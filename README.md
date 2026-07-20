# Prime-X Technical Preview

This public repository hosts the Prime-X Technical Preview download site and its desktop installer assets. The Prime-X application source code remains private.

## Download

Visit the [Prime-X download site](https://itechchoice.github.io/prime-x-releases/) or open the [latest GitHub Pre-release](https://github.com/itechchoice/prime-x-releases/releases).

Available preview builds:

- macOS 13 or later on Apple silicon: ARM64 DMG
- Windows 10 or 11: x64 NSIS installer

Both preview installers are currently unsigned. Verify the published SHA-256 checksum before installation.

## Privacy

The download site is static. It does not collect API keys, credentials, analytics, or usage data. Installer downloads are served directly by GitHub Releases.

## Development

```bash
pnpm install
pnpm dev
```

Before publishing:

```bash
pnpm check
pnpm build
```

## License

Copyright © 2026 iTechchoice. All rights reserved. Public repository visibility does not make Prime-X open source. See [LICENSE](LICENSE).

---

# Prime-X 技术预览版

此公开仓库用于托管 Prime-X 技术预览版下载官网及桌面安装包。Prime-X 应用源代码仍为私有。

请访问 [Prime-X 下载官网](https://itechchoice.github.io/prime-x-releases/) 或 [GitHub Pre-release](https://github.com/itechchoice/prime-x-releases/releases) 获取安装包。

目前提供 Apple 芯片 Mac 的 ARM64 DMG，以及 Windows 10 或 11 的 x64 NSIS 安装程序。两个预览版安装包暂未签名，请在安装前核对公开的 SHA-256 校验值。

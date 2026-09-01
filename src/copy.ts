export const copy = {
  en: {
    nav: { download: "Download", safety: "How it works", install: "Install" },
    hero: {
      eyebrow: "Technical Preview",
      titleLine1: "Local agents.",
      titleLine2: "Clear control.",
      body: "Run AI agents on your machine while your workspace keeps identity, policy, approvals, and audit in view.",
      releaseNotes: "Release notes",
      macCta: "Download for macOS",
      windowsCta: "Download for Windows",
      chooseCta: "Choose a download",
      preview: "Preview build",
    },
    trust: [
      "Local execution",
      "OS-protected credentials",
      "Governed workspace",
      "Private MCP access",
    ],
    download: {
      title: "Choose your desktop",
      body: "These unsigned preview builds are for internal teams and partner developers. Confirm the checksum before installing.",
      latest: "Latest Pre-release",
      fallback:
        "Live release check unavailable. Verified download links are still ready.",
      mac: {
        platform: "macOS",
        title: "Apple silicon",
        detail: "macOS 13 or later · ARM64 DMG",
        action: "Download DMG",
        note: "Unsigned preview. macOS may ask you to confirm the app in Privacy & Security.",
      },
      windows: {
        platform: "Windows",
        title: "Windows 10 or 11",
        detail: "64-bit · NSIS installer",
        action: "Download EXE",
        note: "Unsigned preview. Windows SmartScreen may ask you to confirm the installer.",
      },
      mobileTitle: "Phone and tablet",
      mobileBody:
        "The mobile app follows the same release. Android installs directly from the APK; iOS goes through TestFlight.",
      android: {
        platform: "Android",
        title: "Android 8 or later",
        detail: "Universal APK · arm64, armeabi-v7a, x86_64",
        action: "Download APK",
        note: "Android will ask you to allow installs from this source the first time.",
        pending:
          "Not in this release yet. The signing keystore has to be created once before Android builds can be published.",
        pendingAction: "See releases",
      },
      ios: {
        platform: "iOS",
        title: "iPhone and iPad",
        detail: "Distributed through TestFlight",
        action: "Open TestFlight",
        note: "Placeholder link. Swap in the public TestFlight invite once the Apple Developer account work is done.",
        pending: "Test link only - the build is not on TestFlight yet.",
        pendingAction: "Open TestFlight",
      },
      pendingBadge: "Not yet",
      checksum: "SHA-256",
      copy: "Copy checksum",
      copied: "Copied",
      size: "Download size",
    },
    flow: {
      title: "Your machine does the work. Your workspace sets the rules.",
      body: "Prime-X separates local execution from enterprise governance, so teams can move quickly without losing oversight.",
      points: [
        {
          title: "Keep secrets local",
          body: "Provider keys are protected by your operating system and are not sent to the workspace.",
        },
        {
          title: "Approve consequential actions",
          body: "Sensitive tools can pause for a clear human decision before anything runs.",
        },
        {
          title: "Retain an audit trail",
          body: "Runs, tool calls, approvals, and policy decisions remain visible to authorized teams.",
        },
      ],
    },
    install: {
      title: "Install with confidence",
      body: "The preview is not code-signed yet. Use the published checksum to verify the file you received.",
      macTitle: "On Apple silicon",
      macSteps: [
        "Open the DMG and drag Prime-X into Applications.",
        "Open Prime-X. If macOS blocks it, open System Settings, then Privacy & Security.",
        "Confirm Open Anyway only after the SHA-256 checksum matches.",
      ],
      windowsTitle: "On Windows 10 or 11",
      windowsSteps: [
        "Run the downloaded EXE installer.",
        "If SmartScreen appears, choose More info to review the publisher warning.",
        "Choose Run anyway only after the SHA-256 checksum matches.",
      ],
    },
    footer: {
      status: "Technical Preview",
      privacy:
        "This site does not collect API keys, credentials, or usage data.",
      source: "Prime-X source code remains private.",
      releases: "All releases",
    },
    aria: {
      home: "Prime-X home",
      theme: "Toggle color theme",
      language: "Switch language",
      github: "View releases on GitHub",
    },
  },
  zh: {
    nav: { download: "下载", safety: "工作方式", install: "安装" },
    hero: {
      eyebrow: "技术预览版",
      titleLine1: "本地 Agent。",
      titleLine2: "企业治理。",
      body: "在你的电脑上运行 AI Agent，同时通过 Workspace 管理身份、策略、审批与审计。",
      releaseNotes: "查看发布说明",
      macCta: "下载 macOS 版",
      windowsCta: "下载 Windows 版",
      chooseCta: "选择安装包",
      preview: "预览版本",
    },
    trust: ["本地执行", "系统加密凭据", "Workspace 治理", "私有 MCP 接入"],
    download: {
      title: "选择你的桌面系统",
      body: "以下未签名预览版本面向内部团队和合作伙伴开发者。安装前请核对文件校验值。",
      latest: "最新 Pre-release",
      fallback: "暂时无法查询最新 Release，已验证的下载链接仍可正常使用。",
      mac: {
        platform: "macOS",
        title: "Apple 芯片",
        detail: "macOS 13 或更高版本 · ARM64 DMG",
        action: "下载 DMG",
        note: "未签名预览版。macOS 可能要求你在隐私与安全性中确认打开。",
      },
      windows: {
        platform: "Windows",
        title: "Windows 10 或 11",
        detail: "64 位 · NSIS 安装程序",
        action: "下载 EXE",
        note: "未签名预览版。Windows SmartScreen 可能要求你确认安装程序。",
      },
      mobileTitle: "手机与平板",
      mobileBody:
        "移动端跟随同一个版本发布。Android 直接装 APK；iOS 走 TestFlight。",
      android: {
        platform: "Android",
        title: "Android 8 及以上",
        detail: "通用 APK · arm64、armeabi-v7a、x86_64",
        action: "下载 APK",
        note: "首次安装时 Android 会问一句「允许从此来源安装应用」，同意即可。",
        pending:
          "本版还没有安卓包。需要先一次性建好签名密钥库，之后每版才能自动挂上来。",
        pendingAction: "查看发布页",
      },
      ios: {
        platform: "iOS",
        title: "iPhone 与 iPad",
        detail: "通过 TestFlight 分发",
        action: "打开 TestFlight",
        note: "当前是占位链接。Apple 开发者账号那两件事做完后，换成正式的 TestFlight 公开邀请链接。",
        pending: "仅测试链接：安装包还没上 TestFlight。",
        pendingAction: "打开 TestFlight",
      },
      pendingBadge: "暂未提供",
      checksum: "SHA-256",
      copy: "复制校验值",
      copied: "已复制",
      size: "安装包大小",
    },
    flow: {
      title: "你的电脑负责执行，Workspace 负责规则。",
      body: "Prime-X 将本地执行与企业治理分离，让团队在快速工作的同时保留必要的控制与透明度。",
      points: [
        {
          title: "凭据留在本机",
          body: "模型服务密钥由操作系统保护，不会发送到 Workspace。",
        },
        {
          title: "关键操作先审批",
          body: "敏感工具执行前可以暂停，等待用户做出清晰决定。",
        },
        {
          title: "保留完整审计",
          body: "运行、工具调用、审批与策略决定对授权团队保持可见。",
        },
      ],
    },
    install: {
      title: "确认无误后安装",
      body: "预览版暂未进行代码签名。请使用公开的 SHA-256 校验值确认文件完整性。",
      macTitle: "Apple 芯片 Mac",
      macSteps: [
        "打开 DMG，将 Prime-X 拖入应用程序文件夹。",
        "打开 Prime-X。如果被系统阻止，请前往系统设置中的隐私与安全性。",
        "确认 SHA-256 一致后，再选择仍要打开。",
      ],
      windowsTitle: "Windows 10 或 11",
      windowsSteps: [
        "运行下载的 EXE 安装程序。",
        "如果出现 SmartScreen，请选择更多信息并查看发布者提示。",
        "确认 SHA-256 一致后，再选择仍要运行。",
      ],
    },
    footer: {
      status: "技术预览版",
      privacy: "本站不会收集 API Key、凭据或使用数据。",
      source: "Prime-X 源代码仍为私有。",
      releases: "全部版本",
    },
    aria: {
      home: "Prime-X 首页",
      theme: "切换颜色主题",
      language: "切换语言",
      github: "在 GitHub 查看发布版本",
    },
  },
} as const;

export type Language = keyof typeof copy;

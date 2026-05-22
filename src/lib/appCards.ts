export type AppCard = {
  packageName: string
  title: string
  content: string
}

export const APP_CARDS: Record<string, AppCard> = {
  'com.android.chrome': {
    packageName: 'com.android.chrome',
    title: 'Chrome',
    content: [
      '# Chrome App Card',
      '- The address bar is at the top; tap it to enter URLs or search queries.',
      '- The tab switcher and overflow menu are usually near the top-right.',
      '- For searches, type directly into the address bar and press Enter.',
      '- Wait for page loading indicators to settle before verifying page content.',
    ].join('\n'),
  },
  'com.google.android.gm': {
    packageName: 'com.google.android.gm',
    title: 'Gmail',
    content: [
      '# Gmail App Card',
      '- The compose button is usually in the lower-right area.',
      '- Search supports terms like from:, to:, subject:, has:attachment, and newer_than:.',
      '- Open email threads by tapping the visible sender or subject row.',
      '- Stop before sending or deleting messages unless the user explicitly asked for it.',
    ].join('\n'),
  },
  'com.android.settings': {
    packageName: 'com.android.settings',
    title: 'Settings',
    content: [
      '# Settings App Card',
      '- Search is often the fastest path for deeply nested settings.',
      '- Network, Bluetooth, Display, Apps, and System sections may be visible on the main page.',
      '- Verify toggles by reading their final checked/on/off state before finishing.',
      '- Be careful with resets, permissions, accounts, passwords, and security changes.',
    ].join('\n'),
  },
}

export function resolveAppCard(packageName?: string) {
  if (!packageName) {
    return undefined
  }
  return APP_CARDS[packageName]?.content
}

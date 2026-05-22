import type { Locale } from './appCopy'

export type TaskTemplate = {
  id: string
  title: string
  prompt: string
}

export const TASK_TEMPLATES: Record<Locale, TaskTemplate[]> = {
  'en-US': [
    {
      id: 'open-wifi-settings',
      title: 'Open Wi-Fi settings',
      prompt: 'Open Settings and show the Wi-Fi page.',
    },
    {
      id: 'toggle-wifi',
      title: 'Toggle Wi-Fi',
      prompt:
        'Open the Wi-Fi settings page, switch Wi-Fi to the opposite state, and confirm the final Wi-Fi state.',
    },
    {
      id: 'launch-app',
      title: 'Launch app',
      prompt:
        'Launch the app named <app name>, wait until it is fully visible, and report the current screen.',
    },
    {
      id: 'fill-form',
      title: 'Fill form',
      prompt:
        'Fill the visible form with these values: <field values>. Stop before submitting if the submit action is sensitive.',
    },
    {
      id: 'screenshot-verify',
      title: 'Screenshot verification',
      prompt:
        'Inspect the current screen and verify whether <expected state> is visible. Take no action unless verification requires navigation.',
    },
  ],
  'zh-CN': [
    {
      id: 'open-wifi-settings',
      title: '打开 Wi-Fi 设置',
      prompt: '打开系统设置并显示 Wi-Fi 页面。',
    },
    {
      id: 'toggle-wifi',
      title: '切换 Wi-Fi',
      prompt: '打开 Wi-Fi 设置页面，将 Wi-Fi 切换到相反状态，并确认最终 Wi-Fi 状态。',
    },
    {
      id: 'launch-app',
      title: '启动应用',
      prompt: '启动名为 <应用名称> 的应用，等待它完整显示，然后报告当前屏幕。',
    },
    {
      id: 'fill-form',
      title: '填写表单',
      prompt: '使用这些值填写当前可见表单：<字段和值>。如果提交属于敏感操作，请在提交前停止。',
    },
    {
      id: 'screenshot-verify',
      title: '截图验证',
      prompt: '检查当前屏幕并验证是否能看到 <期望状态>。除非验证需要导航，否则不要执行其他动作。',
    },
  ],
}

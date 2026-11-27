import { Linking, Platform } from 'react-native';

export async function openUrl(url: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (/^https?:\/\//.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
    return;
  }
  await Linking.openURL(url);
}

/** Downloads a file served from /public (e.g. '/resume.pdf'). */
export function downloadFile(url: string, filename: string) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }
  void openUrl(url);
}

export function mailto(email: string, subject?: string, body?: string) {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${parts.length ? `?${parts.join('&')}` : ''}`;
}

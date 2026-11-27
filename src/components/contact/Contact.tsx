import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowUpRight, Check, Copy, Mail, Send } from '@/components/ui/icons';
import { colors, radius, sans, serif, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { profile } from '@/data/profile';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { IconLink } from '@/components/ui/IconLink';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { mailto, openUrl } from '@/utils/links';

type Errors = Partial<Record<'name' | 'subject' | 'message', string>>;

/**
 * No backend: the form validates the message and opens the visitor's own
 * email app with everything pre-filled (mailto).
 */
export function Contact({ onMeasure }: { onMeasure?: (id: string, y: number) => void }) {
  const { isDesktop } = useBreakpoint();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = 'Please enter your name.';
    if (subject.trim().length < 2) e.subject = 'Please add a subject.';
    if (message.trim().length < 10) e.message = 'Please write at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const body = `${message.trim()}\n\n— ${name.trim()}`;
    openUrl(mailto(profile.email, subject.trim(), body));
    setOpened(true);
  };

  const copyEmail = async () => {
    if (Platform.OS === 'web' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard blocked — the address is still visible to copy manually */
      }
    }
  };

  return (
    <Section id="contact" tone="plum" onMeasure={onMeasure}>
      <View style={[styles.grid, isDesktop && { flexDirection: 'row' }]}>
        <View style={[styles.left, isDesktop && { flex: 1 }]}>
          <SectionHeader
            id="contact"
            eyebrow="Contact"
            title="Let’s work together."
            intro="I am looking for an OJT placement where I can contribute and keep learning. Send me a message — I would be glad to hear from you."
            inverted
          />

          <View style={styles.emailRow}>
            <Pressable
              role="link"
              onPress={() => openUrl(mailto(profile.email))}
              accessibilityLabel={`Email ${profile.email}`}
              style={styles.emailLink}
            >
              <Mail size={20} color={colors.rose} strokeWidth={1.7} />
              <Text style={[styles.email, !isDesktop && { fontSize: 18 }]} selectable>
                {profile.email}
              </Text>
            </Pressable>
            {Platform.OS === 'web' ? (
              <Pressable
                role="button"
                onPress={copyEmail}
                accessibilityLabel={copied ? 'Email copied' : 'Copy email address'}
                style={styles.copy}
              >
                {copied ? <Check size={16} color={colors.blush} /> : <Copy size={16} color={colors.blush} />}
                <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.links}>
            {profile.githubUrl ? (
              <ProfileLink label="GitHub" url={profile.githubUrl} icon={<GithubIcon color={colors.cream} />} />
            ) : null}
            {profile.linkedinUrl ? (
              <ProfileLink label="LinkedIn" url={profile.linkedinUrl} icon={<LinkedinIcon color={colors.cream} />} />
            ) : null}
            {profile.otherLinks.map((l) => (
              <ProfileLink key={l.url} label={l.label} url={l.url} icon={<ArrowUpRight size={18} color={colors.cream} />} />
            ))}
          </View>
        </View>

        <View style={[styles.form, isDesktop && { flex: 1 }]} role="form" aria-label="Compose an email">
          <Field label="Your name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
          <Field label="Subject" value={subject} onChange={setSubject} error={errors.subject} />
          <Field label="Message" value={message} onChange={setMessage} error={errors.message} multiline />
          <Button label="Compose email" icon={Send} onPress={submit} />
          <Text style={styles.note}>
            {opened
              ? 'Your email app should open with the message ready to send. If nothing happened, email me directly at the address on the left.'
              : 'This opens your own email app with the message filled in — nothing is stored on this website.'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} {profile.fullName}
        </Text>
        <Text style={styles.footerText}>Built with React Native, Expo, and TypeScript</Text>
      </View>
    </Section>
  );
}

function ProfileLink({ label, url, icon }: { label: string; url: string; icon: React.ReactNode }) {
  return (
    <View style={styles.profileLink}>
      <IconLink url={url} label={`${label} profile`} inverted>
        {icon}
      </IconLink>
      <Text style={styles.profileLinkText}>{label}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  multiline,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  multiline?: boolean;
  autoComplete?: 'name';
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        accessibilityLabel={label}
        aria-invalid={!!error}
        multiline={multiline}
        numberOfLines={multiline ? 5 : 1}
        autoComplete={autoComplete}
        maxLength={multiline ? 3000 : 150}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          multiline && styles.textarea,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space.xxxl, alignItems: 'flex-start' },
  left: { width: '100%' },
  emailRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: space.md, marginBottom: space.xxl },
  emailLink: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  email: { ...serif('400'), fontSize: 24, color: colors.cream, letterSpacing: -0.3 },
  copy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(235,197,203,0.35)',
    cursor: 'pointer',
  },
  copyText: { ...sans('600'), fontSize: 12.5, color: colors.blush },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xl },
  profileLink: { alignItems: 'center', gap: 6 },
  profileLinkText: { ...sans('500'), fontSize: 12, color: colors.blush },
  form: {
    width: '100%',
    backgroundColor: colors.ivory,
    borderRadius: radius.xl,
    padding: space.xxl,
    gap: space.lg,
  },
  label: { ...sans('700'), fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.plum },
  input: {
    ...sans('500'),
    fontSize: 15.5,
    color: colors.plum,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...({ outlineStyle: 'none' } as object),
  },
  textarea: { minHeight: 130, textAlignVertical: 'top' },
  inputFocused: { borderColor: colors.mauve, backgroundColor: colors.white },
  inputError: { borderColor: '#B4475E' },
  error: { ...sans('600'), fontSize: 12.5, color: '#A63D55' },
  note: { ...sans('400'), fontSize: 13, lineHeight: 20, color: colors.plumSoft },
  footer: {
    marginTop: space.huge,
    paddingTop: space.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(235,197,203,0.2)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.md,
  },
  footerText: { ...sans('500'), fontSize: 13, color: colors.blush },
});

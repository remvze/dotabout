import { useEffect, useState } from 'react';
import { cn } from '@/helpers/styles';
import { ProfileSchema } from '@/validators/profile';
import { Container } from '../container';
import { LinksSection } from './links-section';
import { ListSection } from './list-section';
import styles from './profile.module.css';
import { Section } from './section';
import { StackSection } from './stack-section';
import { TextSection } from './text-section';
import type { ProfileData, ProfileSection, ValidationError } from './types';

interface ProfileProps {
  source: string;
}

export function Profile({ source }: ProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setProfile(null);
      setErrors([]);
      setError('');

      const response = await fetch(source);

      if (!response.ok) {
        if (!cancelled) {
          setError('Profile not found.');
        }

        return;
      }

      const data = await response.json();
      const parsed = ProfileSchema.safeParse(data);

      if (!parsed.success) {
        if (!cancelled) {
          setErrors(
            parsed.error.issues.map(issue => ({
              message: issue.message,
              path: issue.path.join(' -> '),
            })),
          );
        }

        return;
      }

      if (!cancelled) {
        setProfile(parsed.data);
      }
    }

    loadProfile().catch(() => {
      if (!cancelled) {
        setError('Something went wrong. The JSON file might be invalid.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const previousTitle = document.title;
    const previousBackground = document.body.style.background;

    document.title = `${profile.name} - Dotabout`;

    if (profile.style?.theme === 'light') {
      document.body.style.background = 'var(--color-neutral-950)';
    }

    return () => {
      document.title = previousTitle;
      document.body.style.background = previousBackground;
    };
  }, [profile]);

  if (error) {
    return <ProfileError message={error} />;
  }

  if (errors.length > 0) {
    return <ProfileValidationErrors errors={errors} />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div
      className={cn(
        profile.style?.theme === 'light' ? styles.light : styles.dark,
        profile.style?.font === 'serif' && styles.serif,
      )}
    >
      <Container>
        <div className={styles.logo} />

        <header className={styles.header}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.description}>{profile.description}</p>
        </header>

        <main>
          {profile.sections?.map(section => (
            <Section key={section.title} title={section.title}>
              <ProfileSectionContent section={section} />
            </Section>
          ))}
        </main>

        <footer className={styles.footer}>
          Created using <a href="https://dotabout.me">Dotabout</a>.
        </footer>
      </Container>
    </div>
  );
}

function ProfileSectionContent({ section }: { section: ProfileSection }) {
  switch (section.type) {
    case 'list':
      return <ListSection section={section} />;
    case 'text':
      return <TextSection section={section} />;
    case 'links':
      return <LinksSection section={section} />;
    case 'stack':
      return <StackSection section={section} />;
  }
}

function ProfileError({ message }: { message: string }) {
  return (
    <div className={styles.singleError}>
      <Container>
        <p className={styles.errorText}>Error: {message}</p>
      </Container>
    </div>
  );
}

function ProfileValidationErrors({ errors }: { errors: ValidationError[] }) {
  return (
    <Container>
      <div className={styles.errors}>
        <h1 className={styles.errorTitle}>Wrong Format:</h1>

        {errors.map(error => (
          <p className={styles.error} key={`${error.path}:${error.message}`}>
            <span>[{error.path}]:</span> {error.message}
          </p>
        ))}
      </div>
    </Container>
  );
}

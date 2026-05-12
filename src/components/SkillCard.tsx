import { makeStyles, Text, tokens } from '@fluentui/react-components';
import type { Skill } from '../data/skills';

interface SkillCardProps {
  skill: Skill;
  accentColor: string;
}

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '12px',
    padding: '16px 18px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
    },
  },
  accentBar: {
    height: '3px',
    width: '28px',
    borderRadius: '2px',
    flexShrink: 0,
  },
  name: {
    color: tokens.colorNeutralForeground1,
  },
  command: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: 'ui-monospace, "Cascadia Code", monospace',
    letterSpacing: '0.2px',
  },
  description: {
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
});

export function SkillCard({ skill, accentColor }: SkillCardProps) {
  const styles = useStyles();
  return (
    <div className={styles.card}>
      <div className={styles.accentBar} style={{ backgroundColor: accentColor }} />
      <Text weight="semibold" size={300} className={styles.name}>
        {skill.displayName}
      </Text>
      <span className={styles.command}>/{skill.id}</span>
      <Text size={200} className={styles.description}>
        {skill.description}
      </Text>
    </div>
  );
}

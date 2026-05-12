import { useState, useMemo } from 'react';
import {
  Input,
  makeStyles,
  mergeClasses,
  Text,
  tokens,
  Button,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import { SKILL_CATEGORIES } from './data/skills';
import { SkillCard } from './components/SkillCard';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: '#111113',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: '80px',
    paddingBottom: '48px',
    paddingLeft: '32px',
    paddingRight: '32px',
    gap: '10px',
  },
  sparkle: {
    fontSize: '38px',
    lineHeight: '1',
    marginBottom: '4px',
    color: '#e8703a',
  },
  greeting: {
    color: tokens.colorNeutralForeground3,
  },
  title: {
    fontSize: '44px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    lineHeight: '1.1',
    color: tokens.colorNeutralForeground1,
    marginTop: '-2px',
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  searchWrapper: {
    width: '100%',
    maxWidth: '520px',
    marginTop: '20px',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '4px 32px 36px',
  },
  filterBtn: {
    borderRadius: '20px',
    fontSize: tokens.fontSizeBase200,
    paddingLeft: '14px',
    paddingRight: '14px',
    height: '30px',
    minWidth: 'unset',
  },
  filterBtnActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 32px 80px',
  },
  categorySection: {
    marginBottom: '48px',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  categoryDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  categoryCount: {
    marginLeft: 'auto',
    color: tokens.colorNeutralForeground3,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 32px',
    color: tokens.colorNeutralForeground3,
  },
  footer: {
    textAlign: 'center',
    paddingTop: '16px',
    paddingBottom: '32px',
    color: tokens.colorNeutralForeground4,
    lineHeight: '1.6',
  },
});

function App() {
  const styles = useStyles();
  const day = DAYS[new Date().getDay()];
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const cats = activeCategory
      ? SKILL_CATEGORIES.filter((c) => c.id === activeCategory)
      : SKILL_CATEGORIES;
    if (!search.trim()) return cats;
    const q = search.toLowerCase();
    return cats
      .map((cat) => ({
        ...cat,
        skills: cat.skills.filter(
          (s) =>
            s.displayName.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [search, activeCategory]);

  const totalVisible = filteredCategories.reduce((sum, c) => sum + c.skills.length, 0);
  const totalSkills = SKILL_CATEGORIES.reduce((sum, c) => sum + c.skills.length, 0);

  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.sparkle}>✦</div>
        <Text size={300} className={styles.greeting}>
          Happy {day}
        </Text>
        <div className={styles.title}>Marketing Skills</div>
        <Text size={300} className={styles.subtitle}>
          {totalSkills} AI agent skills across {SKILL_CATEGORIES.length} categories
        </Text>
        <div className={styles.searchWrapper}>
          <Input
            appearance="filled-darker"
            contentBefore={<Search24Regular />}
            placeholder="Search skills..."
            value={search}
            onChange={(_, d) => setSearch(d.value)}
            size="large"
            style={{ width: '100%', borderRadius: '40px' }}
          />
        </div>
      </div>

      <div className={styles.filters}>
        <Button
          className={mergeClasses(styles.filterBtn, !activeCategory ? styles.filterBtnActive : undefined)}
          appearance={!activeCategory ? 'primary' : 'subtle'}
          onClick={() => setActiveCategory(null)}
        >
          All skills
        </Button>
        {SKILL_CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            className={mergeClasses(
              styles.filterBtn,
              activeCategory === cat.id ? styles.filterBtnActive : undefined
            )}
            appearance={activeCategory === cat.id ? 'primary' : 'subtle'}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div className={styles.content}>
        {filteredCategories.map((cat) => (
          <div key={cat.id} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <div className={styles.categoryDot} style={{ backgroundColor: cat.color }} />
              <Text weight="semibold" size={400}>
                {cat.name}
              </Text>
              <Text size={200} className={styles.categoryCount}>
                {cat.skills.length} {cat.skills.length === 1 ? 'skill' : 'skills'}
              </Text>
            </div>
            <div className={styles.grid}>
              {cat.skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} accentColor={cat.color} />
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className={styles.emptyState}>
            <Text size={400}>No skills found matching &ldquo;{search}&rdquo;</Text>
          </div>
        )}
        <div className={styles.footer}>
          {filteredCategories.length > 0 && (
            <Text size={200} style={{ display: 'block' }}>
              Showing {totalVisible} of {totalSkills} skills
            </Text>
          )}
          <Text size={200} style={{ display: 'block', marginTop: '8px' }}>
            Based on{' '}
            <a href="https://github.com/coreyhaines31/marketingskills" target="_blank" rel="noopener noreferrer" style={{ color: tokens.colorNeutralForeground3 }}>
              coreyhaines31/marketingskills
            </a>
            {' '}&mdash; MIT License &copy; 2025 Corey Haines
          </Text>
        </div>
      </div>
    </div>
  );
}

export default App;

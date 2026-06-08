export type Accent = "coral" | "violet" | "mint";

export type Section = {
  id: "hsk" | "lc" | "n1";
  href: string;
  emoji: string;
  accent: Accent;
  tag: string;
  badge: string;
  zh: string;
  title: string;
  sub: string;
  count: string;
  unit: string;
  levels: string[];
};

export type HskLevel = {
  id: string;
  label: string;
  cn: string;
  emoji: string;
  color: string;
  soft: string;
  count: number;
  desc: string;
};

export type HskSystem = {
  name: string;
  subtitle: string;
  accent: Accent;
  levels: HskLevel[];
};

export type Classifier = {
  id: string;
  char: string;
  pinyin: string;
  ar: string;
  hsk: number;
  usage: string;
  examples: { zh: string; ar: string }[];
};

export type NavItem = {
  href: string;
  label: string;
  icon: "Home" | "Layers" | "Sparkles" | "TrendingUp" | "Trophy";
};

export type Word = {
  w: string;
  p: string;
  m: string;
  s: string;
  sa: string;
};

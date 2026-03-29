export type PostKind =
  | "news"
  | "article"
  | "analytics"
  | "interview"
  | "video";

export interface Author {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  social?: { label: string; href: string }[];
}

export interface Rubric {
  slug: string;
  name: string;
  description: string;
  cover: string;
}

export interface TagEntity {
  slug: string;
  name: string;
}

export interface TocItem {
  id: string;
  label: string;
}

export interface Post {
  id: string;
  slug: string;
  kind: PostKind;
  title: string;
  subtitle?: string;
  lead: string;
  paragraphs: string[];
  image: string;
  authorId: string;
  rubricSlugs: string[];
  tagSlugs: string[];
  publishedAt: string;
  urgent?: boolean;
  pinned?: boolean;
  readMin?: number;
  /** YouTube video ID for embed */
  youtubeId?: string;
  durationLabel?: string;
  guestName?: string;
  guestBio?: string;
  materialType?: string;
  quotes?: { text: string; attribution?: string }[];
  keyPoints?: string[];
  toc?: TocItem[];
  timecodes?: { t: string; label: string }[];
  /** Короткий ярлык на главной (герой) */
  homeBadge?: string;
  /** Текст основной кнопки на главной */
  homeCta?: string;
  /** Переопределение <title> и og:title (Make / ручной SEO) */
  seoTitle?: string;
  /** Meta description и og:description до ~320 символов */
  seoDescription?: string;
}

export interface SpecialProject {
  slug: string;
  title: string;
  dek: string;
  cover: string;
  lead: string;
  blocks: { type: "text" | "quote" | "stat"; content: string; cite?: string }[];
  relatedSlugs: string[];
}

import type { Author, Post, Rubric, SpecialProject, TagEntity } from "./types";

const IMG = (id: string, w = 1600, h = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const authors: Author[] = [
  {
    id: "a1",
    slug: "elena-orlova",
    name: "Елена Орлова",
    role: "Главный редактор",
    bio: "15 лет в аналитической журналистике. Специализация — индустрии и макроэкономика.",
    photo: IMG("photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3", 400, 400),
    social: [{ label: "Telegram", href: "#" }],
  },
  {
    id: "a2",
    slug: "mikhail-vektor",
    name: "Михаил Вектор",
    role: "Обозреватель, технологии",
    bio: "Бывший инженер, сейчас рассказывает о том, как технологии меняют общество.",
    photo: IMG("photo-1560250097-0b93528c311a?ixlib=rb-4.0.3", 400, 400),
  },
  {
    id: "a3",
    slug: "anna-sokolova",
    name: "Анна Соколова",
    role: "Редактор раздела «Культура»",
    bio: "Кино, литература и цифровые практики внимания.",
    photo: IMG("photo-1580489944761-15a19d654956?ixlib=rb-4.0.3", 400, 400),
  },
  {
    id: "a4",
    slug: "dmitry-lens",
    name: "Дмитрий Ленский",
    role: "Видеопродюсер",
    bio: "Документалистика и студийные интервью.",
    photo: IMG("photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3", 400, 400),
  },
];

export const rubrics: Rubric[] = [
  {
    slug: "politika",
    name: "Политика",
    description: "Решения, институты, публичная повестка.",
    cover: IMG("photo-1529107386315-ec1ed2aeb4ae?ixlib=rb-4.0.3"),
  },
  {
    slug: "biznes",
    name: "Бизнес",
    description: "Компании, рынки, стратегии роста.",
    cover: IMG("photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3"),
  },
  {
    slug: "tekhnologii",
    name: "Технологии",
    description: "ИИ, инфраструктура, продукт и безопасность.",
    cover: IMG("photo-1518770660439-4636190af475?ixlib=rb-4.0.3"),
  },
  {
    slug: "kultura",
    name: "Культура",
    description: "Искусство, медиа и новые форматы потребления.",
    cover: IMG("photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3"),
  },
  {
    slug: "obshchestvo",
    name: "Общество",
    description: "Город, образование, социальные практики.",
    cover: IMG("photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3"),
  },
  {
    slug: "media",
    name: "Медиа",
    description: "Индустрия контента и доверие аудитории.",
    cover: IMG("photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3"),
  },
  {
    slug: "mneniya",
    name: "Мнения",
    description: "Колонки и авторская позиция редакции.",
    cover: IMG("photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3"),
  },
  {
    slug: "trendy",
    name: "Тренды",
    description: "Сигналы изменений на горизонте 12–24 месяцев.",
    cover: IMG("photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3"),
  },
];

export const tags: TagEntity[] = [
  { slug: "ekonomika", name: "Экономика" },
  { slug: "ai", name: "ИИ" },
  { slug: "klimat", name: "Климат" },
  { slug: "goroda", name: "Города" },
  { slug: "zdravookhranenie", name: "Здравоохранение" },
  { slug: "rynki", name: "Рынки" },
  { slug: "bezopasnost", name: "Безопасность" },
  { slug: "obrazovanie", name: "Образование" },
  { slug: "startapy", name: "Стартапы" },
  { slug: "regulirovanie", name: "Регулирование" },
  { slug: "potrebiteli", name: "Потребители" },
  { slug: "data", name: "Данные" },
];

const p = (
  partial: Omit<Post, "id" | "paragraphs"> & { paragraphs?: string[] }
): Post => ({
  id: partial.slug,
  paragraphs: partial.paragraphs ?? [
    "Мы собрали ключевые факты и контекст, чтобы вы могли быстро понять, что произошло и почему это важно.",
    "Редакция продолжит обновлять материал по мере появления проверенной информации.",
  ],
  ...partial,
});

export const posts: Post[] = [
  p({
    slug: "glavnyy-material-dnya-energetika",
    kind: "news",
    title: "Новая энергетическая повестка: что изменится для потребителей уже в этом сезоне",
    lead: "Краткий разбор решений, ценовых факторов и того, на что обратить внимание в ближайшие недели.",
    image: IMG("photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3"),
    authorId: "a1",
    rubricSlugs: ["biznes", "trendy"],
    tagSlugs: ["ekonomika", "klimat", "potrebiteli"],
    publishedAt: "2026-03-28T08:00:00.000Z",
    pinned: true,
    urgent: false,
    readMin: 4,
  }),
  p({
    slug: "srochno-regulator-obyavil-proverki",
    kind: "news",
    title: "Регулятор объявил о внеплановых проверках в секторе цифровых платформ",
    lead: "Первые итоги ожидаются через две недели; маркетплейсы уведомлены.",
    image: IMG("photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3"),
    authorId: "a2",
    rubricSlugs: ["tekhnologii", "media"],
    tagSlugs: ["regulirovanie", "data"],
    publishedAt: "2026-03-28T06:12:00.000Z",
    urgent: true,
    readMin: 2,
  }),
  p({
    slug: "gorodskaya-mobilnost-2026",
    kind: "news",
    title: "Городская мобильность в 2026: меньше пробок или новые очереди?",
    lead: "Как пересадки, MaaS и тарифы меняют ежедневные маршруты.",
    image: IMG("photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3"),
    authorId: "a3",
    rubricSlugs: ["obshchestvo"],
    tagSlugs: ["goroda", "potrebiteli"],
    publishedAt: "2026-03-27T14:30:00.000Z",
    readMin: 5,
  }),
  p({
    slug: "rynok-truda-it",
    kind: "news",
    title: "Рынок труда в IT: зарплатные вилки и спрос на роли с ИИ-компетенциями",
    lead: "Срез по данным рекрутёров и крупнейших работодателей.",
    image: IMG("photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3"),
    authorId: "a2",
    rubricSlugs: ["biznes", "tekhnologii"],
    tagSlugs: ["ai", "startapy"],
    publishedAt: "2026-03-27T09:00:00.000Z",
    readMin: 6,
  }),
  p({
    slug: "dlinnyy-tekst-kak-chitat-vnimatelno",
    kind: "article",
    title: "Как читать длинные тексты внимательно: методика редакции МарсМедиа",
    subtitle: "Практика для читателей и авторов",
    lead: "Собрали приёмы, которые помогают не терять нить в сложных материалах.",
    image: IMG("photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3"),
    authorId: "a1",
    rubricSlugs: ["media", "mneniya"],
    tagSlugs: ["obrazovanie"],
    publishedAt: "2026-03-26T10:00:00.000Z",
    readMin: 12,
    materialType: "Колонка",
    keyPoints: [
      "Делите текст на смысловые блоки и фиксируйте один тезис на абзац.",
      "Возвращайтесь к заголовкам как к карте сюжета.",
      "Проверяйте источники: кто говорит и какие у него стимулы.",
    ],
    toc: [
      { id: "bloki", label: "Смысловые блоки" },
      { id: "istoki", label: "Источники и стимулы" },
      { id: "praktika", label: "Практика на неделю" },
    ],
    paragraphs: [
      "Длинный текст — это не «много букв», а управляемая архитектура внимания. Если автор продумал ритм, читатель проходит материал без ощущения усталости.",
      "Первый принцип — якоря. Подзаголовки, врезки и короткие резюме позволяют читать выборочно, не теряя целостности.",
      "Второй принцип — прозрачность источника. Мы прямо обозначаем, когда это данные, когда интерпретация, а когда мнение.",
      "Третий принцип — связность. Каждый раздел должен отвечать на вопрос: зачем он здесь и как ведёт к выводу.",
      "На практике попробуйте читать с карандашом (или заметками в приложении): одна строка на абзац — суть. Это быстро показывает, где текст размывается.",
      "Если материал кажется «слишком убедительным», проверьте контрфакт: что должно быть правдой, чтобы выводы перестали работать? Это лучший тест на честность аргументации.",
    ],
  }),
  p({
    slug: "kulturnye-sezonnye-sdvigi",
    kind: "article",
    title: "Культурные сезонные сдвиги: что смотрит аудитория между фестивалями",
    lead: "Стриминг, офлайн и гибридные форматы — в одном обзоре.",
    image: IMG("photo-1485846234645-a62644f84728?ixlib=rb-4.0.3"),
    authorId: "a3",
    rubricSlugs: ["kultura"],
    tagSlugs: ["potrebiteli", "media"],
    publishedAt: "2026-03-25T16:00:00.000Z",
    readMin: 9,
    materialType: "Обзор",
    paragraphs: [
      "Между крупными релизами аудитория не «отдыхает» — она переключается на короткие форматы и нишевые подборки.",
      "Платформы конкурируют не только контентом, но и ритмом: как быстро появляется следующая причина вернуться.",
      "Для создателей это означает необходимость серийности даже вне больших IP: мини-циклы, подкасты-комментарии, живые эфиры.",
    ],
  }),
  p({
    slug: "makroprognoz-vtoroy-kvartal",
    kind: "analytics",
    title: "Макропрогноз на II квартал: риски, индикаторы и сценарии",
    lead: "Спокойный разбор без лозунгов — только то, что можно проверить цифрами.",
    image: IMG("photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3"),
    authorId: "a1",
    rubricSlugs: ["biznes", "trendy"],
    tagSlugs: ["ekonomika", "rynki"],
    publishedAt: "2026-03-24T09:00:00.000Z",
    readMin: 18,
    materialType: "Аналитика",
    keyPoints: [
      "Базовый сценарий предполагает мягкое охлаждение потребительского спроса.",
      "Ключевой индикатор — динамика займов малого бизнеса и ставки по ним.",
      "Геополитические шоки остаются главным источником волатильности.",
    ],
    paragraphs: [
      "Аналитика — это дисциплина гипотез. Мы фиксируем допущения и показываем, какие данные их подтвердят или опровергнут.",
      "В базовом сценарии второго квартала инфляционное давление остаётся управляемым при сохранении текущих ставок.",
      "Альтернативный сценарий связан с цепочками поставок в отдельных отраслях: локальные разрывы могут дать кратковременные ценовые всплески.",
      "Для читателя важнее не «угадать будущее», а понимать логику: какие рычаги сработают первыми и где появится сигнал тревоги.",
      "Ниже — таблица индикаторов, за которыми редакция будет следить еженедельно.",
    ],
  }),
  p({
    slug: "ai-infra-struktura",
    kind: "analytics",
    title: "ИИ-инфраструктура: где заканчивается хайп и начинается инженерия",
    lead: "Вычисления, данные, лицензии и эксплуатационные расходы.",
    image: IMG("photo-1677442136019-21780ecad995?ixlib=rb-4.0.3"),
    authorId: "a2",
    rubricSlugs: ["tekhnologii"],
    tagSlugs: ["ai", "data", "startapy"],
    publishedAt: "2026-03-23T11:00:00.000Z",
    readMin: 14,
    materialType: "Разбор",
    paragraphs: [
      "Пока рынок обсуждает модели, инфраструктурные команды решают вопросы задержек, стоимости токена и отказоустойчивости.",
      "Ключевой сдвиг — переход от «демо в браузере» к контрактам SLA и постоянным затратам на GPU/TPU.",
      "Регуляторика добавляет слой: где хранятся данные, кто несёт ответственность за выводы модели, как устроен аудит.",
    ],
  }),
  p({
    slug: "intervyu-rezhisser-dokumentalistika",
    kind: "interview",
    title: "«Зритель чувствует монтаж раньше, чем понимает сюжет»",
    lead: "Разговор о том, как устроена современная документалистика.",
    image: IMG("photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3"),
    authorId: "a3",
    rubricSlugs: ["kultura", "media"],
    tagSlugs: ["media", "potrebiteli"],
    publishedAt: "2026-03-22T12:00:00.000Z",
    readMin: 11,
    guestName: "Илья Кран",
    guestBio: "Режиссёр документальных проектов для стриминговых платформ.",
    youtubeId: "dQw4w9WgXcQ",
    quotes: [
      {
        text: "Документалистика сегодня — это дизайн доверия: одна неверная склейка рушит всё.",
        attribution: "Илья Кран",
      },
    ],
    paragraphs: [
      "Мы встретились в студии после премьеры и говорили о том, как меняется язык нон-фикшн.",
      "— Кран: Зритель очень быстро учится читать монтаж. Если ритм «продаёт эмоцию» вместо факта, это ощущается за секунды.",
      "— Редакция: Значит, авторская позиция должна быть честнее?",
      "— Кран: Она должна быть объяснимой. Позиция без опоры на материал — это уже реклама, не журналистика.",
    ],
  }),
  p({
    slug: "blits-cto-pro-industriyu",
    kind: "interview",
    title: "Блиц: CTO — про зрелость продуктовых команд",
    lead: "Короткие ответы на жёсткие вопросы.",
    image: IMG("photo-1553877522-43269d4ea984?ixlib=rb-4.0.3"),
    authorId: "a2",
    rubricSlugs: ["tekhnologii", "biznes"],
    tagSlugs: ["startapy", "ai"],
    publishedAt: "2026-03-21T09:30:00.000Z",
    readMin: 5,
    guestName: "Сергей Н.",
    guestBio: "CTO, B2B SaaS.",
    paragraphs: [
      "— Главная ошибка роста? — Нанимать «звёзд» без системы онбординга.",
      "— Что спасает продукт? — Дисциплина метрик и запрет на «вечный рефакторинг без пользователя».",
      "— Один совет основателям? — Пишите решения, а не статусы.",
    ],
  }),
  p({
    slug: "video-digest-novosti-nedeli",
    kind: "video",
    title: "Дайджест новостей недели за 8 минут",
    lead: "Главные события и контекст — без лишнего шума.",
    image: IMG("photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3"),
    authorId: "a4",
    rubricSlugs: ["media"],
    tagSlugs: ["media", "ekonomika"],
    publishedAt: "2026-03-28T07:00:00.000Z",
    youtubeId: "dQw4w9WgXcQ",
    durationLabel: "8:12",
    timecodes: [
      { t: "0:00", label: "Вступление" },
      { t: "1:10", label: "Экономика" },
      { t: "3:40", label: "Технологии" },
      { t: "6:20", label: "Итоги" },
    ],
    paragraphs: [
      "Короткий видеоформат для тех, кто хочет понять повестку до глубокого чтения.",
      "В описании — ссылки на материалы редакции, которые раскрывают каждую тему подробнее.",
    ],
  }),
  p({
    slug: "video-razbor-rynka-aktsiy",
    kind: "video",
    title: "Разбор рынка акций: что показывают потоки за март",
    lead: "Графики и комментарии аналитика.",
    image: IMG("photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3"),
    authorId: "a1",
    rubricSlugs: ["biznes"],
    tagSlugs: ["rynki", "data"],
    publishedAt: "2026-03-27T11:00:00.000Z",
    youtubeId: "dQw4w9WgXcQ",
    durationLabel: "14:05",
    paragraphs: [
      "Студийный разбор с доской и понятными определениями для неспециалистов.",
    ],
  }),
  p({
    slug: "video-reportazh-gorod",
    kind: "video",
    title: "Репортаж: город до и после ночных ограничений",
    lead: "Как меняется ритм улиц и сервисов.",
    image: IMG("photo-1514565131-fce0801e5785?ixlib=rb-4.0.3"),
    authorId: "a3",
    rubricSlugs: ["obshchestvo"],
    tagSlugs: ["goroda"],
    publishedAt: "2026-03-26T18:00:00.000Z",
    youtubeId: "dQw4w9WgXcQ",
    durationLabel: "6:44",
    paragraphs: ["Съёмка в течение недели, монтаж — Дмитрий Ленский."],
  }),
];

export const specialProjects: SpecialProject[] = [
  {
    slug: "zelenaya-energetika-2030",
    title: "Зелёная энергетика 2030",
    dek: "Мультимедийный спецпроект",
    cover: IMG("photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3"),
    lead: "Серия материалов о переходе, инвестициях и бытовых последствиях.",
    blocks: [
      {
        type: "text",
        content:
          "Мы прошли цепочку от генерации до розетки: где появляются узкие места и кто на них зарабатывает.",
      },
      {
        type: "stat",
        content: "До 2030 года доля распределённой генерации в городах может вырасти вдвое при текущих темпах.",
      },
      {
        type: "quote",
        content: "Энергопереход — это не мораль, а инженерия и финансы.",
        cite: "Елена Орлова",
      },
    ],
    relatedSlugs: [
      "glavnyy-material-dnya-energetika",
      "makroprognoz-vtoroy-kvartal",
    ],
  },
  {
    slug: "media-doverie",
    title: "Медиа и доверие",
    dek: "Исследование аудитории",
    cover: IMG("photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3"),
    lead: "Как люди выбирают источники и что для них «доказательство».",
    blocks: [
      { type: "text", content: "Опрос, интервью и редакционные кейсы — в одном лендинге." },
      {
        type: "quote",
        content: "Доверие растёт там, где виден процесс проверки.",
        cite: "Анна Соколова",
      },
    ],
    relatedSlugs: ["dlinnyy-tekst-kak-chitat-vnimatelno"],
  },
];

export function authorBySlug(slug: string) {
  return authors.find((a) => a.slug === slug);
}

export function authorById(id: string) {
  return authors.find((a) => a.id === id);
}

export function rubricBySlug(slug: string) {
  return rubrics.find((r) => r.slug === slug);
}

export function tagBySlug(slug: string) {
  return tags.find((t) => t.slug === slug);
}

export function postBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function postsByKind(kind: Post["kind"]) {
  return posts.filter((p) => p.kind === kind);
}

export function postsForRubric(slug: string) {
  return posts.filter((p) => p.rubricSlugs.includes(slug));
}

export function postsForTag(slug: string) {
  return posts.filter((p) => p.tagSlugs.includes(slug));
}

export function postsByAuthor(authorSlug: string) {
  const a = authors.find((x) => x.slug === authorSlug);
  if (!a) return [];
  return posts.filter((p) => p.authorId === a.id);
}

export function relatedPosts(post: Post, limit = 4) {
  const tagSet = new Set(post.tagSlugs);
  const scored = posts
    .filter((x) => x.slug !== post.slug)
    .map((x) => ({
      x,
      s: x.rubricSlugs.filter((r) => post.rubricSlugs.includes(r)).length * 2 +
        x.tagSlugs.filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((z) => z.x);
}

export function searchPosts(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return [];
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(n) ||
      p.lead.toLowerCase().includes(n) ||
      p.tagSlugs.some((t) => t.includes(n)) ||
      p.rubricSlugs.some((r) => r.includes(n))
  );
}

export function featuredHero() {
  return posts.find((p) => p.pinned) ?? posts[0];
}

export function secondaryHero() {
  const hero = featuredHero();
  return posts
    .filter((p) => p.kind === "news" && p.slug !== hero.slug)
    .slice(0, 4);
}

export function urgentFeed() {
  return posts.filter((p) => p.urgent || p.kind === "news").slice(0, 8);
}

export function popularPosts() {
  return [...posts].sort(() => 0.3 - Math.random()).slice(0, 6);
}

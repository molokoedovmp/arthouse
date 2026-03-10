export interface Artist {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  photo: string;
  shortBio: string;
  bio: string[];
  bioEn: string[];
  quote?: string;
  quoteEn?: string;
}

export const artists: Artist[] = [
  {
    id: "olga-smirnova",
    name: "Ольга Смирнова",
    role: "Художник, педагог",
    roleEn: "Artist, Instructor",
    photo: "/images/img_adout.jpg",
    shortBio: "Живописец, иконописец, педагог. Выпускница МГАХИ им. В.И. Сурикова.",
    bio: [
      "Я родилась в г.\u00a0Дзержинске Нижегородской области. Получила высшее образование по специальности «Преподаватель английского и немецкого языков» в Нижегородском государственном лингвистическом университете им.\u00a0Н.А.\u00a0Добролюбова.",
      "Во время обучения в вузе произошло первое профессиональное знакомство с рисунком и живописью — в качестве факультатива преподавался курс «Учитель рисования». Я открыла для себя невероятный, волшебный мир красок и образов.",
      "Дальше были арт-студии и частные занятия с талантливыми художниками, получение диплома в 2009\u00a0г. по специальности «Дизайнер интерьера» в Международной Школе Дизайна. Я пробовала разные техники: мозаика, витраж, батик, работа с пастами и различными фактурными материалами, скульптура и, конечно же, живопись.",
      "В 2016\u00a0г. я поступила в православный институт «Со-действие» на факультет церковных искусств по специальности «Иконопись». В течение 6\u00a0лет осваивались техники левкаса, золочения и иконописи в древнерусском стиле, московская школа. Был опыт создания мерных, праздничных икон, росписи храмов, участие в создании иконостасов.",
      "Но мне всегда не хватало академического образования, поэтому в 2022\u00a0году я поступила в МГАХИ им.\u00a0В.И.\u00a0Сурикова, который с успехом закончила в этом году.",
    ],
    bioEn: [
      "I was born in Dzerzhinsk, Nizhny Novgorod Region. I received my higher education specializing in English and German language teaching at the Nizhny Novgorod State Linguistics University named after N.A. Dobrolyubov.",
      "During my university studies came my first professional encounter with drawing and painting — a course called 'Art Teacher' was offered as an elective. I discovered an incredible, magical world of colors and images.",
      "Then followed art studios and private lessons with talented artists, and in 2009 I earned a diploma in Interior Design from the International School of Design. I explored various techniques: mosaic, stained glass, batik, texture pastes and materials, sculpture, and of course, painting.",
      "In 2016, I enrolled at the Orthodox Institute 'Co-operation' in the Faculty of Church Arts, specializing in Icon Painting. Over 6 years I mastered the techniques of gesso preparation, gilding, and icon painting in the Old Russian style, Moscow school. I gained experience creating commemorative and festive icons, painting church interiors, and participating in the creation of iconostases.",
      "But I always felt the need for an academic foundation, so in 2022 I enrolled at the Moscow State Academic Art Institute named after V.I. Surikov, which I successfully completed this year.",
    ],
    quote: "Из всех изобразительных жанров меня больше всего привлекают пейзажи. Если иконопись пытается передать красоту мира Горнего, то пейзажи воспевают красоту мира земного — бесконечно прекрасного, созданного Господом по прообразу райского сада.",
    quoteEn: "Of all the visual genres, I am most drawn to landscapes. If icon painting tries to convey the beauty of the Heavenly world, then landscapes celebrate the beauty of the earthly world — endlessly beautiful, created by God in the image of the Garden of Eden.",
  },
];

// legacy – не используется, оставлено для совместимости
export const artistBio = [
  "Я родилась в г. Дзержинске Нижегородской области и с раннего детства ощущала, что рисунок — мой способ говорить с миром. Меня всегда вдохновляли тишина природы, фактура старых вещей и свет, который меняет пространство.",
  "Со временем живопись стала для меня пространством исследования — цвета, тишины, внутреннего ритма. В работах я ищу баланс между ясной формой и свободой жеста.",
  "В мастерской я создаю спокойную, внимательную атмосферу, где процесс важнее результата, а каждый ученик может найти свой визуальный язык.",
];

export const projectAbout = [
  "Все хотели бы рисовать, но это дано только избранным, так считают многие. А я совершенно не согласна с таким утверждением. Каждый ребёнок рождается талантливым художником, творцом. Но со временем мы часто перестаём видеть мир красочным и цветным, верить в себя, свободно творить, не оглядываясь на результат, просто наслаждаясь процессом.",
  "Кому это нужно, у тебя ничего не получится, кто это купит. Как часто мы слышим такие слова от своих близких, и эти программы заставляют нас отказаться от своей мечты и истинных желаний.",
  "Я предлагаю вернуться к истокам, вновь поверить в себя, убедиться, что рисовать может каждый. В каждом из нас живёт художник, и творчество — это не про результат, а про процесс, увлекательный процесс создания красоты. Когда ты творишь, мир перестаёт существовать, есть только ты, краски, полёт фантазии и радость от процесса.",
  "Мне очень нравится высказывание Ральфа Уолдо Эмерсона о том, что каждый художник сначала был любителем. Это даёт надежду каждому, кто берёт в руки краски и кисти, — шанс оказаться в этом волшебном, сказочном мире, вновь ощутить радость ничем не ограниченного детского мироощущения, почувствовать себя свободным, творцом.",
  "Территория творчества Арт Хаус создана специально для этого — предоставить каждому желающему возможность творить: в команде или самостоятельно, красками по холсту или керамике, с обучением или в свободной форме, для взрослых и детей. Мы рады всем и готовы поделиться знаниями, возможностями, пространством.",
];

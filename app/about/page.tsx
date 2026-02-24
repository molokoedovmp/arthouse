import Image from "next/image";
import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { projectAbout } from "../../data/content";

export const metadata = {
  title: "О проекте",
  description: "О художественной мастерской Арт Хаус и художнике Ольге Смирновой.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Художник */}
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-16 lg:items-start">
            {/* Логотип + имя */}
            <div className="flex flex-col items-center gap-4 text-center lg:sticky lg:top-28">
              <Image
                src="/images/img_adout.jpg"
                alt="Арт Хаус"
                width={300}
                height={300}
                className="w-full max-w-[260px] object-contain"
              />
              <div>
                <p className="font-display text-xl">Ольга Смирнова</p>
                <p className="caps mt-1 text-ink/50">Художник, педагог</p>
              </div>
            </div>

            {/* Биография */}
            <div className="space-y-6 text-[17px] leading-relaxed text-ink/80">
              <p>
                Я родилась в г.&nbsp;Дзержинске Нижегородской области. Получила высшее
                образование по специальности «Преподаватель английского и немецкого
                языков» в Нижегородском государственном лингвистическом университете
                им.&nbsp;Н.А.&nbsp;Добролюбова.
              </p>
              <p>
                Во время обучения в вузе произошло первое профессиональное знакомство с
                рисунком и живописью — в качестве факультатива преподавался курс
                «Учитель рисования». Я открыла для себя невероятный, волшебный мир
                красок и образов.
              </p>
              <p>
                Дальше были арт-студии и частные занятия с талантливыми художниками,
                получение диплома в 2009&nbsp;г. по специальности «Дизайнер интерьера»
                в Международной Школе Дизайна. Я пробовала разные техники: мозаика,
                витраж, батик, работа с пастами и различными фактурными материалами,
                скульптура и, конечно же, живопись.
              </p>
              <p>
                В 2016&nbsp;г. я поступила в православный институт «Со-действие» на
                факультет церковных искусств по специальности «Иконопись». В течение
                6&nbsp;лет осваивались техники левкаса, золочения и иконописи в
                древнерусском стиле, московская школа. Был опыт создания мерных,
                праздничных икон, росписи храмов, участие в создании иконостасов.
              </p>
              <p>
                Но мне всегда не хватало академического образования, поэтому в
                2022&nbsp;году я поступила в МГАХИ им.&nbsp;В.И.&nbsp;Сурикова, который
                с успехом закончила в этом году.
              </p>
              <p className="border-l-2 border-accent pl-5 text-ink/70 italic">
                Из всех изобразительных жанров меня больше всего привлекают пейзажи.
                Если иконопись пытается передать красоту мира Горнего, то пейзажи
                воспевают красоту мира земного — бесконечно прекрасного, созданного
                Господом по прообразу райского сада.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* О проекте */}
      <section className="border-b border-t border-ink/10">
        <Container className="!px-0">
          <div className="grid lg:grid-cols-[420px_1fr] lg:items-stretch">
            {/* Фото — вплотную к сепараторам, без отступов */}
            <div className="overflow-hidden bg-stone lg:border-r lg:border-ink/10">
              <Image
                src="/images/IMG_9250.jpg"
                alt="Студия Арт Хаус"
                width={600}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Текст с отступами */}
            <div className="px-6 py-12 lg:px-12 lg:py-16">
              <h2 className="font-display text-[36px] leading-tight md:text-[44px]">
                Арт Хаус — территория творчества
              </h2>
              <div className="mt-6 space-y-4 text-[16px] text-ink/70">
                {projectAbout.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-10 border-t border-ink/10 pt-8">
                <p className="caps text-accent">Формат</p>
                <h3 className="mt-3 font-display text-2xl">
                  Малые группы и персональное внимание
                </h3>
                <p className="mt-4 text-sm text-ink/70">
                  Мы поддерживаем экологичный темп обучения, чтобы каждый участник мог раскрыть
                  свой стиль и попробовать разные художественные техники.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

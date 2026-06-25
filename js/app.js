import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform } from 'framer-motion';

const h = React.createElement;
const formState = window.GARAGE40_FORM_STATE || { sent: false, error: false };

const services = [
  {
    id: '01',
    label: 'ДИАГНОСТИКА',
    title: 'Компьютерная диагностика',
    text: 'Считываем ошибки, проверяем датчики, электрику и поведение узлов, чтобы ремонт начинался с причины, а не с догадок.',
    forWhom: 'Для водителей, у которых загорелся индикатор неисправности двигателя, машина троит, плохо заводится, потеряла тягу или ведет себя нестабильно.',
    why: 'Вы получаете понятный план: что срочно, что можно отложить и какие детали действительно нужны.'
  },
  {
    id: '02',
    label: 'ПОДВЕСКА',
    title: 'Ходовая и рулевое',
    text: 'Проверяем подвеску, рычаги, шаровые, амортизаторы, рулевые рейки, редукторы и ГУР.',
    forWhom: 'Если появился стук на кочках, люфт руля, вибрация, увод в сторону или неравномерный износ шин.',
    why: 'Показываем найденную проблему и согласуем ремонт до начала работ.'
  },
  {
    id: '03',
    label: 'ДВИГАТЕЛЬ',
    title: 'Двигатель, ГРМ, охлаждение',
    text: 'Ремонт двигателя и ГБЦ, замена ГРМ, эндоскопия, раскоксовка, охлаждение, турбина и форсунки.',
    forWhom: 'При перегреве, дыме, расходе масла, шумах, потере мощности или плановой замене ремня.',
    why: 'Разделяем срочное, плановое и то, что не требует вмешательства.'
  },
  {
    id: '04',
    label: 'УПРАВЛЕНИЕ',
    title: 'Тормоза, сцепление, КПП',
    text: 'Обслуживаем тормозную систему, сцепление, механическую КПП, мосты, стартеры и генераторы.',
    forWhom: 'Если слышен скрип, есть биение при торможении, пробуксовка сцепления, хруст передач или рывки.',
    why: 'После ремонта проверяем результат, а не просто закрываем заказ.'
  },
  {
    id: '05',
    label: 'ОБСЛУЖИВАНИЕ',
    title: 'ТО, масла и расходники',
    text: 'Замена масла, фильтров, антифриза, жидкости ГУР и базовое регламентное обслуживание.',
    forWhom: 'Когда подошел срок ТО, вы купили авто с пробегом или готовитесь к сезону и дальней дороге.',
    why: 'Есть расходники и автохимия; недостающее закажем под конкретную машину.'
  },
  {
    id: '06',
    label: 'КОЛЕСА',
    title: 'Шиномонтаж и сезон',
    text: 'Сезонная смена колес, проверка комплекта, проколы и базовая подготовка автомобиля к дороге.',
    forWhom: 'При смене сезона, вибрации на скорости, проколе или перед поездкой за город.',
    why: 'Можно совместить колеса, диагностику, ТО и расходники в один визит.'
  }
];

const metrics = [
  ['4.9', 'рейтинг на Яндекс Картах'],
  ['220', 'оценок клиентов'],
  ['2025', 'Хорошее место'],
  ['09-20', 'прием по записи']
];

const cases = [
  ['Только нужное', 'диагностика показывает, что действительно требует ремонта'],
  ['70%', 'проблем можно локализовать до покупки запчастей'],
  ['1 визит', 'диагностика, согласование, расходники и ремонт в одном месте']
];

const reviews = [
  ['Быстро диагностировал неисправность, нашел детали и в течение часа провел качественный ремонт.', 'Настя Фролова', '12 мая 2026'],
  ['Сделали диагностику, сказали что нужно купить, все быстро установили и проконсультировали.', 'Илья Смирнов', '28 апреля 2026'],
  ['Поломка произошла в дороге. Приняли сразу, устранили неполадки, домой доехали 600 км без проблем.', 'Галина Бобкова', '19 апреля 2026'],
  ['Приехал со стуком в подвеске. Все показали, объяснили, заменили только нужное.', 'Андрей Кузнецов', '7 апреля 2026'],
  ['Помогли с запчастями и быстро вернули машину. По цене все было понятно заранее.', 'Марина Соколова', '22 марта 2026'],
  ['Делал замену масла и диагностику перед дальней поездкой. Спокойно, быстро, без лишнего.', 'Дмитрий Орлов', '10 марта 2026'],
  ['Обращалась по тормозам. Мастер объяснил причину, согласовал ремонт, после работ все проверили.', 'Елена Петрова', '26 февраля 2026'],
  ['Срочно разбирались с ошибкой двигателя. Приняли по записи, нашли проблему, помогли заказать деталь.', 'Сергей Волков', '14 февраля 2026'],
  ['Шиномонтаж совместил с осмотром ходовой. Удобно, что все сделали за один визит.', 'Павел Морозов', '31 января 2026']
];

const faqs = [
  ['Нужно записываться заранее?', 'Да, лучше оставить заявку или позвонить. Так мастер заранее уточнит задачу и подберет удобное время.'],
  ['Можно приехать с внезапной поломкой?', 'Да. Если машина сломалась в дороге или проблема срочная, свяжитесь с нами, подскажем ближайший вариант приема.'],
  ['Вы заказываете запчасти?', 'Да, можем помочь с подбором и заказом. Также можно привезти свою деталь, если ремонт нужен быстрее.'],
  ['Какие автомобили берете?', 'Европейские, японские, корейские, китайские, отечественные и коммерческие автомобили.'],
  ['Где находится сервис?', 'Калужская область, Боровский район, Балабаново, микрорайон Балабаново-1. Ориентир - остановка «Городок-1».']
];

function Reveal({ children, delay = 0, className = '' }) {
  return h(motion.div, {
    className,
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-90px' },
    transition: { duration: .68, ease: [0.2, 0.8, 0.2, 1], delay }
  }, children);
}

function Header() {
  return h(motion.header, {
    className: 'site-header',
    initial: { opacity: 0, y: -18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: .5 }
  },
    h('a', { className: 'brand', href: '#top', 'aria-label': 'Гараж 40' },
      h('span', { className: 'brand-mark' }, '40'),
      h('span', null, 'Гараж 40')
    ),
    h('nav', { className: 'nav', 'aria-label': 'Основная навигация' },
      h('a', { href: '#services' }, 'Услуги'),
      h('a', { href: '#operations' }, 'Подход'),
      h('a', { href: '#reviews' }, 'Отзывы'),
      h('a', { href: '#lead' }, 'Заявка')
    ),
    h('div', { className: 'header-actions' },
      h('a', { href: 'tel:+79533333516' }, '+7 953 333-35-16'),
      h('a', { className: 'btn btn-accent', href: '#lead' }, 'Записаться')
    )
  );
}

function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, .25], [0, 72]);

  return h('section', { className: 'hero', id: 'top' },
    h(Header),
    h('div', { className: 'starfield', 'aria-hidden': 'true' },
      Array.from({ length: 26 }).map((_, index) => h('span', { key: index }))
    ),
    h('div', { className: 'container hero-inner' },
      h(motion.div, {
        className: 'hero-copy',
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: .72, ease: [0.2, 0.8, 0.2, 1] }
      },
        h('p', { className: 'eyebrow' }, 'Автосервис для занятых водителей'),
        h('h1', null,
          h('mark', null, 'Автосервис'),
          ' без потери времени'
        ),
        h('p', { className: 'hero-text' }, 'Гараж 40 помогает быстро понять, что случилось с автомобилем, согласовать ремонт и вернуться к поездкам без лишних работ.'),
        h('div', { className: 'hero-actions' },
          h('a', { className: 'btn btn-accent', href: '#lead' }, 'Оставить заявку'),
          h('a', { className: 'btn btn-ghost', href: 'tel:+79533333516' }, 'Позвонить')
        ),
        h('p', { className: 'hero-rating' }, '4.9 рейтинг / 220 оценок')
      ),
      h(motion.div, { className: 'hero-cards', style: { y } },
        h(motion.article, { className: 'hero-card paper-card', whileHover: { y: -8, rotate: -.5 } },
          h('div', { className: 'card-meta' }, h('span', null, 'ДИАГНОСТИКА'), h('span', null, 'СЕГОДНЯ')),
          h('h2', null, 'Понятная диагностика перед ремонтом'),
          h('img', { src: './images/garage40-hero.jpg', alt: 'Автосервис Гараж 40' }),
          h('ul', null,
            h('li', null, 'Ошибки, электрика, датчики'),
            h('li', null, 'План работ до покупки деталей'),
            h('li', null, 'Согласование сроков и стоимости')
          )
        ),
        h(motion.article, { className: 'hero-card paper-card', whileHover: { y: -8, rotate: .5 } },
          h('div', { className: 'card-meta' }, h('span', null, 'РЕМОНТ'), h('span', null, 'БАЛАБАНОВО')),
          h('h2', null, 'Ремонт без лишних замен'),
          h('div', { className: 'mock-window' },
            h('span', null, 'Симптом'),
            h('b', null, 'Стук / ошибка / перегрев'),
            h('span', null, 'Решение'),
            h('b', null, 'Диагностика → согласование → ремонт')
          ),
          h('ul', null,
            h('li', null, 'Ходовая, двигатель, тормоза'),
            h('li', null, 'Запчасти под заказ'),
            h('li', null, 'Оплата картой, наличными, переводом')
          )
        )
      )
    )
  );
}

function Services() {
  return h('section', { className: 'section services', id: 'services' },
    h('div', { className: 'container' },
      h(Reveal, { className: 'section-head' },
        h('p', { className: 'kicker' }, 'КАРТА УСЛУГ'),
        h('h2', null, 'Ремонт, диагностика и ТО для занятых водителей.'),
        h('p', null, 'Второй блок сразу раскрывает услуги: что это, кому нужно и почему стоит приехать именно в Гараж 40.')
      ),
      h('div', { className: 'service-grid' },
        services.map((service, index) =>
          h(Reveal, { key: service.title, delay: index * .035 },
            h(motion.article, {
              className: `service-card ${index === 2 ? 'service-card-accent' : ''}`,
              whileHover: { y: -8, scale: 1.01 },
              transition: { type: 'spring', stiffness: 260, damping: 22 }
            },
              h('div', { className: 'service-head' },
                h('span', null, service.id),
                h('b', null, service.label)
              ),
              h('h3', null, service.title),
              h('p', null, service.text),
              h('div', { className: 'service-detail' },
                h('strong', null, 'Для кого и когда'),
                h('span', null, service.forWhom)
              ),
              h('div', { className: 'service-detail' },
                h('strong', null, 'Почему у нас'),
                h('span', null, service.why)
              ),
              h('a', { href: '#lead' }, 'Записаться')
            )
          )
        )
      )
    )
  );
}

function Pressure() {
  return h('section', { className: 'section pressure' },
    h('div', { className: 'container two-column' },
      h(Reveal, null,
        h('article', { className: 'paper-card pressure-card marble' },
          h('p', { className: 'kicker' }, 'ПРОБЛЕМА РЕАЛЬНА'),
          h('h2', null, 'Поломка отнимает время, если ремонт начинается с догадок.'),
          h('p', null, 'Самая дорогая часть ремонта часто начинается не с детали, а с неопределенности: что сломалось, сколько ждать, какие запчасти покупать и можно ли ехать дальше.')
        )
      ),
      h(Reveal, { delay: .08 },
        h('article', { className: 'paper-card pressure-card accent-card' },
          h('p', { className: 'kicker' }, 'КАК ПОСТУПАЮТ ОПЫТНЫЕ ВОДИТЕЛИ'),
          h('h2', null, 'Сначала фиксируем причину, потом ремонтируем.'),
          h('ul', null,
            h('li', null, 'Описываете симптомы и удобное время'),
            h('li', null, 'Мастер проводит диагностику и показывает вывод'),
            h('li', null, 'Вы согласуете работы, детали и срок'),
            h('li', null, 'Автомобиль проверяется перед выдачей')
          )
        )
      )
    )
  );
}

function Operations() {
  return h('section', { className: 'section operations', id: 'operations' },
    h('div', { className: 'container' },
      h(Reveal, { className: 'section-head centered' },
        h('p', { className: 'kicker' }, 'ПОНЯТНЫЙ ПРОЦЕСС'),
        h('h2', null, 'Больше ясности, меньше простоя.'),
        h('p', null, 'Сервисный подход для тех, кому машина нужна сегодня, а не “когда-нибудь после выяснений”.')
      ),
      h('div', { className: 'ops-grid' },
        h(Reveal, null,
          h(motion.article, { className: 'paper-card ops-card wide', whileHover: { y: -8 } },
            h('div', null,
              h('p', { className: 'kicker' }, 'ТОЧНАЯ ЗАЯВКА'),
              h('h3', null, 'Собираем симптомы и не теряем детали.'),
              h('p', null, 'Телефон, автомобиль, услуга и описание проблемы сразу попадают в заявку.')
            ),
            h('div', { className: 'chart-card' },
              h('b', null, '4.9'),
              h('span', null, 'средняя оценка'),
              h('i', null)
            )
          )
        ),
        h(Reveal, { delay: .05 },
          h(motion.article, { className: 'paper-card ops-card image', whileHover: { y: -8 } },
            h('img', { src: './images/garage40-hero.jpg', alt: 'Фасад автосервиса' }),
            h('h3', null, 'Запчасти и расходники под задачу'),
            h('p', null, 'Поможем подобрать детали или принять ваши, если ремонт нужен быстрее.')
          )
        ),
        h(Reveal, { delay: .1 },
          h(motion.article, { className: 'paper-card ops-card', whileHover: { y: -8 } },
            h('p', { className: 'kicker' }, 'РЕШЕНИЯ БЕЗ ЛИШНИХ ТРАТ'),
            h('h3', null, 'Не меняем рабочее “на всякий случай”.'),
            h('div', { className: 'device-card' }, 'диагностика → согласование → ремонт')
          )
        )
      ),
      h('div', { className: 'micro-features' },
        ['Предварительная запись', 'Оплата картой и переводом', 'Парковка, беспроводной интернет, туалет', 'Можно с питомцем'].map((item, index) =>
          h(Reveal, { key: item, delay: index * .035 },
            h('div', null, h('b', null, `0${index + 1}`), h('span', null, item))
          )
        )
      )
    )
  );
}

function CaseStudies() {
  return h('section', { className: 'section cases' },
    h('div', { className: 'container' },
      h(Reveal, { className: 'section-head centered' },
        h('p', { className: 'kicker' }, 'ДЛЯ ЗАНЯТЫХ ВОДИТЕЛЕЙ'),
        h('h2', null, 'Когда машина нужна, важен не красивый процесс, а готовый результат.')
      ),
      h('div', { className: 'case-stack' },
        cases.map((item, index) => h(Reveal, { key: item[0], delay: index * .05 },
          h(motion.article, { className: 'paper-card case-row', whileHover: { y: -6 } },
            h('div', null,
              h('p', { className: 'kicker' }, `СИТУАЦИЯ 0${index + 1}`),
              h('h3', null, index === 0 ? 'Ремонтируйте причину, а не догадки.' : index === 1 ? 'Поймите проблему до покупки деталей.' : 'Соберите обслуживание в один визит.'),
              h('p', null, item[1])
            ),
            h('strong', null, item[0])
          )
        ))
      )
    )
  );
}

function Reviews() {
  return h('section', { className: 'section reviews', id: 'reviews' },
    h('div', { className: 'container' },
      h(Reveal, { className: 'section-head centered' },
        h('p', { className: 'kicker' }, 'ЧТО ГОВОРЯТ КЛИЕНТЫ'),
        h('h2', null, 'Отзывы о скорости, честности и понятных рекомендациях.'),
        h('a', { className: 'btn btn-accent', href: '#lead' }, 'Оставить заявку')
      ),
      h('div', { className: 'review-grid' },
        reviews.map((review, index) => h(Reveal, { key: `${review[1]}-${review[2]}`, delay: index * .025 },
          h(motion.figure, { className: 'review-card', whileHover: { y: -8 } },
            h('blockquote', null, review[0]),
            h('figcaption', null, h('b', null, review[1]), h('span', null, review[2]))
          )
        ))
      )
    )
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return h('section', { className: 'section faq-section' },
    h('div', { className: 'container faq-wrap' },
      h(Reveal, { className: 'section-head' },
        h('p', { className: 'kicker' }, 'ВОПРОСЫ'),
        h('h2', null, 'Частые вопросы')
      ),
      h('div', { className: 'faq-list' },
        faqs.map((faq, index) => h('div', { className: `faq-item ${open === index ? 'open' : ''}`, key: faq[0] },
          h('button', { type: 'button', onClick: () => setOpen(open === index ? -1 : index), 'aria-expanded': open === index },
            h('span', null, faq[0]),
            h('b', { 'aria-hidden': 'true' }, '+')
          ),
          open === index && h(motion.div, { className: 'faq-answer', initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' } }, faq[1])
        ))
      )
    )
  );
}

function LeadForm() {
  return h('section', { className: 'section lead-section', id: 'lead' },
    h('div', { className: 'container lead-card' },
      h(Reveal, { className: 'lead-intro' },
        h('p', { className: 'kicker' }, 'ЗАПИСЬ В СЕРВИС'),
        h('h2', null, 'Оставьте заявку, чтобы понять следующий шаг.'),
        h('p', null, 'Александр или мастер уточнит задачу, удобное время и подскажет, с чего начать. Второе действие - позвонить: ', h('a', { href: 'tel:+79533333516' }, '+7 953 333-35-16'), '.')
      ),
      h(Reveal, { delay: .08 },
        h('form', { className: 'lead-form', action: '#lead', method: 'get', onSubmit: event => event.preventDefault() },
          formState.sent && h('div', { className: 'form-status success', role: 'status' }, 'Заявка отправлена. Мы скоро свяжемся с вами.'),
          formState.error && h('div', { className: 'form-status error', role: 'alert' }, 'Не получилось отправить заявку. Проверьте поля или позвоните нам.'),
          h('input', { type: 'text', name: 'website', className: 'honeypot', tabIndex: '-1', autoComplete: 'off', 'aria-hidden': 'true' }),
          h('div', { className: 'form-grid' },
            h('label', null, 'Имя', h('input', { name: 'name', type: 'text', autoComplete: 'name', placeholder: 'Сергей', required: true })),
            h('label', null, 'Телефон', h('input', { name: 'phone', type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: '+7 ___ ___-__-__', required: true })),
            h('label', null, 'Автомобиль', h('input', { name: 'car', type: 'text', autoComplete: 'off', placeholder: 'Марка, модель, год' })),
            h('label', null, 'Услуга', h('select', { name: 'service' },
              ['Диагностика', 'Ремонт ходовой', 'Двигатель / ГРМ', 'Тормоза / КПП / сцепление', 'ТО / масло / расходники', 'Шиномонтаж', 'Другое'].map(item => h('option', { key: item, value: item }, item))
            )),
            h('label', { className: 'full' }, 'Симптомы или удобное время', h('textarea', { name: 'message', rows: '4', placeholder: 'Кратко опишите проблему' }))
          ),
          h('label', { className: 'check' },
            h('input', { type: 'checkbox', name: 'privacy', value: '1', required: true }),
            h('span', null, 'Согласен на обработку данных для связи по заявке')
          ),
          h(motion.button, { className: 'submit-button', type: 'submit', whileHover: { y: -2 }, whileTap: { scale: .985 } }, 'Отправить заявку')
        )
      )
    )
  );
}

function Footer() {
  return h('footer', { className: 'footer' },
    h('div', { className: 'container footer-panel' },
      h('div', null,
        h('b', null, 'Гараж 40'),
        h('p', null, 'Балабаново-1. Диагностика, ремонт, ТО и шиномонтаж.')
      ),
      h('div', { className: 'footer-links' },
        h('a', { href: '#services' }, 'Услуги'),
        h('a', { href: '#operations' }, 'Подход'),
        h('a', { href: '#reviews' }, 'Отзывы'),
        h('a', { href: 'https://yandex.ru/maps/org/garazh_40/161581521267/', target: '_blank', rel: 'noopener' }, 'Яндекс Карты')
      )
    ),
    h('div', { className: 'footer-word', 'aria-hidden': 'true' }, 'ГАРАЖ40')
  );
}

function App() {
  return h('div', { className: 'page-shell' },
    h('main', null,
      h(Hero),
      h(Services),
      h(Pressure),
      h(Operations),
      h(CaseStudies),
      h(Reviews),
      h(FAQ),
      h(LeadForm)
    ),
    h(Footer)
  );
}

createRoot(document.getElementById('app')).render(h(App));

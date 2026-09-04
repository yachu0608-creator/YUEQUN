import { useEffect, useRef, useState, type CSSProperties } from "react";

type SectionId = "services" | "reassurance" | "team" | "reviews" | "contact";

const navigation: Array<{ id: SectionId; label: string }> = [
  { id: "services", label: "服務項目" },
  { id: "reassurance", label: "安心維修" },
  { id: "team", label: "技師團隊" },
  { id: "reviews", label: "車主評論" },
  { id: "contact", label: "聯絡我們" },
];

type LineCtaProps = {
  className?: string;
  onClick?: () => void;
};

function LineCta({ className = "", onClick }: LineCtaProps) {
  return (
    <a className={`line-cta ${className}`.trim()} href="#contact" onClick={onClick}>
      <span className="line-icon" aria-hidden="true" />
      <span>LINE 線上預約</span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionId | null>(null);

  useEffect(() => {
    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    let updateFrame: number | null = null;

    const updateCurrentSection = () => {
      const headerHeight = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
      const marker = headerHeight + (window.innerHeight - headerHeight) * 0.25;
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom > marker;
      });

      setCurrentSection(current ? current.id as SectionId : null);
      updateFrame = null;
    };

    const scheduleUpdate = () => {
      if (updateFrame !== null) return;
      updateFrame = requestAnimationFrame(updateCurrentSection);
    };

    updateCurrentSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (updateFrame !== null) cancelAnimationFrame(updateFrame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const goToSection = (id: SectionId) => {
    setCurrentSection(id);
    closeMenu();
  };
  const returnToTop = () => {
    setCurrentSection(null);
    closeMenu();
  };

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主要導覽">
        <a className="brand" href="#top" aria-label="越群汽車修配廠，回到頁首" onClick={returnToTop}>
          <img src="/assets/logo.svg" alt="越群汽車修配廠" />
        </a>

        <div className="desktop-navigation">
          <ul className="nav-links">
            {navigation.map(({ id, label }) => (
              <li key={id}>
                <a
                  className="nav-link"
                  href={`#${id}`}
                  aria-current={currentSection === id ? "location" : undefined}
                  onClick={() => goToSection(id)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <LineCta />
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "關閉導覽選單" : "開啟導覽選單"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div id="mobile-navigation" className="mobile-navigation" hidden={!menuOpen}>
        <ul>
          {navigation.map(({ id, label }) => (
            <li key={id}>
              <a
                className="nav-link"
                href={`#${id}`}
                aria-current={currentSection === id ? "location" : undefined}
                onClick={() => goToSection(id)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <LineCta onClick={closeMenu} />
      </div>
    </header>
  );
}

function Banner() {
  const [slide, setSlide] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const photos = ["mechanic-source-1.png", "slide-2.png", "slide-3.png"];
  return (
    <section className="hero" aria-labelledby="hero-title" aria-roledescription="輪播" tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setSlide((value) => (value + (event.key === "ArrowLeft" ? 2 : 1)) % 3);
        }
      }}
      onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchCancel={() => { touchStart.current = null; }}
      onTouchEnd={(event) => {
        if (!touchStart.current) return;
        const dx = event.changedTouches[0].clientX - touchStart.current.x;
        const dy = event.changedTouches[0].clientY - touchStart.current.y;
        touchStart.current = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) setSlide((value) => (value + (dx < 0 ? 1 : 2)) % 3);
      }}>
      <img className="hero-watermark" src="/assets/banner/left-watermark.svg" alt="" aria-hidden="true" />
      <img className="hero-gradient" src="/assets/banner/white-gradient.svg" alt="" aria-hidden="true" />

      <div className="hero-photo-mask" aria-hidden="true">
        {photos.map((photo, index) => <img key={photo} className={`hero-photo hero-photo-${index + 1}${slide === index ? " is-current" : ""}`} src={`/assets/banner/${photo}`} alt="" />)}
      </div>

      <img className="hero-red-upper" src="/assets/banner/red-upper.svg" alt="" aria-hidden="true" />
      <img className="hero-red-lower" src="/assets/banner/red-lower.svg" alt="" aria-hidden="true" />
      <img className="hero-line-art" src="/assets/banner/line-art.svg" alt="" aria-hidden="true" />

      <p className="hero-since" aria-label="創立於 2001 年">
        SINCE<br />2001
      </p>

      <div className="hero-content">
        <div className="hero-copy">
          <h1 id="hero-title">
            專業細節，<br />
            維修<span>更放心</span>。
          </h1>
          <p>
            從檢查、保養到維修，每一個環節都以<br />
            專業技術與清楚說明，提供值得信賴的服務。
          </p>
        </div>
        <LineCta className="hero-cta" />
      </div>

      <div className="hero-pagination" aria-label="Banner 圖片切換">
        {photos.map((photo, index) => <button key={photo} type="button" className={slide === index ? "is-current" : ""}
          aria-label={`顯示 Banner 圖 ${index + 1}`} aria-pressed={slide === index} onClick={() => setSlide(index)} />)}
      </div>
      <span className="team-status" aria-live="polite">Banner 第 {slide + 1} 張，共 3 張</span>
    </section>
  );
}

const serviceCards = [
  { title: "定期保養", english: "Regular Maintenance", asset: "maintenance-final", description: "定期檢查保養，維持愛車最佳狀態" },
  { title: "引擎系統", english: "Engine Service", asset: "engine", description: "專業檢測維修，維持引擎穩定動力" },
  { title: "底盤系統", english: "Chassis Service", asset: "chassis", description: "檢查底盤懸吊，提升行車穩定安全" },
  { title: "冷氣系統", english: "A/C Service", asset: "ac", description: "冷氣檢測保養，維持車內舒適涼爽" },
  { title: "電機系統", english: "Electrical Service", asset: "electrical", description: "檢測車輛電系，確保各項功能正常" },
];

function ServiceCard({ card, preview = false, clone = false }: { card: (typeof serviceCards)[number]; preview?: boolean; clone?: boolean }) {
  return (
    <article
      className={`service-card${preview ? " is-preview" : ""}${clone ? " is-clone" : ""}`}
      aria-hidden={preview || clone || undefined}
    >
      <img
        className="service-photo"
        src={`/assets/services/${card.asset}.png`}
        alt={preview ? "" : `${card.title}服務示意`}
      />
      <div className="service-card-copy">
        <div className="service-card-title">
          <span className="service-icon" aria-hidden="true">
            <img src={`/assets/services/${card.asset}-icon.svg`} alt="" />
          </span>
          <div>
            <h3>{card.title}</h3>
            <p>{card.english}</p>
          </div>
        </div>
        <p className="service-description">{card.description}</p>
      </div>
    </article>
  );
}

function Services() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [trackIndex, setTrackIndex] = useState(1);
  const [trackTransition, setTrackTransition] = useState(true);
  const resetFrame = useRef<number | null>(null);
  const isSliding = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const loopedCards = [serviceCards.at(-1)!, ...serviceCards, serviceCards[0]];

  useEffect(() => () => {
    if (resetFrame.current !== null) cancelAnimationFrame(resetFrame.current);
  }, []);

  const selectService = (index: number) => {
    isSliding.current = false;
    setTrackTransition(true);
    setActiveCategory(index);
    setTrackIndex(index + 1);
  };

  const previousService = () => {
    if (window.matchMedia("(max-width: 1200px)").matches) {
      selectService((activeCategory - 1 + serviceCards.length) % serviceCards.length);
      return;
    }
    if (isSliding.current) return;
    isSliding.current = true;
    setTrackTransition(true);
    setActiveCategory((index) => (index - 1 + serviceCards.length) % serviceCards.length);
    setTrackIndex((index) => index - 1);
  };

  const nextService = () => {
    if (window.matchMedia("(max-width: 1200px)").matches) {
      selectService((activeCategory + 1) % serviceCards.length);
      return;
    }
    if (isSliding.current) return;
    isSliding.current = true;
    setTrackTransition(true);
    setActiveCategory((index) => (index + 1) % serviceCards.length);
    setTrackIndex((index) => index + 1);
  };

  const finishLoop = () => {
    if (trackIndex !== 0 && trackIndex !== serviceCards.length + 1) {
      isSliding.current = false;
      return;
    }

    setTrackTransition(false);
    setTrackIndex(trackIndex === 0 ? serviceCards.length : 1);
    resetFrame.current = requestAnimationFrame(() => {
      resetFrame.current = requestAnimationFrame(() => {
        setTrackTransition(true);
        isSliding.current = false;
      });
    });
  };

  return (
    <section className="services-section" id="services" aria-labelledby="services-title">
      <img
        className="services-background-texture"
        src="/assets/services/background-texture.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="services-background-red"
        src="/assets/services/background-red.svg"
        alt=""
        aria-hidden="true"
      />
      <div className="services-layout">
        <div className="services-sidebar">
          <div>
            <div className="section-heading">
              <p>OUR SERVICES</p>
              <h2 id="services-title">越群服務項目</h2>
            </div>

            <div className="service-categories" role="tablist" aria-label="服務項目分類">
              {serviceCards.map((card, index) => (
                <button
                  className={`service-category${activeCategory === index ? " is-current" : ""}`}
                  type="button"
                  key={card.title}
                  role="tab"
                  aria-selected={activeCategory === index}
                  aria-controls="service-carousel"
                  onClick={() => selectService(index)}
                >
                  {card.title}
                </button>
              ))}
            </div>
          </div>

          <div className="service-arrows" aria-label="服務項目輪播控制">
            <button type="button" aria-label="上一個服務項目" onClick={previousService}>
              <img src="/assets/services/arrow-prev.svg" alt="" />
            </button>
            <button type="button" aria-label="下一個服務項目" onClick={nextService}>
              <img src="/assets/services/arrow-next.svg" alt="" />
            </button>
          </div>
        </div>

        <div className="service-carousel-window" id="service-carousel" role="tabpanel"
          onDragStart={(event) => event.preventDefault()}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            swipeStart.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { swipeStart.current = null; }}
          onLostPointerCapture={() => { swipeStart.current = null; }}
          onPointerUp={(event) => {
            const start = swipeStart.current;
            swipeStart.current = null;
            if (!start) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
              if (dx < 0) nextService();
              else previousService();
            }
          }}>
          <div
            className={`service-card-track${trackTransition ? "" : " without-transition"}`}
            style={{ transform: `translateX(${-871 * trackIndex}px)` }}
            onTransitionEnd={(event) => {
              if (event.target === event.currentTarget) finishLoop();
            }}
          >
            {loopedCards.map((card, index) => {
              const realIndex = (index - 1 + serviceCards.length) % serviceCards.length;
              return (
                <ServiceCard
                  card={card}
                  preview={realIndex !== activeCategory}
                  clone={index === 0 || index === loopedCards.length - 1}
                  key={`${card.title}-${index}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const reassuranceCards = [
  {
    title: "專業技師",
    description: ["經驗豐富、專業診斷", "提供可靠維修建議"],
    icon: "/assets/reassurance/technician.svg",
  },
  {
    title: "透明報價",
    description: ["維修項目與費用明確", "不亂加價，不強銷"],
    icon: "/assets/reassurance/quote.svg",
  },
  {
    title: "貼心溝通",
    description: ["耐心解說內容", "讓您了解維修狀況"],
    icon: "/assets/reassurance/communication.svg",
  },
  {
    title: "誠信保固",
    description: ["維修後提供保固服務", "讓您後續更安心"],
    icon: "/assets/reassurance/warranty.svg",
  },
];

function Reassurance() {
  return (
    <section className="reassurance-section" id="reassurance" aria-labelledby="reassurance-title">
      <div className="reassurance-corner-desktop" aria-hidden="true">
        <img src="/assets/reassurance/red-corner-desktop.svg" alt="" />
      </div>
      <img className="reassurance-corner" src="/assets/reassurance/red-corner.svg" alt="" aria-hidden="true" />
      <div className="reassurance-layout">
        <div className="reassurance-heading">
          <div className="section-heading">
            <p>DON&apos;T WASTE</p>
            <h2 id="reassurance-title">錢別白花了</h2>
          </div>
          <p>修什麼、為什麼修、多少錢，說清楚了再決定。</p>
        </div>

        <div className="reassurance-cards">
          {reassuranceCards.map((card) => (
            <article className="reassurance-card" key={card.title}>
              <img src={card.icon} alt="" aria-hidden="true" />
              <div>
                <h3>{card.title}</h3>
                <p>
                  {card.description.map((line) => <span key={line}>{line}</span>)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const teamMembers = [
  { photo: "/assets/team/main-456.png", name: "王志詺", englishName: "Michael Wang", experience: "35年經驗", specialty: "引擎系統診斷／底盤維修與調校" },
  { photo: "/assets/team/right-456.png", name: "陳文卿", englishName: "Wen-ching Chen", experience: "20年經驗", specialty: "電腦診斷維修／電機系統檢修" },
  { photo: "/assets/team/left-456.png", name: "王豐穎", englishName: "Richard Wang", experience: "7年經驗", specialty: "冷氣系統檢修／清洗與保養" },
];

function Team() {
  const [center, setCenter] = useState(0);
  const moving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const move = (direction: number) => {
    if (moving.current) return;
    moving.current = true;
    setCenter((value) => value + direction);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
    timer.current = setTimeout(() => { moving.current = false; }, duration);
  };

  return (
    <section className="team-section" id="team" aria-labelledby="team-title">
      <div className="team-layout">
        <div className="team-heading-controls">
          <div className="team-heading">
            <div className="section-heading">
              <p>OUR TEAM</p>
              <h2 id="team-title">專業技師團隊</h2>
            </div>
            <p>經驗豐富，技術到位，用心照顧您的愛車。</p>
          </div>
          <div className="service-arrows team-arrows" aria-label="技師輪播控制">
            <button type="button" aria-label="上一位技師" onClick={() => move(-1)}><img src="/assets/services/arrow-next.svg" alt="" /></button>
            <button type="button" aria-label="下一位技師" onClick={() => move(1)}><img src="/assets/services/arrow-next.svg" alt="" /></button>
          </div>
        </div>
        <div className="team-carousel" role="region" aria-roledescription="輪播" aria-label="技師團隊示意資料"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
          onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchCancel={() => { touchStart.current = null; }}
          onTouchEnd={(event) => {
            if (!touchStart.current) return;
            const dx = event.changedTouches[0].clientX - touchStart.current.x;
            const dy = event.changedTouches[0].clientY - touchStart.current.y;
            touchStart.current = null;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
          }}>
          {[-2, -1, 0, 1, 2].map((slot) => {
            const position = center + slot;
            const index = ((position % teamMembers.length) + teamMembers.length) % teamMembers.length;
            const member = teamMembers[index];
            return (
              <article key={position} className={`team-card${slot === 0 ? " is-current" : ""}${Math.abs(slot) > 1 ? " is-outside" : ""}`}
                style={{ "--slot": slot } as CSSProperties} aria-hidden={slot !== 0}
                aria-label={`第 ${index + 1} 張，共 3 張`}>
                {Math.abs(slot) === 1 && <button className="team-card-select" type="button" tabIndex={-1}
                  aria-label={slot < 0 ? "切換上一位技師" : "切換下一位技師"}
                  onClick={() => move(slot)} />}
                <img className="team-portrait" src={member.photo} alt={slot === 0 ? "技師示意照片" : ""} draggable={false} />
                <div className="team-card-copy">
                  <div className="team-name-row">
                    <div><h3>{member.name}</h3><p className="team-english">{member.englishName}</p></div>
                    <span className="team-experience">{member.experience}</span>
                  </div>
                  <p className="team-specialty">{member.specialty}</p>
                </div>
              </article>
            );
          })}
        </div>
        <span className="team-status" aria-live="polite">第 {((center % 3) + 3) % 3 + 1} 張，共 3 張技師示意卡片</span>
      </div>
    </section>
  );
}

// Original Figma placeholder content; not a live review feed.
const reviews = [
  {
    author: "黃先生 / 桃園市",
    avatar: "avatar-huang.png",
    text: "老闆經驗豐富又專業，家裡過保固的車都固定回來保養維修，檢查仔細，讓人很放心。",
  },
  {
    author: "廖小姐 / 南投縣",
    avatar: "avatar-liao.png",
    text: "從定期保養到維修都很專業，老闆會清楚說明車況和需要處理的項目，是我們家長期信賴的汽車維修廠。",
  },
  {
    author: "陳先生 / 台中市",
    avatar: "avatar-chen.png",
    text: "VOLVO專業電腦判斷修復，我的XC90中古車防滑穩定系統故障燈亮著，老闆給我診斷是煞車總帮壓力感應器故障，診斷正確免花冤枉錢。",
  },
  {
    author: "謝小姐 / 苗栗縣",
    avatar: "avatar-hsieh.png",
    text: "老板娘熱心親切，即時的幫忙令人感動，專業修理，謝謝🙏！",
  },
  {
    author: "徐先生 / 台中市",
    avatar: "avatar-hsu.png",
    text: "找專業的老闆就對了，老闆娘親切誠懇，感謝越群汽車維修服務。",
  },
];

function Reviews() {
  const [position, setPosition] = useState(2);
  const moving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const move = (direction: number) => {
    if (moving.current) return;
    moving.current = true;
    setPosition((value) => value + direction);
    timer.current = setTimeout(() => { moving.current = false; },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450);
  };
  return (
    <section id="reviews" className="reviews-section" aria-labelledby="reviews-title">
      <div className="reviews-heading">
        <div className="section-heading"><p>CUSTOMER REVIEWS</p><h2 id="reviews-title">車主安心推薦</h2></div>
        <div className="service-arrows reviews-arrows" aria-label="評論輪播控制">
          <button type="button" aria-label="上一則評論" onClick={() => move(-1)}><img src="/assets/services/arrow-next.svg" alt="" /></button>
          <button type="button" aria-label="下一則評論" onClick={() => move(1)}><img src="/assets/services/arrow-next.svg" alt="" /></button>
        </div>
      </div>
      <div className="reviews-carousel" role="region" aria-roledescription="輪播" aria-label="車主評論" tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchCancel={() => { touch.current = null; }}
        onTouchEnd={(event) => {
          if (!touch.current) return;
          const dx = event.changedTouches[0].clientX - touch.current.x;
          const dy = event.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
        }}>
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((slot) => {
          const key = position + slot;
          const index = ((key % reviews.length) + reviews.length) % reviews.length;
          const review = reviews[index];
          return (
            <article key={key} className={`review-card${key % 2 !== 0 ? " is-lower" : ""}`}
              style={{ "--slot": slot } as CSSProperties} aria-hidden={slot !== 0}
              aria-label={`第 ${index + 1} 則評論，${review.author}`}>
              <div className="review-rating"><img className="review-quote" src="/assets/reviews/quote.svg" alt="" />
                <span><img src="/assets/reviews/stars.svg" alt="5 顆星" /><strong>5.0</strong></span>
              </div>
              <p className="review-text">{review.text}</p>
              <div className="review-person"><img src={`/assets/reviews/${review.avatar}`} alt="" /><span>{review.author}</span></div>
            </article>
          );
        })}
      </div>
      <span className="team-status" aria-live="polite">第 {((position % reviews.length) + reviews.length) % reviews.length + 1} 則，共 {reviews.length} 則評論</span>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-layout">
        <div className="contact-copy">
          <div className="section-heading"><p>CONTACT US</p><h2 id="contact-title">聯絡我們</h2></div>
          <div className="contact-details">
            <div><img src="/assets/contact/phone.svg" alt="" /><a href="tel:0425323838">04-25323838</a></div>
            <div><img src="/assets/contact/clock.svg" alt="" /><p>週一～週六 8:30～17:30</p></div>
            <div><img className="contact-location" src="/assets/contact/location.svg" alt="" /><p>台中市潭子區中山路三段425號</p></div>
          </div>
          <button type="button" className="line-cta contact-cta" aria-disabled="true" title="預約連結準備中">
            <span className="line-icon" aria-hidden="true" /><span>LINE 線上預約</span>
          </button>
        </div>
        <iframe className="contact-map" title="越群汽車修配廠位置：台中市潭子區中山路三段425號"
          src={`https://maps.google.com/maps?q=${encodeURIComponent("台中市潭子區中山路三段425號")}&output=embed&hl=zh-TW`}
          loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <a className="footer-logo" href="#top" aria-label="越群汽車修配廠，回到頁首">
          <img src="/assets/footer/logo.svg" alt="越群汽車修配廠" />
        </a>
        <nav className="footer-links" aria-label="頁尾導覽">
          {navigation.map(({ id, label }) => <a href={`#${id}`} key={id}>{label}</a>)}
        </nav>
        <p className="footer-copyright">©{new Date().getFullYear()}越群汽車修配廠 All Rights Reserved</p>
      </div>
      <a className="footer-top" href="#top" aria-label="回到頁首"><img src="/assets/footer/top.svg" alt="" /></a>
      <img className="footer-wordmark" src="/assets/footer/wordmark.svg" alt="" aria-hidden="true" />
    </footer>
  );
}

export default function App() {
  return (
    <div id="top">
      <Header />
      <main aria-label="越群汽車修配廠首頁">
        <Banner />
        <Services />
        <Reassurance />
        <Team />
        <Reviews />
        <div className="brand-marquee" aria-hidden="true">
          <div className="brand-marquee-track">
            {[0, 1].map((group) => (
              <div className="brand-marquee-group" key={group}>
                {[0, 1].map((copy) => <img key={copy} src="/assets/marquee.svg" alt="" draggable={false} />)}
              </div>
            ))}
          </div>
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useLanguage, LanguageSwitch } from '@/components/language';
import { ArrowUpLeft, ArrowDown, Menu, X, Pause, Play, RotateCcw, Phone, Mail, MapPin, Plus, Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import IndustrialScene from '@/components/industrial-scene';
import { EquipmentCatalog, WhySuperMetal, CompanyDocuments, QuoteRequest, type QuoteSelection } from '@/components/company-details';
import type { Service } from '@/lib/quote';
import type { SceneKind } from '@/lib/industrial-scenes';
const profile = '/assets/super-metal-profile.pdf';
function Brand() {
    const { t } = useLanguage();
    return <a href="#home" className="brand" aria-label={t("شركة المعدن الفائق التجارية، الرئيسية")}><img src="/assets/brand-lockup-light.svg" width="665" height="105" alt={t("شركة المعدن الفائق التجارية — SUPER METAL TRADING COMPANY")}/></a>;
}
export default function Home() {
    const { t, locale } = useLanguage();
    const nav = [{ href: '#about', title: t("عن الشركة") }, { href: '#demolition', title: t("الهدم والتفكيك") }, { href: '#scrap', title: t("تجارة السكراب") }, { href: '#equipment', title: t("تأجير المعدات") }];
    const phases = [t("المبنى القائم"), t("الهدم والتفكيك"), t("إزالة الأنقاض"), t("أرض جاهزة للبداية")];
    const fleet = [
        { id: 'loader', name: t("الحفر والتحميل"), en: 'EARTHMOVING', title: t("قوة تُحرّك العمل."), description: t("من أعمال الحفر إلى تحميل المواد وتسوية المواقع، معدات تلائم طبيعة العمل وتكمل دورة المشروع."), tags: [t("حفارات"), t("شيولات ولودرات"), t("بلدوزرات"), t("بوبكاتات")], photo: '/assets/loader.webp', caption: t("الشيولات واللودرات"), motion: t("حركة التحميل ورفع الجرافة") },
        { id: 'crane', name: t("الرفع والمناولة"), en: 'LIFTING & HANDLING', title: t("نرفع سقف الإمكانات."), description: t("حلول للرفع والمناولة، من نقل المواد داخل المواقع إلى رفع المعدات والأحمال في المشاريع الإنشائية والصناعية."), tags: [t("رافعات هيدروليكية"), t("رافعات تلسكوبية"), t("فوركلفت"), t("تلي هاندر وبوم ترك")], photo: '/assets/crane.webp', caption: t("الرافعات والكرينات"), motion: t("امتداد ذراع الرافعة ورفع الخطاف") },
        { id: 'truck', name: t("النقل والإسناد"), en: 'TRANSPORT & SUPPORT', title: t("كل حمولة. في مسارها."), description: t("قلابات وشاحنات لنقل المواد، ولوبد لنقل المعدات الثقيلة وربط الأعمال الميدانية باحتياجات المشروع."), tags: [t("قلابات"), t("شاحنات قلابة"), t("لوبد لنقل المعدات")], photo: '/assets/dump-truck.webp', caption: t("القلابات والشاحنات"), motion: t("دخول القلاب وارتفاع صندوق التفريغ") },
    ] as const;
    const [paused, setPaused] = useState(false);
    const [replay, setReplay] = useState(0);
    const [phase, setPhase] = useState(0);
    const [scrapPhase, setScrapPhase] = useState(0);
    const [scrapProgress, setScrapProgress] = useState<number | null>(null);
    const [equipment, setEquipment] = useState('loader');
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState('');
    const [quote, setQuote] = useState<QuoteSelection>({ service: 'demolition', machine: '', key: 0 });
    const requestQuote = (service: Service, machine = '') => {
        setQuote(prev => ({ service, machine, key: prev.key + 1 }));
        requestAnimationFrame(() => {
            document.getElementById('quote')?.scrollIntoView({ behavior: paused ? 'instant' : 'smooth', block: 'start' });
            document.getElementById('quote-name')?.focus({ preventScroll: true });
        });
    };
    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const change = () => setPaused(media.matches);
        change();
        media.addEventListener('change', change);
        return () => media.removeEventListener('change', change);
    }, []);
    useEffect(() => {
        document.documentElement.dataset.motion = paused ? 'paused' : 'running';
        return () => { delete document.documentElement.dataset.motion; };
    }, [paused]);
    useEffect(() => {
        const observed = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-motion-section]'));
        const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting)
            entry.target.classList.add('is-visible'); }), { threshold: .08 });
        observed.forEach(el => reveal.observe(el));
        const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
        const current = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting)
            setActive('#' + entry.target.id); }), { rootMargin: '-15% 0px -55% 0px' });
        sections.forEach(el => current.observe(el));
        let raf = 0;
        const motionElements = Array.from(document.querySelectorAll<HTMLElement>('[data-motion-section]'));
        const update = () => {
            raf = 0;
            const measurements = motionElements.map(el => ({ el, rect: el.getBoundingClientRect() }));
            measurements.forEach(({ el, rect }) => {
                const p = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
                el.style.setProperty('--section-progress', String(p));
            });
        };
        const onScroll = () => { if (!raf)
            raf = requestAnimationFrame(update); };
        window.addEventListener('scroll', onScroll, { passive: true });
        update();
        return () => { reveal.disconnect(); current.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
    }, []);
    const replayIntro = () => { setPaused(false); setReplay(r => r + 1); };
    return <>
    <a href="#main" className="skip-link">{t("انتقل إلى المحتوى")}</a>
    <header className="site-header">
      <Brand />
      <nav className="desktop-nav" aria-label={t("التنقل الرئيسي")}>{nav.map(link => <a key={link.href} href={link.href} className={active === link.href ? 'active' : ''}>{link.title}</a>)}</nav>
      <div className="header-actions"><LanguageSwitch />
        <button className="motion-toggle" onClick={() => setPaused(p => !p)} aria-label={paused ? t("تشغيل الحركة") : t("إيقاف الحركة")} title={paused ? t("تشغيل الحركة") : t("إيقاف الحركة")} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
        <a className="button header-cta" href="#quote">{t("اطلب عرض سعر ")}<ArrowUpLeft size={18}/></a>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><button className="mobile-menu" aria-label={t("فتح القائمة")}><Menu /></button></SheetTrigger><SheetContent className="nav-sheet" side={locale === 'ar' ? 'right' : 'left'} showCloseButton={false}><SheetHeader><SheetTitle>{t("المعدن الفائق التجارية")}</SheetTitle><SheetDescription>{t("قدرات تتكامل. مشاريع تتقدم.")}</SheetDescription></SheetHeader><SheetClose asChild><button className="close-menu" aria-label={t("إغلاق القائمة")}><X /></button></SheetClose><nav aria-label={t("التنقل على الجوال")}>{nav.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.title}<ArrowUpLeft size={20}/></a>)}<a href="#credentials" onClick={() => setMenuOpen(false)}>{t("ملف الشركة ووثائقها")}<ArrowUpLeft size={20}/></a><a href="#quote" onClick={() => setMenuOpen(false)}>{t("اطلب عرض سعر")}<ArrowUpLeft size={20}/></a></nav><div className="menu-foot">{t("جدة \u00B7 المملكة العربية السعودية")}</div></SheetContent></Sheet>
      </div>
    </header>

    <main id="main">
      <section id="home" className="hero">
        <div className="hero-grid" aria-hidden="true"/>
        <div className="diagonal hero-diagonal" aria-hidden="true"/>
        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="eyebrow"><span className="short-rule"/>{t("قدرات تتكامل. مشاريع تتقدم.")}</p>
            <h1>{t("نُمهّد الأرض.")}<br /><em>{t("ونصنع الفرص.")}</em></h1>
            <p className="hero-description">{t("الهدم والتفكيك، تجارة السكراب، وتأجير المعدات الثقيلة. قدرات متكاملة تُمهّد الطريق لمشروعك القادم.")}</p>
            <div className="hero-actions"><a href="#quote" className="button">{t("اطلب عرض سعر ")}<ArrowUpLeft size={18}/></a><a href={profile} target="_blank" rel="noreferrer" className="text-link">{t("الملف التعريفي ")}<ArrowUpLeft size={18}/></a></div>
            <div className="hero-locale"><MapPin size={14}/><span>{t("من جدة، إلى مشاريع المملكة.")}</span></div>
          </div>
          <div className="hero-visual">
            <div className="visual-top"><span className="micro" dir="ltr">A NEW GROUND. A NEW POSSIBILITY.</span><span className="crosshair">+</span></div>
            <IndustrialScene kind="demolition" paused={paused} replay={replay} onStage={setPhase} fallback="/assets/demolition.webp" label={t("مشهد توضيحي لمبنى يتفكك، ثم تتحول أجزاؤه إلى أرض مستوية ونظيفة")}/>
            <div className="scene-caption"><span><i />{phases[phase]}</span><button onClick={replayIntro} aria-label={t("إعادة مشهد الهدم والتحول")}><RotateCcw size={15}/>{t("أعد المشهد")}</button></div>
            <div className="phase-track" aria-label={t("مراحل تجهيز الأرض")}>{phases.map((p, i) => <span key={p} className={phase >= i ? 'complete' : ''}><i />{String(i + 1).padStart(2, '0')}</span>)}</div>
            <span className="scene-note">{t("تصوّر توضيحي لمراحل العمل")}</span>
          </div>
        </div>
        <div className="hero-footer shell"><span className="micro" dir="ltr">SUPER METAL — BUILT ON CAPABILITY</span><a href="#about" className="scroll-link">{t("تمرّر لتكتشف ")}<ArrowDown size={16}/></a><span className="micro">{t("شريك القطاعات الصناعية والإنشائية")}</span></div>
      </section>

      <div className="service-index"><div className="shell">{[{ href: '#demolition', n: '01', title: t("الهدم والتفكيك"), sub: t("نهاية مدروسة. بداية جديدة.") }, { href: '#scrap', n: '02', title: t("تجارة السكراب"), sub: t("نستعيد القيمة من المواد.") }, { href: '#equipment', n: '03', title: t("تأجير المعدات"), sub: t("القدرة التي يحتاجها مشروعك.") }].map(s => <a href={s.href} key={s.n}><span className="index-number">{s.n}</span><span><strong>{s.title}</strong><small>{s.sub}</small></span><ArrowUpLeft /></a>)}</div></div>

      <section id="about" className="about-section light-section" data-motion-section>
        <div className="shell about-layout">
          <div data-reveal><p className="eyebrow dark-eyebrow">{t("المعدن الفائق التجارية ")}<span className="section-code">/ ABOUT US</span></p><h2>{t("قدرات متعددة.")}<br /><span className="muted-heading">{t("شريك واحد.")}</span></h2></div>
          <div className="about-copy" data-reveal><p className="large-copy">{t("شركة سعودية تأسست عام 2025 في جدة، تجمع تجارة السكراب وخدمات الهدم والتفكيك وتأجير المعدات تحت مظلة واحدة.")}</p><p>{t("ندعم احتياجات القطاعات الصناعية والإنشائية، ونربط أعمال الموقع باستعادة قيمة المواد وتوفير المعدات المناسبة. نهتم بالتخطيط والسلامة ووضوح التنفيذ في كل مرحلة.")}</p><div className="about-values"><span><Check size={16}/>{t("حلول متكاملة")}</span><span><Check size={16}/>{t("مرونة في التعاقد")}</span><span><Check size={16}/>{t("تغطية المملكة")}</span></div></div>
        </div>
        <WhySuperMetal />
        <div className="about-band shell" aria-hidden="true"><span>PRECISION</span><i /><span>CAPABILITY</span><i /><span>VALUE</span><div className="band-line"/></div>
      </section>

      <section id="demolition" className="demolition-section light-section" data-motion-section>
        <div className="shell section-heading" data-reveal><div><p className="eyebrow dark-eyebrow"><span className="service-number">01</span>{t("الهدم والتفكيك")}</p><h2>{t("كل نهاية،")}<br /><span className="muted-heading">{t("مساحة لبداية.")}</span></h2></div><p className="section-intro">{t("من المبنى القائم إلى الموقع المهيأ. ننفّذ أعمال الهدم والتفكيك، وننقل المخلفات ونفرزها لإعادة توجيهها إلى مراكز التدوير.")}</p></div>
        <div className="shell demolition-layout">
          <div className="demolition-photo" data-reveal><img src="/assets/demolition.webp" width="1500" height="1000" alt={t("معدات هدم تعمل على تفكيك مبنى وإزالة الخرسانة")} loading="lazy"/><div className="photo-scan" aria-hidden="true"/><div className="photo-corner" aria-hidden="true"/><div className="photo-label"><span dir="ltr">DEMOLITION & DISMANTLING</span><span>{t("قوة في التنفيذ. دقة في الخطوات.")}</span></div></div>
          <div className="demolition-steps">{[
            ['01', t("تقييم الموقع وتخطيط العمل"), t("تحديد نطاق الأعمال وطريقة التنفيذ المناسبة لطبيعة المنشأة.")],
            ['02', t("هدم وتفكيك"), t("هدم المباني والمنشآت الصناعية وتفكيك الهياكل والمعدات الثقيلة.")],
            ['03', t("فرز وإزالة المخلفات"), t("جمع المواد وفرزها ونقلها لإعادة التدوير والتعامل المناسب معها.")],
            ['04', t("موقع جاهز للمرحلة التالية"), t("إخلاء الموقع وتجهيز الأرض لاستقبال أعمال المشروع القادمة.")],
        ].map(([n, title, body]) => <div className="work-step" key={n} data-reveal><span>{n}</span><div><h3>{title}</h3><p>{body}</p></div><Plus size={17} aria-hidden="true"/></div>)}<button onClick={() => requestQuote('demolition')} className="text-link dark-link">{t("اطلب معاينة مشروعك ")}<ArrowUpLeft size={20}/></button></div>
        </div>
      </section>

      <section id="scrap" className="scrap-section" data-motion-section>
        <div className="scrap-stripe diagonal" aria-hidden="true"/>
        <div className="shell scrap-layout">
          <div className="scrap-copy" data-reveal><p className="eyebrow"><span className="service-number">02</span>{t("تجارة السكراب والخردة")}</p><h2>{t("القيمة لا تنتهي.")}<br /><em>{t("نمنحها مسارًا جديدًا.")}</em></h2><p className="section-intro">{t("شراء وبيع السكراب والمعادن الحديدية وغير الحديدية. نحول المواد المتفرقة إلى فرص قابلة للاستفادة، عبر الجمع والفرز والنقل.")}</p><div className="material-tags"><span>{t("حديد")}</span><span>{t("نحاس")}</span><span>{t("ألمنيوم")}</span><span>{t("معادن متنوعة")}</span><span>{t("بلاستيك")}</span><span>{t("طبليات خشب")}</span></div><button onClick={() => requestQuote('scrap')} className="text-link">{t("تواصل بشأن السكراب ")}<ArrowUpLeft size={20}/></button></div>
          <div className="scrap-visual"><div className="visual-top"><span className="micro" dir="ltr">RECOVER. SORT. REUSE.</span><span className="crosshair">+</span></div><IndustrialScene kind="scrap" paused={paused} progress={scrapProgress} onStage={setScrapPhase} fallback="/assets/scrap-yard.webp" label={t("قطع من الحديد والنحاس والألمنيوم تتحرك من حالة التبعثر إلى مجموعات مفروزة ومنظمة")}/><div className="metal-labels" dir="ltr"><span>{t("حديد ")}<small>FE</small></span><span>{t("نحاس ")}<small>CU</small></span><span>{t("ألمنيوم ")}<small>AL</small></span></div><div className="scrap-controls"><span>{scrapPhase === 0 ? t("مواد تحمل فرصًا") : scrapPhase === 1 ? t("نجمع. نفرز. نهيّئ.") : t("قيمة جاهزة للاستفادة")}</span><button onClick={() => { setPaused(false); setScrapProgress(scrapProgress === 0 ? 1 : 0); }}><RotateCcw size={14}/>{scrapProgress === 0 ? t("شاهد الفرز") : t("أعد الفرز")}</button></div></div>
        </div>
        <div className="shell circular-note"><span className="outline-word" aria-hidden="true">VALUE</span><div><span className="gold-line"/><p>{t("موارد اليوم،")}<br /><strong>{t("فرص الغد.")}</strong></p></div><p>{t("نسهم في تعزيز الاقتصاد الدائري")}<br />{t("عبر استعادة المواد وإعادة توجيهها للتدوير.")}</p></div>
      </section>

      <section id="equipment" className="equipment-section light-section" data-motion-section>
        <div className="shell section-heading" data-reveal><div><p className="eyebrow dark-eyebrow"><span className="service-number">03</span>{t("تأجير المعدات الثقيلة")}</p><h2>{t("جاهزية في الميدان.")}<br /><span className="muted-heading">{t("من أول حركة.")}</span></h2></div><p className="section-intro">{t("معدات تدعم أعمال الهدم والإنشاءات والبنية التحتية. اختر مجال العمل لاستكشاف قدراتنا.")}</p></div>
        <Tabs value={equipment} onValueChange={setEquipment} dir="rtl" className="shell fleet-tabs">
          <TabsList aria-label={t("مجالات تأجير المعدات")} className="fleet-tabs-list" variant="line">{fleet.map((item, i) => <TabsTrigger value={item.id} key={item.id} className="fleet-tab"><span>{String(i + 1).padStart(2, '0')}</span>{item.name}<ArrowUpLeft size={18}/></TabsTrigger>)}</TabsList>
          {fleet.map(item => <TabsContent value={item.id} key={item.id} className="fleet-panel"><div className="fleet-copy"><span className="micro fleet-en" dir="ltr">{item.en}</span><h3>{item.title}</h3><p>{item.description}</p><div className="equipment-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="button dark-button" onClick={() => requestQuote('equipment')}>{t("اطلب عرض تأجير ")}<ArrowUpLeft size={18}/></button></div><div className="fleet-visual"><span className="fleet-backdrop" aria-hidden="true">{item.id === 'loader' ? 'MOVE' : item.id === 'crane' ? 'LIFT' : 'GO'}</span><IndustrialScene key={item.id} kind={item.id as SceneKind} paused={paused} fallback={item.photo} label={item.motion + t(" في مشهد توضيحي")}/><div className="fleet-caption"><span>{item.caption}</span><span className="scene-note">{t("تصوّر حركي للمعدات")}</span></div></div></TabsContent>)}
        </Tabs>
        <EquipmentCatalog category={equipment} onRequest={requestQuote}/>
      </section>

      <CompanyDocuments profile={profile}/>

      <section id="contact" className="contact-section" data-motion-section>
        <div className="contact-top"><div className="shell"><p>{t("المملكة العربية السعودية")}</p><h2>{t("لنُحرّك")}<br /><span>{t("مشروعك القادم.")}</span></h2><a href="tel:+966500929227" className="contact-orbit" aria-label={t("اتصل بالمعدن الفائق")}><ArrowUpLeft strokeWidth={1}/></a><div className="contact-diagonals" aria-hidden="true"><i /><i /><i /></div></div></div>
        <QuoteRequest selection={quote} onServiceChange={service => setQuote(prev => ({ service, machine: '', key: prev.key + 1 }))}/>
        <div className="shell contact-details"><div><p className="eyebrow">{t("تواصل مع فريقنا")}</p><p className="contact-summary">{t("أخبرنا باحتياجك، لنبدأ الخطوة الأولى.")}</p></div><a href="tel:+966500929227" className="contact-method"><Phone size={22}/><span><small>{t("اتصل بنا")}</small><strong dir="ltr">+966 50 092 9227</strong></span><ArrowUpLeft size={18}/></a><a href="mailto:info@supermetal-sa.com" className="contact-method"><Mail size={22}/><span><small>{t("راسلنا")}</small><strong dir="ltr">info@supermetal-sa.com</strong></span><ArrowUpLeft size={18}/></a></div>
        <footer className="shell site-footer"><Brand /><p>© {new Date().getFullYear()}{t(" شركة المعدن الفائق التجارية")}</p><a href={profile} target="_blank" rel="noreferrer">{t("الملف التعريفي ")}<ArrowUpLeft size={15}/></a><a className="back-top" href="#home" aria-label={t("العودة إلى أعلى الموقع")}><ArrowDown size={18}/></a></footer>
      </section>
    </main>
  </>;
}

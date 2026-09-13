'use client';
import { useState, type FormEvent } from 'react';
import { useLanguage } from '@/components/language';
import { ArrowUpLeft, Check, Download, FileText, Layers3, ShieldCheck, Recycle, MapPin, MessageCircle, Mail, Expand, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { buildQuote, quoteFields, serviceLabels, type Service } from '@/lib/quote';
export type QuoteSelection = {
    service: Service;
    machine: string;
    key: number;
};
export function EquipmentCatalog({ category, onRequest }: {
    category: string;
    onRequest: (service: Service, machine?: string) => void;
}) {
    const { t, locale } = useLanguage();
    const equipmentItems = [
        { category: 'loader', name: t("شيولات ولودرات"), image: '/assets/loader.webp', use: t("تحميل المواد ومناولة التربة") },
        { category: 'loader', name: t("حفارات وبوبكاتات"), image: '/assets/profile-equipment-236.webp', use: t("أعمال الحفر وتجهيز المواقع") },
        { category: 'crane', name: t("كرينات متحركة"), image: '/assets/profile-equipment-240.webp', use: t("رفع المعدات والأحمال في الموقع") },
        { category: 'crane', name: t("رافعات شوكية"), image: '/assets/profile-equipment-255.webp', use: t("مناولة البضائع والطبليات") },
        { category: 'crane', name: t("رافعات تلسكوبية"), image: '/assets/profile-equipment-254.webp', use: t("مناولة المواد في مواقع العمل") },
        { category: 'crane', name: t("شاحنات برافعات"), image: '/assets/profile-equipment-258.webp', use: t("النقل والرفع ضمن مهمة واحدة") },
        { category: 'crane', name: t("سلال رفع"), image: '/assets/profile-equipment-259.webp', use: t("الوصول إلى مناطق العمل المرتفعة") },
        { category: 'truck', name: t("قلابات وشاحنات"), image: '/assets/dump-truck.webp', use: t("نقل المواد وإسناد الأعمال الميدانية") },
        { category: 'truck', name: t("لوبد للمعدات الثقيلة"), image: '/assets/profile-equipment-242.webp', use: t("نقل المعدات بين مواقع المشاريع") },
        { category: 'truck', name: t("سطحات"), image: '/assets/profile-equipment-251.webp', use: t("حلول لنقل المركبات والمعدات") },
    ];
    const items = equipmentItems.filter(item => item.category === category);
    return <div className="shell equipment-catalog">
    <div className="catalog-heading"><h3>{t("اختر المعدة المناسبة لعملك.")}</h3><span>{t("الأنواع الواردة في ملف الشركة")}</span></div>
    <div className="catalog-grid">{items.map(item => <article className="catalog-card" key={item.name}>
      <div className="catalog-image"><img src={item.image} alt={item.name} width="420" height="280" loading="lazy"/></div>
      <div className="catalog-copy"><h4>{item.name}</h4><p>{item.use}</p><button onClick={() => onRequest('equipment', item.name)}>{t("استفسر عن هذه المعدة ")}<ArrowUpLeft size={18}/></button></div>
    </article>)}</div>
    <p className="catalog-note">{t("الصور توضيحية لأنواع المعدات. يحدد فريقنا التوفر والمواصفات المناسبة عند مراجعة طلبك.")}</p>
  </div>;
}
export function WhySuperMetal() {
    const { t, locale } = useLanguage();
    const values = [
        { icon: Layers3, title: t("قدرات تتكامل"), text: t("الهدم والتفكيك، استعادة قيمة المواد، وتوفير المعدات ضمن نطاق أعمال شركة واحدة.") },
        { icon: ShieldCheck, title: t("الجودة والسلامة"), text: t("الالتزام بالجودة والسلامة من القيم التي نضعها في صميم أعمالنا.") },
        { icon: MapPin, title: t("مرونة وتغطية"), text: t("مرونة في التعاقد لخدمة احتياجات شركائنا في مختلف مناطق المملكة.") },
        { icon: Recycle, title: t("قيمة تستمر"), text: t("استعادة المواد وإعادة توجيهها للتدوير، دعمًا للاستدامة والاقتصاد الدائري.") },
    ];
    return <div className="shell why-company">
    <div className="why-heading"><span className="short-rule"/><h3>{t("لماذا المعدن الفائق؟")}</h3><span className="micro" dir="ltr">BUILT ON CAPABILITY</span></div>
    <div className="why-grid">{values.map(({ icon: Icon, title, text }, i) => <article key={title} className="why-item" data-reveal><div><Icon size={26} strokeWidth={1.5}/><span dir="ltr">0{i + 1}</span></div><h4>{title}</h4><p>{text}</p></article>)}</div>
  </div>;
}
export function CompanyDocuments({ profile }: {
    profile: string;
}) {
    const { t, locale } = useLanguage();
    const [open, setOpen] = useState(false);
    return <section id="credentials" className="documents-section light-section" data-motion-section>
    <div className="shell documents-layout">
      <div className="documents-copy" data-reveal><p className="eyebrow dark-eyebrow"><FileText size={19}/>{t("ملف الشركة ووثائقها")}</p><h2>{t("تعرّف علينا.")}<br /><span className="muted-heading">{t("عن قرب.")}</span></h2><p>{t("اطّلع على أنشطتنا ومجالات تأجير المعدات، وصفحة التراخيص والشهادات ضمن الملف التعريفي للشركة.")}</p><a className="button dark-button" href={profile} download="Super-Metal-Company-Profile.pdf">{t("تحميل البروفايل ")}<Download size={18}/></a><span className="document-meta">{t("PDF \u00B7 16 صفحة \u00B7 10.3 ميجابايت")}</span></div>
      <div className="document-card" data-reveal><div className="document-card-heading"><span>{t("التراخيص والشهادات")}</span><span className="micro" dir="ltr">COMPANY PROFILE / 07</span></div><button className="document-preview" onClick={() => setOpen(true)} aria-label={t("تكبير صفحة التراخيص والشهادات")}><img src="/assets/profile-credentials.webp" alt={t("صفحة التراخيص والشهادات كما وردت في بروفايل المعدن الفائق")} width="1792" height="637" loading="lazy"/><span><Expand size={16}/>{t(" عرض الصفحة")}</span></button><div className="document-card-footer"><span>{t("من الملف التعريفي للشركة")}</span><a href={profile + '#page=7'} target="_blank" rel="noreferrer">{t("فتح في PDF ")}<ArrowUpLeft size={17}/></a></div></div>
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="document-dialog" showCloseButton={false} dir={locale === 'ar' ? 'rtl' : 'ltr'}><DialogTitle>{t("التراخيص والشهادات")}</DialogTitle><DialogDescription>{t("الصفحة السابعة من الملف التعريفي للشركة.")}</DialogDescription><DialogClose asChild><button className="document-close" aria-label={t("إغلاق عرض الوثائق")}><X size={22}/></button></DialogClose><img src="/assets/profile-credentials.webp" alt={t("صفحة التراخيص والشهادات من البروفايل")} width="1792" height="637"/><a className="text-link dark-link" href={profile + '#page=7'} target="_blank" rel="noreferrer">{t("فتح الملف الأصلي ")}<ArrowUpLeft size={18}/></a></DialogContent></Dialog>
  </section>;
}
export function QuoteRequest({ selection, onServiceChange }: {
    selection: QuoteSelection;
    onServiceChange: (service: Service) => void;
}) {
    const { t, locale } = useLanguage();
    const [handoff, setHandoff] = useState('');
    const service = selection.service;
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
        const text = buildQuote(service, values, locale);
        const via = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') || 'whatsapp';
        if (via === 'email') {
            window.location.href = 'mailto:info@supermetal-sa.com?subject=' + encodeURIComponent(t("طلب عرض سعر — ") + t(serviceLabels[service])) + '&body=' + encodeURIComponent(text);
            setHandoff(t("راجِع الطلب في تطبيق البريد وأرسله. إذا لم يفتح التطبيق، يمكنك المتابعة عبر واتساب."));
        }
        else {
            window.open('https://wa.me/966500929227?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
            setHandoff(t("راجِع الطلب في واتساب واضغط إرسال لإيصاله إلى فريقنا."));
        }
    }
    return <div id="quote" className="shell quote-layout">
    <div className="quote-copy"><p className="eyebrow">{t("ابدأ بطلب واضح")}</p><h3>{t("ما الذي يحتاجه")}<br /><em>{t("مشروعك؟")}</em></h3><p>{t("اختر الخدمة وأخبرنا بالتفاصيل الأساسية، ليتمكن فريقنا من مراجعة احتياجك والتواصل معك.")}</p><ul><li><Check size={18}/>{t(" هدم وتفكيك وتجهيز مواقع")}</li><li><Check size={18}/>{t(" شراء وبيع السكراب")}</li><li><Check size={18}/>{t(" تأجير معدات للمشروع")}</li></ul><p className="quote-direct">{t("تفضّل الحديث مباشرة؟")}<a href="tel:+966500929227" dir="ltr">+966 50 092 9227</a></p></div>
    <form className="quote-form" onSubmit={submit} onChange={() => setHandoff('')}>
      <fieldset className="service-picker"><legend>{t("الخدمة المطلوبة")}</legend><div>{(Object.keys(serviceLabels) as Service[]).map(key => <label key={key} className={service === key ? 'selected' : ''}><input type="radio" name="service" value={key} checked={service === key} onChange={() => { onServiceChange(key); setHandoff(''); }}/><span>{t(serviceLabels[key])}</span></label>)}</div></fieldset>
      <div className="quote-fields">
        <div className="quote-field"><Label htmlFor="quote-name">{t("الاسم ")}<span aria-hidden="true">*</span></Label><Input id="quote-name" name="name" required maxLength={80} autoComplete="name" placeholder={t("اسمك الكريم")}/></div>
        <div className="quote-field"><Label htmlFor="quote-phone">{t("رقم التواصل ")}<span aria-hidden="true">*</span></Label><Input id="quote-phone" name="phone" type="tel" dir="ltr" required minLength={7} maxLength={25} autoComplete="tel" placeholder="+966 …"/></div>
        <div className="quote-field"><Label htmlFor="quote-company">{t("اسم الجهة ")}<small>{t("اختياري")}</small></Label><Input id="quote-company" name="company" maxLength={100} autoComplete="organization" placeholder={t("الشركة أو المؤسسة")}/></div>
        <div className="quote-field"><Label htmlFor="quote-location">{t("موقع المشروع ")}<span aria-hidden="true">*</span></Label><Input id="quote-location" name="location" required maxLength={150} placeholder={t("المدينة والحي أو موقع العمل")}/></div>
        {service === 'scrap' && <fieldset className="transaction-picker"><legend>{t("نوع الطلب")}</legend><label><input type="radio" name="transaction" value={t("أرغب في بيع سكراب")} defaultChecked/>{t(" أرغب في بيع سكراب")}</label><label><input type="radio" name="transaction" value={t("أرغب في شراء سكراب")}/>{t(" أرغب في شراء سكراب")}</label></fieldset>}
        {quoteFields[service].map(field => <div className="quote-field" key={field.name + selection.key}><Label htmlFor={'quote-' + field.name}>{t(field.label)}{field.name === 'machine' && <span aria-hidden="true">*</span>}</Label><Input id={'quote-' + field.name} name={field.name} maxLength={140} placeholder={t(field.placeholder)} defaultValue={field.name === 'machine' ? selection.machine : ''} required={field.name === 'machine'}/></div>)}
        <div className="quote-field quote-field-wide"><Label htmlFor="quote-start">{t("الموعد المتوقع ")}<small>{t("اختياري")}</small></Label><Input id="quote-start" name="start" type="date"/></div>
        <div className="quote-field quote-field-wide"><Label htmlFor="quote-notes">{t("تفاصيل إضافية ")}<small>{t("اختياري")}</small></Label><Textarea id="quote-notes" name="notes" maxLength={700} rows={3} placeholder={t("أي تفاصيل تساعدنا على فهم العمل، أو مواصفات المعدة المطلوبة…")}/></div>
      </div>
      <div className="quote-submit"><button className="button" type="submit" name="via" value="whatsapp">{t("متابعة عبر واتساب ")}<MessageCircle size={19}/></button><button className="quote-email" type="submit" name="via" value="email">{t("عبر البريد الإلكتروني ")}<Mail size={18}/></button></div>
      <p className="quote-help">{t("يفتح طلبك في واتساب أو البريد لمراجعته وإرساله بنفسك. الحقول بعلامة * مطلوبة.")}</p><p className="quote-status" role="status">{handoff}</p>
    </form>
  </div>;
}

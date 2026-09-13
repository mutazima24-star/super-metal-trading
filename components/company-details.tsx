'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpLeft, Check, Download, FileText, Layers3, ShieldCheck, Recycle, MapPin, MessageCircle, Mail, Expand, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { buildQuote, quoteFields, serviceLabels, type Service } from '@/lib/quote';

export type QuoteSelection = { service: Service; machine: string; key: number };

const equipmentItems = [
  { category: 'loader', name: 'شيولات ولودرات', image: '/assets/loader.webp', use: 'تحميل المواد ومناولة التربة' },
  { category: 'loader', name: 'حفارات وبوبكاتات', image: '/assets/profile-equipment-236.webp', use: 'أعمال الحفر وتجهيز المواقع' },
  { category: 'crane', name: 'كرينات متحركة', image: '/assets/profile-equipment-240.webp', use: 'رفع المعدات والأحمال في الموقع' },
  { category: 'crane', name: 'رافعات شوكية', image: '/assets/profile-equipment-255.webp', use: 'مناولة البضائع والطبليات' },
  { category: 'crane', name: 'رافعات تلسكوبية', image: '/assets/profile-equipment-254.webp', use: 'مناولة المواد في مواقع العمل' },
  { category: 'crane', name: 'شاحنات برافعات', image: '/assets/profile-equipment-258.webp', use: 'النقل والرفع ضمن مهمة واحدة' },
  { category: 'crane', name: 'سلال رفع', image: '/assets/profile-equipment-259.webp', use: 'الوصول إلى مناطق العمل المرتفعة' },
  { category: 'truck', name: 'قلابات وشاحنات', image: '/assets/dump-truck.webp', use: 'نقل المواد وإسناد الأعمال الميدانية' },
  { category: 'truck', name: 'لوبد للمعدات الثقيلة', image: '/assets/profile-equipment-242.webp', use: 'نقل المعدات بين مواقع المشاريع' },
  { category: 'truck', name: 'سطحات', image: '/assets/profile-equipment-251.webp', use: 'حلول لنقل المركبات والمعدات' },
];

export function EquipmentCatalog({ category, onRequest }: { category: string; onRequest: (service: Service, machine?: string) => void }) {
  const items = equipmentItems.filter(item => item.category === category);
  return <div className="shell equipment-catalog">
    <div className="catalog-heading"><h3>اختر المعدة المناسبة لعملك.</h3><span>الأنواع الواردة في ملف الشركة</span></div>
    <div className="catalog-grid">{items.map(item => <article className="catalog-card" key={item.name}>
      <div className="catalog-image"><img src={item.image} alt={item.name} width="420" height="280" loading="lazy" /></div>
      <div className="catalog-copy"><h4>{item.name}</h4><p>{item.use}</p><button onClick={() => onRequest('equipment', item.name)}>استفسر عن هذه المعدة <ArrowUpLeft size={18} /></button></div>
    </article>)}</div>
    <p className="catalog-note">الصور توضيحية لأنواع المعدات. يحدد فريقنا التوفر والمواصفات المناسبة عند مراجعة طلبك.</p>
  </div>;
}

export function WhySuperMetal() {
  const values = [
    { icon: Layers3, title: 'قدرات تتكامل', text: 'الهدم والتفكيك، استعادة قيمة المواد، وتوفير المعدات ضمن نطاق أعمال شركة واحدة.' },
    { icon: ShieldCheck, title: 'الجودة والسلامة', text: 'الالتزام بالجودة والسلامة من القيم التي نضعها في صميم أعمالنا.' },
    { icon: MapPin, title: 'مرونة وتغطية', text: 'مرونة في التعاقد لخدمة احتياجات شركائنا في مختلف مناطق المملكة.' },
    { icon: Recycle, title: 'قيمة تستمر', text: 'استعادة المواد وإعادة توجيهها للتدوير، دعمًا للاستدامة والاقتصاد الدائري.' },
  ];
  return <div className="shell why-company">
    <div className="why-heading"><span className="short-rule" /><h3>لماذا المعدن الفائق؟</h3><span className="micro" dir="ltr">BUILT ON CAPABILITY</span></div>
    <div className="why-grid">{values.map(({icon: Icon, title, text}, i) => <article key={title} className="why-item" data-reveal><div><Icon size={26} strokeWidth={1.5}/><span dir="ltr">0{i + 1}</span></div><h4>{title}</h4><p>{text}</p></article>)}</div>
  </div>;
}

export function CompanyDocuments({ profile }: { profile: string }) {
  const [open, setOpen] = useState(false);
  return <section id="credentials" className="documents-section light-section" data-motion-section>
    <div className="shell documents-layout">
      <div className="documents-copy" data-reveal><p className="eyebrow dark-eyebrow"><FileText size={19} />ملف الشركة ووثائقها</p><h2>تعرّف علينا.<br/><span className="muted-heading">عن قرب.</span></h2><p>اطّلع على أنشطتنا ومجالات تأجير المعدات، وصفحة التراخيص والشهادات ضمن الملف التعريفي للشركة.</p><a className="button dark-button" href={profile} download="Super-Metal-Company-Profile.pdf">تحميل البروفايل <Download size={18}/></a><span className="document-meta">PDF · 16 صفحة · 10.3 ميجابايت</span></div>
      <div className="document-card" data-reveal><div className="document-card-heading"><span>التراخيص والشهادات</span><span className="micro" dir="ltr">COMPANY PROFILE / 07</span></div><button className="document-preview" onClick={() => setOpen(true)} aria-label="تكبير صفحة التراخيص والشهادات"><img src="/assets/profile-credentials.webp" alt="صفحة التراخيص والشهادات كما وردت في بروفايل المعدن الفائق" width="1792" height="637" loading="lazy" /><span><Expand size={16}/> عرض الصفحة</span></button><div className="document-card-footer"><span>من الملف التعريفي للشركة</span><a href={profile + '#page=7'} target="_blank" rel="noreferrer">فتح في PDF <ArrowUpLeft size={17}/></a></div></div>
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="document-dialog" showCloseButton={false} dir="rtl"><DialogTitle>التراخيص والشهادات</DialogTitle><DialogDescription>الصفحة السابعة من الملف التعريفي للشركة.</DialogDescription><DialogClose asChild><button className="document-close" aria-label="إغلاق عرض الوثائق"><X size={22}/></button></DialogClose><img src="/assets/profile-credentials.webp" alt="صفحة التراخيص والشهادات من البروفايل" width="1792" height="637"/><a className="text-link dark-link" href={profile + '#page=7'} target="_blank" rel="noreferrer">فتح الملف الأصلي <ArrowUpLeft size={18}/></a></DialogContent></Dialog>
  </section>;
}

export function QuoteRequest({ selection, onServiceChange }: { selection: QuoteSelection; onServiceChange: (service: Service) => void }) {
  const [handoff, setHandoff] = useState('');
  const service = selection.service;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const text = buildQuote(service, values);
    const via = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') || 'whatsapp';
    if (via === 'email') {
      window.location.href = 'mailto:info@supermetal-sa.com?subject=' + encodeURIComponent('طلب عرض سعر — ' + serviceLabels[service]) + '&body=' + encodeURIComponent(text);
      setHandoff('راجِع الطلب في تطبيق البريد وأرسله. إذا لم يفتح التطبيق، يمكنك المتابعة عبر واتساب.');
    } else {
      window.open('https://wa.me/966500929227?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
      setHandoff('راجِع الطلب في واتساب واضغط إرسال لإيصاله إلى فريقنا.');
    }
  }
  return <div id="quote" className="shell quote-layout">
    <div className="quote-copy"><p className="eyebrow">ابدأ بطلب واضح</p><h3>ما الذي يحتاجه<br/><em>مشروعك؟</em></h3><p>اختر الخدمة وأخبرنا بالتفاصيل الأساسية، ليتمكن فريقنا من مراجعة احتياجك والتواصل معك.</p><ul><li><Check size={18}/> هدم وتفكيك وتجهيز مواقع</li><li><Check size={18}/> شراء وبيع السكراب</li><li><Check size={18}/> تأجير معدات للمشروع</li></ul><p className="quote-direct">تفضّل الحديث مباشرة؟<a href="tel:+966500929227" dir="ltr">+966 50 092 9227</a></p></div>
    <form className="quote-form" onSubmit={submit} onChange={() => setHandoff('')}>
      <fieldset className="service-picker"><legend>الخدمة المطلوبة</legend><div>{(Object.keys(serviceLabels) as Service[]).map(key => <label key={key} className={service === key ? 'selected' : ''}><input type="radio" name="service" value={key} checked={service === key} onChange={() => {onServiceChange(key); setHandoff('');}}/><span>{serviceLabels[key]}</span></label>)}</div></fieldset>
      <div className="quote-fields">
        <div className="quote-field"><Label htmlFor="quote-name">الاسم <span aria-hidden="true">*</span></Label><Input id="quote-name" name="name" required maxLength={80} autoComplete="name" placeholder="اسمك الكريم"/></div>
        <div className="quote-field"><Label htmlFor="quote-phone">رقم التواصل <span aria-hidden="true">*</span></Label><Input id="quote-phone" name="phone" type="tel" dir="ltr" required minLength={7} maxLength={25} autoComplete="tel" placeholder="+966 …"/></div>
        <div className="quote-field"><Label htmlFor="quote-company">اسم الجهة <small>اختياري</small></Label><Input id="quote-company" name="company" maxLength={100} autoComplete="organization" placeholder="الشركة أو المؤسسة"/></div>
        <div className="quote-field"><Label htmlFor="quote-location">موقع المشروع <span aria-hidden="true">*</span></Label><Input id="quote-location" name="location" required maxLength={150} placeholder="المدينة والحي أو موقع العمل"/></div>
        {service === 'scrap' && <fieldset className="transaction-picker"><legend>نوع الطلب</legend><label><input type="radio" name="transaction" value="أرغب في بيع سكراب" defaultChecked/> أرغب في بيع سكراب</label><label><input type="radio" name="transaction" value="أرغب في شراء سكراب"/> أرغب في شراء سكراب</label></fieldset>}
        {quoteFields[service].map(field => <div className="quote-field" key={field.name + selection.key}><Label htmlFor={'quote-' + field.name}>{field.label}{field.name === 'machine' && <span aria-hidden="true">*</span>}</Label><Input id={'quote-' + field.name} name={field.name} maxLength={140} placeholder={field.placeholder} defaultValue={field.name === 'machine' ? selection.machine : ''} required={field.name === 'machine'}/></div>)}
        <div className="quote-field quote-field-wide"><Label htmlFor="quote-start">الموعد المتوقع <small>اختياري</small></Label><Input id="quote-start" name="start" type="date"/></div>
        <div className="quote-field quote-field-wide"><Label htmlFor="quote-notes">تفاصيل إضافية <small>اختياري</small></Label><Textarea id="quote-notes" name="notes" maxLength={700} rows={3} placeholder="أي تفاصيل تساعدنا على فهم العمل، أو مواصفات المعدة المطلوبة…"/></div>
      </div>
      <div className="quote-submit"><button className="button" type="submit" name="via" value="whatsapp">متابعة عبر واتساب <MessageCircle size={19}/></button><button className="quote-email" type="submit" name="via" value="email">عبر البريد الإلكتروني <Mail size={18}/></button></div>
      <p className="quote-help">يفتح طلبك في واتساب أو البريد لمراجعته وإرساله بنفسك. الحقول بعلامة * مطلوبة.</p><p className="quote-status" role="status">{handoff}</p>
    </form>
  </div>;
}

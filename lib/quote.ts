export type Service = 'demolition' | 'scrap' | 'equipment';

export const serviceLabels: Record<Service, string> = {
  demolition: 'الهدم والتفكيك', scrap: 'تجارة السكراب', equipment: 'تأجير المعدات',
};

export const quoteFields: Record<Service, { name: string; label: string; placeholder: string }[]> = {
  demolition: [
    { name: 'structure', label: 'نوع المنشأة', placeholder: 'مبنى، مستودع، مصنع…' },
    { name: 'scope', label: 'نطاق الأعمال', placeholder: 'المساحة التقريبية وعدد الطوابق' },
  ],
  scrap: [
    { name: 'material', label: 'نوع المواد', placeholder: 'حديد، نحاس، ألمنيوم…' },
    { name: 'quantity', label: 'الكمية التقريبية', placeholder: 'اكتب الكمية والوحدة إن توفرت' },
  ],
  equipment: [
    { name: 'machine', label: 'المعدة المطلوبة', placeholder: 'اسم المعدة أو طبيعة الاستخدام' },
    { name: 'duration', label: 'مدة التأجير', placeholder: 'عدد الأيام أو الأشهر' },
  ],
};

export function buildQuote(service: Service, values: Record<string, string>) {
  const fields = [
    { name: 'name', label: 'الاسم' }, { name: 'phone', label: 'رقم التواصل' },
    { name: 'company', label: 'الجهة' }, { name: 'location', label: 'موقع المشروع' },
    ...(service === 'scrap' ? [{ name: 'transaction', label: 'نوع الطلب' }] : []),
    ...quoteFields[service], { name: 'start', label: 'الموعد المتوقع' },
    { name: 'notes', label: 'تفاصيل إضافية' },
  ];
  return ['طلب عرض سعر — ' + serviceLabels[service], ...fields
    .filter(field => values[field.name]?.trim())
    .map(field => `${field.label}: ${values[field.name].trim()}`)].join('\n');
}

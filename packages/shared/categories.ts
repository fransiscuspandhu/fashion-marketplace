/**
 * Official 11 Product Categories of Rahayu Fashion Store
 * With Dynamic Size Presets, Measurement Labels, Variant Attributes & Color Swatches
 * Configurable directly from the Internal Admin Control Panel (Module 2).
 */

export interface ColorPreset {
  name: string;
  hex: string;
}

export interface RahayuCategory {
  id: string;
  slug: string;
  nameId: string;
  nameEn: string;
  navGroup: 'MODEST_WEAR' | 'CONTEMPORARY' | 'ESSENTIALS_MATERNITY' | 'KIDS_BABY';
  measurementLabel: string;
  variantAttributeLabel: string;
  sizePresets: string[];
  colorPresets: ColorPreset[];
}

export const RAHAYU_CATEGORIES: RahayuCategory[] = [
  {
    id: 'cat-hijab',
    slug: 'hijab',
    nameId: 'Hijab',
    nameEn: 'Hijab & Scarves',
    navGroup: 'MODEST_WEAR',
    measurementLabel: 'Dimensi Hijab (cm)',
    variantAttributeLabel: 'Finishing Tepi (Laser Cut / Jahit Tepi)',
    sizePresets: ['110x110 cm', '115x115 cm', '130x130 cm (Syari)', '180x75 cm (Pashmina)'],
    colorPresets: [
      { name: 'Dusty Lilac', hex: '#C084FC' },
      { name: 'Warm Oat', hex: '#D6C7B2' },
      { name: 'Onyx Black', hex: '#18181B' },
      { name: 'Rosewood', hex: '#BE185D' },
    ],
  },
  {
    id: 'cat-atasan-muslim-wanita',
    slug: 'atasan-muslim-wanita',
    nameId: 'Atasan Muslim Wanita',
    nameEn: "Women's Modest Tops & Tunics",
    navGroup: 'MODEST_WEAR',
    measurementLabel: 'Lingkar Dada (LD) & Panjang Tunik',
    variantAttributeLabel: 'Akses Wudhu & Busui Friendly',
    sizePresets: ['XS (LD 90)', 'S (LD 94)', 'M (LD 100)', 'L (LD 106)', 'XL (LD 112)', 'XXL (LD 120)'],
    colorPresets: [
      { name: 'Royal Plum', hex: '#7C3AED' },
      { name: 'Champagne Silk', hex: '#E7E0D6' },
      { name: 'Sage Green', hex: '#84A98C' },
    ],
  },
  {
    id: 'cat-bawahan-muslim-wanita',
    slug: 'bawahan-muslim-wanita',
    nameId: 'Bawahan Muslim Wanita',
    nameEn: "Women's Modest Skirts & Culottes",
    navGroup: 'MODEST_WEAR',
    measurementLabel: 'Lingkar Pinggang & Panjang Rok/Kulot',
    variantAttributeLabel: 'Tipe Pinggang (Full Karet / Half Karet)',
    sizePresets: ['S/M (Panjang 95cm)', 'L/XL (Panjang 98cm)', 'All Size Fit XL'],
    colorPresets: [
      { name: 'Espresso', hex: '#4A3728' },
      { name: 'Cream Matte', hex: '#E5DFD5' },
      { name: 'Charcoal', hex: '#27272A' },
    ],
  },
  {
    id: 'cat-aksesoris-muslim',
    slug: 'aksesoris-muslim',
    nameId: 'Aksesoris Muslim',
    nameEn: 'Modest Accessories & Brooches',
    navGroup: 'MODEST_WEAR',
    measurementLabel: 'Ukuran Bros / Scrunchie',
    variantAttributeLabel: 'Material Logam / Satin',
    sizePresets: ['Regular (3.5 cm)', 'Mini Twin Set', 'Bundling Gift Box'],
    colorPresets: [
      { name: '18K Gold Plated', hex: '#D97706' },
      { name: 'Rose Gold', hex: '#F43F5E' },
      { name: 'Silver Rhodium', hex: '#94A3B8' },
    ],
  },
  {
    id: 'cat-atasan',
    slug: 'atasan',
    nameId: 'Atasan',
    nameEn: "Women's Tops & Blouses",
    navGroup: 'CONTEMPORARY',
    measurementLabel: 'Ukuran Standar Atasan Wanita',
    variantAttributeLabel: 'Potongan (Regular / Oversized Fit)',
    sizePresets: ['XS', 'S', 'M', 'L', 'XL'],
    colorPresets: [
      { name: 'Sky Blue', hex: '#0284C7' },
      { name: 'Crisp White', hex: '#F8FAFC' },
      { name: 'Taupe', hex: '#A8A29E' },
    ],
  },
  {
    id: 'cat-celana-panjang-legging',
    slug: 'celana-panjang-legging',
    nameId: 'Celana Panjang & Legging',
    nameEn: 'Trousers & Leggings',
    navGroup: 'CONTEMPORARY',
    measurementLabel: 'Ukuran Pinggang (Nomor / Huruf)',
    variantAttributeLabel: 'Tingkat Stretch & Ketebalan Kain',
    sizePresets: ['S (27-28)', 'M (29-30)', 'L (31-32)', 'XL (33-34)', 'XXL (35-36)'],
    colorPresets: [
      { name: 'Jet Black', hex: '#18181B' },
      { name: 'Dark Grey', hex: '#52525B' },
      { name: 'Khaki Tan', hex: '#C2B280' },
    ],
  },
  {
    id: 'cat-pakaian-wanita-lainnya',
    slug: 'pakaian-wanita-lainnya',
    nameId: 'Pakaian Wanita Lainnya',
    nameEn: 'Dresses, Outerwear & Co-ords',
    navGroup: 'CONTEMPORARY',
    measurementLabel: 'Ukuran Dress / Outer / One-Set',
    variantAttributeLabel: 'Kelengkapan (Outer Only / Set 2-in-1)',
    sizePresets: ['S/M', 'L/XL', 'Custom Petite'],
    colorPresets: [
      { name: 'Indigo Night', hex: '#4F46E5' },
      { name: 'Sand Beige', hex: '#D6C7B2' },
    ],
  },
  {
    id: 'cat-pakaian-dalam',
    slug: 'pakaian-dalam',
    nameId: 'Pakaian Dalam',
    nameEn: 'Innerwear, Ciput & Essentials',
    navGroup: 'ESSENTIALS_MATERNITY',
    measurementLabel: 'Ukuran Manset / Ciput / Inner',
    variantAttributeLabel: 'Bahan Serat (Bamboo / Rayon Spandex)',
    sizePresets: ['S/M', 'L/XL', 'Jumbo XXL', 'All Size (Ciput)'],
    colorPresets: [
      { name: 'Nude Skin', hex: '#E3C1B4' },
      { name: 'Black', hex: '#18181B' },
      { name: 'Off White', hex: '#F5F5F4' },
    ],
  },
  {
    id: 'cat-baju-hamil',
    slug: 'baju-hamil',
    nameId: 'Baju Hamil',
    nameEn: 'Maternity & Nursing Friendly',
    navGroup: 'ESSENTIALS_MATERNITY',
    measurementLabel: 'Ukuran Ibu Hamil & Menyusui (Trimester 1-3)',
    variantAttributeLabel: 'Tipe Bukaan Menyusui (Zipper / Layer)',
    sizePresets: ['Mom S/M (LD 102)', 'Mom L (LD 110)', 'Mom XL (LD 120)'],
    colorPresets: [
      { name: 'Blush Rose', hex: '#F43F5E' },
      { name: 'Soft Lavender', hex: '#C084FC' },
      { name: 'Oatmeal Linen', hex: '#D6C7B2' },
    ],
  },
  {
    id: 'cat-pakaian-anak-perempuan',
    slug: 'pakaian-anak-perempuan',
    nameId: 'Pakaian Anak Perempuan',
    nameEn: "Girls' Apparel (2-12 Yrs)",
    navGroup: 'KIDS_BABY',
    measurementLabel: 'Rentang Usia Anak Perempuan',
    variantAttributeLabel: 'Paket (Gamis + Hijab Anak)',
    sizePresets: ['Kids S (2-4 Thn)', 'Kids M (5-7 Thn)', 'Kids L (8-10 Thn)', 'Kids XL (11-12 Thn)'],
    colorPresets: [
      { name: 'Berry Pink', hex: '#EC4899' },
      { name: 'Lilac Blossom', hex: '#D8B4FE' },
    ],
  },
  {
    id: 'cat-pakaian-bayi',
    slug: 'pakaian-bayi',
    nameId: 'Pakaian Bayi',
    nameEn: 'Baby Apparel & Gift Sets',
    navGroup: 'KIDS_BABY',
    measurementLabel: 'Usia Bayi (Bulan) & Berat Badan',
    variantAttributeLabel: 'Sertifikasi Katun Organik Hypoallergenic',
    sizePresets: ['Newborn (0-3 Bln)', '3-6 Bln', '6-12 Bln', '12-24 Bln'],
    colorPresets: [
      { name: 'Mint Soft', hex: '#14B8A6' },
      { name: 'Butter Cream', hex: '#FDE68A' },
    ],
  },
];

/**
 * Data store for Rahayu Fashion Store
 * Contains: 11 Official Categories, Seed Products, TikTok Live State, and Promos
 */

export interface ColorPreset {
  name: string;
  hex: string;
}

export interface MarketplacePillar {
  id: string;
  name: string;
  description?: string;
}

export const DEFAULT_PILLARS: MarketplacePillar[] = [
  { id: "modest", name: "Modest Fashion Wanita", description: "Hijab, Tunik, Abaya & Busana Muslimah" },
  { id: "kehamilan", name: "Kehamilan, Busui & Nifas", description: "Baju Hamil, Maternity & Menyusui" },
  { id: "anak", name: "Bayi & Anak", description: "Pakaian Bayi & Anak Perempuan/Laki-laki" },
];

export interface RahayuCategory {
  id: string;
  slug: string;
  nameId: string;
  nameEn: string;
  pillar: string; // Dynamic pillar name (tanpa kata "Pilar")
  iconBg: string;
  colorHex: string;
  iconName?: string;
  imageUrl?: string; // Standar: 1:1 rasio, 200x200 px (min 120x120, max 500x500 px, maks 500 KB)
  measurementLabel: string;
  variantAttr: string;
  sizes: string[];
  colors: ColorPreset[];
}

export interface ProductItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  priceIdr: number;
  origPriceIdr: number;
  discountPct: number;
  promoBadge: string;
  isPromoHighlight: boolean;
  hasVideo: boolean;
  videoUrl: string;
  desc: string;
  rating: number;
  reviewCount: number;
}

export const CATEGORIES_DATA: RahayuCategory[] = [
  {
    id: 'Hijab',
    slug: 'hijab',
    nameId: 'Hijab',
    nameEn: 'Hijab & Scarves',
    pillar: 'Modest Fashion Wanita',
    iconBg: '#EDE9FE',
    colorHex: '#7C3AED',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Dimensi Hijab (cm)',
    variantAttr: 'Finishing Tepi (Laser Cut / Jahit Tepi)',
    sizes: ['110x110 cm', '115x115 cm', '130x130 cm (Syari)', '180x75 cm (Pashmina)'],
    colors: [
      { name: 'Dusty Lilac', hex: '#C084FC' },
      { name: 'Warm Oat', hex: '#D6C7B2' },
      { name: 'Onyx Black', hex: '#18181B' },
      { name: 'Rosewood', hex: '#BE185D' },
    ],
  },
  {
    id: 'Atasan Muslim Wanita',
    slug: 'atasan-muslim-wanita',
    nameId: 'Atasan Muslim Wanita',
    nameEn: "Women's Modest Tops & Tunics",
    pillar: 'Modest Fashion Wanita',
    iconBg: '#F3E8FF',
    colorHex: '#6D28D9',
    iconName: 'Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Lingkar Dada (LD) & Panjang Tunik',
    variantAttr: 'Akses Wudhu & Busui Friendly',
    sizes: ['XS (LD 90)', 'S (LD 94)', 'M (LD 100)', 'L (LD 106)', 'XL (LD 112)', 'XXL (LD 120)'],
    colors: [
      { name: 'Royal Plum', hex: '#7C3AED' },
      { name: 'Champagne Silk', hex: '#E7E0D6' },
      { name: 'Sage Green', hex: '#84A98C' },
    ],
  },
  {
    id: 'Bawahan Muslim Wanita',
    slug: 'bawahan-muslim-wanita',
    nameId: 'Bawahan Muslim Wanita',
    nameEn: "Women's Modest Skirts & Culottes",
    pillar: 'Modest Fashion Wanita',
    iconBg: '#FCE7F3',
    colorHex: '#9D174D',
    iconName: 'ShoppingBag',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Lingkar Pinggang & Panjang Rok/Kulot',
    variantAttr: 'Tipe Pinggang (Full Karet / Half Karet)',
    sizes: ['S/M (Panjang 95cm)', 'L/XL (Panjang 98cm)', 'All Size Fit XL'],
    colors: [
      { name: 'Espresso', hex: '#4A3728' },
      { name: 'Cream Matte', hex: '#E5DFD5' },
      { name: 'Charcoal', hex: '#27272A' },
    ],
  },
  {
    id: 'Aksesoris Muslim',
    slug: 'aksesoris-muslim',
    nameId: 'Aksesoris Muslim',
    nameEn: 'Modest Accessories & Brooches',
    pillar: 'Modest Fashion Wanita',
    iconBg: '#FEF3C7',
    colorHex: '#B45309',
    iconName: 'Crown',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Ukuran Bros / Scrunchie',
    variantAttr: 'Material Logam / Satin',
    sizes: ['Regular (3.5 cm)', 'Mini Twin Set', 'Bundling Gift Box'],
    colors: [
      { name: '18K Gold Plated', hex: '#D97706' },
      { name: 'Rose Gold', hex: '#F43F5E' },
      { name: 'Silver Rhodium', hex: '#94A3B8' },
    ],
  },
  {
    id: 'Atasan',
    slug: 'atasan',
    nameId: 'Atasan',
    nameEn: "Women's Tops & Blouses",
    pillar: 'Modest Fashion Wanita',
    iconBg: '#E0F2FE',
    colorHex: '#0369A1',
    iconName: 'Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Ukuran Standar Atasan Wanita',
    variantAttr: 'Potongan (Regular / Oversized Fit)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sky Blue', hex: '#0284C7' },
      { name: 'Crisp White', hex: '#F8FAFC' },
      { name: 'Taupe', hex: '#A8A29E' },
    ],
  },
  {
    id: 'Celana Panjang & Legging',
    slug: 'celana-panjang-legging',
    nameId: 'Celana Panjang & Legging',
    nameEn: 'Trousers & Leggings',
    pillar: 'Kehamilan, Busui & Nifas',
    iconBg: '#E4E4E7',
    colorHex: '#27272A',
    iconName: 'Footprints',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Ukuran Pinggang (Nomor / Huruf)',
    variantAttr: 'Tingkat Stretch & Ketebalan Kain',
    sizes: ['S (27-28)', 'M (29-30)', 'L (31-32)', 'XL (33-34)', 'XXL (35-36)'],
    colors: [
      { name: 'Jet Black', hex: '#18181B' },
      { name: 'Dark Grey', hex: '#52525B' },
      { name: 'Khaki Tan', hex: '#C2B280' },
    ],
  },
  {
    id: 'Pakaian Wanita Lainnya',
    slug: 'pakaian-wanita-lainnya',
    nameId: 'Pakaian Wanita Lainnya',
    nameEn: 'Dresses, Outerwear & Co-ords',
    pillar: 'Modest Fashion Wanita',
    iconBg: '#E0E7FF',
    colorHex: '#4338CA',
    iconName: 'Heart',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Ukuran Dress / Outer / One-Set',
    variantAttr: 'Kelengkapan (Outer Only / Set 2-in-1)',
    sizes: ['S/M', 'L/XL', 'Custom Petite'],
    colors: [
      { name: 'Indigo Night', hex: '#4F46E5' },
      { name: 'Sand Beige', hex: '#D6C7B2' },
    ],
  },
  {
    id: 'Pakaian Dalam',
    slug: 'pakaian-dalam',
    nameId: 'Pakaian Dalam',
    nameEn: 'Innerwear, Ciput & Essentials',
    pillar: 'Kehamilan, Busui & Nifas',
    iconBg: '#F4F4F5',
    colorHex: '#52525B',
    iconName: 'Heart',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Ukuran Manset / Ciput / Inner',
    variantAttr: 'Bahan Serat (Bamboo / Rayon Spandex)',
    sizes: ['S/M', 'L/XL', 'Jumbo XXL', 'All Size (Ciput)'],
    colors: [
      { name: 'Nude Skin', hex: '#E3C1B4' },
      { name: 'Black', hex: '#18181B' },
      { name: 'Off White', hex: '#F5F5F4' },
    ],
  },
  {
    id: 'Baju Hamil',
    slug: 'baju-hamil',
    nameId: 'Baju Hamil',
    nameEn: 'Maternity & Nursing Friendly',
    pillar: 'Kehamilan, Busui & Nifas',
    iconBg: '#FFE4E6',
    colorHex: '#E11D48',
    iconName: 'Heart',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Ukuran Ibu Hamil & Menyusui (Trimester 1-3)',
    variantAttr: 'Tipe Bukaan Menyusui (Zipper / Layer)',
    sizes: ['Mom S/M (LD 102)', 'Mom L (LD 110)', 'Mom XL (LD 120)'],
    colors: [
      { name: 'Blush Rose', hex: '#F43F5E' },
      { name: 'Soft Lavender', hex: '#C084FC' },
      { name: 'Oatmeal Linen', hex: '#D6C7B2' },
    ],
  },
  {
    id: 'Pakaian Anak Perempuan',
    slug: 'pakaian-anak-perempuan',
    nameId: 'Pakaian Anak Perempuan',
    nameEn: "Girls' Apparel (2-12 Yrs)",
    pillar: 'Bayi & Anak',
    iconBg: '#FCE7F3',
    colorHex: '#DB2777',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Rentang Usia Anak Perempuan',
    variantAttr: 'Paket (Gamis + Hijab Anak)',
    sizes: ['Kids S (2-4 Thn)', 'Kids M (5-7 Thn)', 'Kids L (8-10 Thn)', 'Kids XL (11-12 Thn)'],
    colors: [
      { name: 'Berry Pink', hex: '#EC4899' },
      { name: 'Lilac Blossom', hex: '#D8B4FE' },
    ],
  },
  {
    id: 'Pakaian Bayi',
    slug: 'pakaian-bayi',
    nameId: 'Pakaian Bayi',
    nameEn: 'Baby Apparel & Gift Sets',
    pillar: 'Bayi & Anak',
    iconBg: '#CCFBF1',
    colorHex: '#0D9488',
    iconName: 'Baby',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80',
    measurementLabel: 'Usia Bayi (Bulan) & Berat Badan',
    variantAttr: 'Sertifikasi Katun Organik Hypoallergenic',
    sizes: ['Newborn (0-3 Bln)', '3-6 Bln', '6-12 Bln', '12-24 Bln'],
    colors: [
      { name: 'Mint Soft', hex: '#14B8A6' },
      { name: 'Butter Cream', hex: '#FDE68A' },
    ],
  },
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 1,
    sku: 'RHY-ATM-001',
    name: 'Amira Armani Silk Pleated Tunic',
    category: 'Atasan Muslim Wanita',
    priceIdr: 249000,
    origPriceIdr: 359000,
    discountPct: 31,
    promoBadge: 'SALE -31%',
    isPromoHighlight: true,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740001',
    desc: 'Tunik berbahan Armani Silk premium yang jatuh anggun, adem, tidak menerawang, ramah wudhu dan busui.',
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: 2,
    sku: 'RHY-HJB-002',
    name: 'Signature Ultrafine Voal Monogram Scarf',
    category: 'Hijab',
    priceIdr: 119000,
    origPriceIdr: 165000,
    discountPct: 28,
    promoBadge: 'LIVE DEAL -28%',
    isPromoHighlight: true,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740002',
    desc: 'Hijab segiempat Voal Ultrafine laser-cut dengan monogram Rahayu, tegak paripurna di dahi dan lembut seharian.',
    rating: 5.0,
    reviewCount: 245,
  },
  {
    id: 3,
    sku: 'RHY-BHM-003',
    name: 'Nadine Nursing & Maternity Linen Dress',
    category: 'Baju Hamil',
    priceIdr: 265000,
    origPriceIdr: 340000,
    discountPct: 22,
    promoBadge: 'BUSUI -22%',
    isPromoHighlight: true,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740003',
    desc: 'Dress hamil & menyusui berbahan katun linen breathable dengan ritsleting tersembunyi ganda di dada.',
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: 4,
    sku: 'RHY-CPL-004',
    name: 'High-Waist Tailored Stretch Legging Pants',
    category: 'Celana Panjang & Legging',
    priceIdr: 159000,
    origPriceIdr: 210000,
    discountPct: 24,
    promoBadge: 'PROMO -24%',
    isPromoHighlight: true,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740004',
    desc: 'Celana panjang & legging wanita anti-begah dengan pinggang elastis premium yang menopang tubuh rapi.',
    rating: 4.9,
    reviewCount: 182,
  },
  {
    id: 5,
    sku: 'RHY-BWM-005',
    name: 'Alya Matte Satin Pleated Maxi Skirt',
    category: 'Bawahan Muslim Wanita',
    priceIdr: 189000,
    origPriceIdr: 229000,
    discountPct: 17,
    promoBadge: 'SALE -17%',
    isPromoHighlight: false,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740005',
    desc: 'Bawahan muslim wanita rok plisket lipit rapat berbahan heavy matte satin yang anggun dan flowy.',
    rating: 4.7,
    reviewCount: 65,
  },
  {
    id: 6,
    sku: 'RHY-ATS-006',
    name: 'Minimalist Collar Work Blouse',
    category: 'Atasan',
    priceIdr: 215000,
    origPriceIdr: 215000,
    discountPct: 0,
    promoBadge: 'NEW ARRIVAL',
    isPromoHighlight: false,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740006',
    desc: 'Atasan wanita kemeja kerja bergaya Minimal.id berbahan tencel sejuk dan anti-kusut.',
    rating: 4.8,
    reviewCount: 41,
  },
  {
    id: 7,
    sku: 'RHY-AKM-007',
    name: 'Rahayu Monogram Pearl Brooch Set',
    category: 'Aksesoris Muslim',
    priceIdr: 79000,
    origPriceIdr: 99000,
    discountPct: 20,
    promoBadge: 'BUNDLE -20%',
    isPromoHighlight: false,
    hasVideo: false,
    videoUrl: '',
    desc: 'Set bros monogram Rahayu berlapis emas 18k brass dengan jarum tajam anti-merusak serat voal.',
    rating: 4.9,
    reviewCount: 112,
  },
  {
    id: 8,
    sku: 'RHY-PKD-008',
    name: 'Seamless Bamboo Inner Manset & Ciput',
    category: 'Pakaian Dalam',
    priceIdr: 89000,
    origPriceIdr: 115000,
    discountPct: 23,
    promoBadge: 'SAVE -23%',
    isPromoHighlight: false,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740008',
    desc: 'Pakaian dalam manset & inner berbahan serat bambu antibakteri, dingin, dan menyerap keringat maksimal.',
    rating: 4.9,
    reviewCount: 310,
  },
  {
    id: 9,
    sku: 'RHY-PWL-009',
    name: 'Kira Organza Layered Abaya Outer Set',
    category: 'Pakaian Wanita Lainnya',
    priceIdr: 319000,
    origPriceIdr: 399000,
    discountPct: 20,
    promoBadge: 'EXCLUSIVE -20%',
    isPromoHighlight: false,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740009',
    desc: 'Outerwear abaya kimono beraksen organza mewah untuk momen hari raya maupun formal.',
    rating: 5.0,
    reviewCount: 38,
  },
  {
    id: 10,
    sku: 'RHY-PAP-010',
    name: 'Little Rahayu Ruffle Modest Dress Set',
    category: 'Pakaian Anak Perempuan',
    priceIdr: 175000,
    origPriceIdr: 220000,
    discountPct: 20,
    promoBadge: 'KIDS -20%',
    isPromoHighlight: false,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740010',
    desc: 'Pakaian anak perempuan bahan katun Jepang lembut lengkap dengan hijab instan anak.',
    rating: 4.9,
    reviewCount: 76,
  },
  {
    id: 11,
    sku: 'RHY-PBY-011',
    name: 'Organic Cotton Baby Romper & Bonnet',
    category: 'Pakaian Bayi',
    priceIdr: 129000,
    origPriceIdr: 159000,
    discountPct: 19,
    promoBadge: 'BABY -19%',
    isPromoHighlight: false,
    hasVideo: true,
    videoUrl: 'https://www.tiktok.com/@rahayufashion.store/video/740011',
    desc: 'Pakaian bayi 100% katun organik berstandar OEKO-TEX, lembut untuk kulit bayi baru lahir.',
    rating: 5.0,
    reviewCount: 88,
  },
];

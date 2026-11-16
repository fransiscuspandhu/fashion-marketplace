/**
 * Rahayu Fashion Store Mobile API Client
 * Shared with Next.js App Router Backend Endpoints
 */

const API_BASE_URL = "http://localhost:3000/api";

export interface MobileProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  priceIdr: number;
  origPriceIdr: number;
  discountPct: number;
  promoBadge?: string;
  isPromoHighlight: boolean;
  hasVideo: boolean;
  videoUrl?: string;
  desc: string;
  rating: number;
  reviewCount: number;
  stock: number;
  imageUrl?: string;
}

export interface MobileCategory {
  id: string;
  slug: string;
  nameId: string;
  nameEn: string;
  pillar: string;
  imageUrl?: string;
  sizes: string[];
}

export interface MobileOrder {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  awb?: string;
  courierName: string;
  items: any[];
  timeline: any[];
}

export const mobileApi = {
  async getProducts(category?: string): Promise<MobileProduct[]> {
    try {
      const url = category && category !== "all"
        ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/products`;
      const res = await fetch(url);
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn("Mobile API: failed to fetch products", e);
      return [];
    }
  },

  async getCategories(): Promise<MobileCategory[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const json = await res.json();
      return (json.data || []).map((c: any) => ({
        id: c.id,
        slug: c.slug,
        nameId: c.name,
        nameEn: c.name,
        pillar: c.pillar?.title || "Modest Fashion Wanita",
        imageUrl: c.imageUrl,
        sizes: c.sizes || [],
      }));
    } catch (e) {
      console.warn("Mobile API: failed to fetch categories", e);
      return [];
    }
  },

  async getOrders(): Promise<MobileOrder[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      const json = await res.json();
      return (json.data || []).map((o: any) => ({
        id: o.id,
        createdAt: o.createdAt,
        status: o.status,
        totalAmount: o.totalAmount,
        awb: o.awb,
        courierName: o.courierName,
        items: o.itemsJson || [],
        timeline: o.timelineJson || [],
      }));
    } catch (e) {
      console.warn("Mobile API: failed to fetch orders", e);
      return [];
    }
  },
};

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let config = await prisma.homepageConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      config = await prisma.homepageConfig.findFirst();
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const updateData: any = {};
    if (body.heroBadge !== undefined) updateData.heroBadge = body.heroBadge;
    if (body.heroTitle !== undefined) updateData.heroTitle = body.heroTitle;
    if (body.heroDescription !== undefined) updateData.heroDescription = body.heroDescription;
    if (body.heroCtaText !== undefined) updateData.heroCtaText = body.heroCtaText;
    if (body.heroCtaLink !== undefined) updateData.heroCtaLink = body.heroCtaLink;
    if (body.heroBackgroundImageUrl !== undefined) updateData.heroBackgroundImageUrl = body.heroBackgroundImageUrl;
    if (body.heroOverlayOpacity !== undefined) updateData.heroOverlayOpacity = Number(body.heroOverlayOpacity);
    if (body.categoriesTitle !== undefined) updateData.categoriesTitle = body.categoriesTitle;
    if (body.categoriesSubtitle !== undefined) updateData.categoriesSubtitle = body.categoriesSubtitle;
    if (body.categoriesActive !== undefined) updateData.categoriesActive = Boolean(body.categoriesActive);
    if (body.promoTitle !== undefined) updateData.promoTitle = body.promoTitle;
    if (body.promoBadgeText !== undefined) updateData.promoBadgeText = body.promoBadgeText;
    if (body.promoCountdownHours !== undefined) updateData.promoCountdownHours = body.promoCountdownHours;
    if (body.promoCountdownMins !== undefined) updateData.promoCountdownMins = body.promoCountdownMins;
    if (body.promoCountdownSecs !== undefined) updateData.promoCountdownSecs = body.promoCountdownSecs;
    if (body.promoActive !== undefined) updateData.promoActive = Boolean(body.promoActive);
    if (body.newArrivalsTitle !== undefined) updateData.newArrivalsTitle = body.newArrivalsTitle;
    if (body.newArrivalsSubtitle !== undefined) updateData.newArrivalsSubtitle = body.newArrivalsSubtitle;
    if (body.newArrivalsMax !== undefined) updateData.newArrivalsMax = Number(body.newArrivalsMax);
    if (body.newArrivalsActive !== undefined) updateData.newArrivalsActive = Boolean(body.newArrivalsActive);
    if (body.bestSellersTitle !== undefined) updateData.bestSellersTitle = body.bestSellersTitle;
    if (body.bestSellersSubtitle !== undefined) updateData.bestSellersSubtitle = body.bestSellersSubtitle;
    if (body.bestSellersMax !== undefined) updateData.bestSellersMax = Number(body.bestSellersMax);
    if (body.bestSellersActive !== undefined) updateData.bestSellersActive = Boolean(body.bestSellersActive);
    if (body.uspTitle !== undefined) updateData.uspTitle = body.uspTitle;
    if (body.uspItemsJson !== undefined) updateData.uspItemsJson = body.uspItemsJson;
    if (body.uspActive !== undefined) updateData.uspActive = Boolean(body.uspActive);

    const updated = await prisma.homepageConfig.upsert({
      where: { id: "singleton" },
      update: updateData,
      create: {
        id: "singleton",
        heroBackgroundImageUrl: body.heroBackgroundImageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
        heroDescription: body.heroDescription || "Koleksi busana muslim wanita berkualitas tinggi.",
        uspItemsJson: body.uspItemsJson || [],
        ...updateData,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

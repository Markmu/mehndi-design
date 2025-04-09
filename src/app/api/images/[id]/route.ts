import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { images, imageTags } from "@/db/schema/image";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const imageId = parseInt((await params).id);
    if (isNaN(imageId)) {
      return NextResponse.json({ error: "UNVALID IMAGE" }, { status: 400 });
    }

    await db.transaction(async (tx) => {
      await tx.delete(imageTags).where(eq(imageTags.imageId, imageId));

      await tx.delete(images).where(eq(images.id, imageId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("fail to delete:", error);
    return NextResponse.json({ error: "fail to delete image" }, { status: 500 });
  }
}

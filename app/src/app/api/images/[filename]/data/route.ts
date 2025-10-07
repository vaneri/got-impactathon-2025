import { NextResponse } from "next/server";

export async function GET(_request: Request, context: unknown) {
  try {
    const { params } = context as { params: { filename: string } };
    const filename = params.filename;

    // Find image by filename
    const sql = `SELECT image_data, mime_type FROM images WHERE filename = ?`;
    const { database } = await import("@/lib/database");
    type ImageRow = { image_data: Buffer | Uint8Array; mime_type: string };
    const results = await database.query<ImageRow>(sql, [filename]);

    if (results.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const image = results[0];
    let payload: Uint8Array;
    if (typeof Buffer !== "undefined" && image.image_data instanceof Buffer) {
      payload = new Uint8Array(image.image_data);
    } else {
      payload = image.image_data as Uint8Array;
    }
    const arrayBuffer: ArrayBuffer = (() => {
      const ab = new ArrayBuffer(payload.byteLength);
      const view = new Uint8Array(ab);
      view.set(payload);
      return ab;
    })();

    // Return image as binary data
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": image.mime_type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Get image data error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve image data" },
      { status: 500 }
    );
  }
}

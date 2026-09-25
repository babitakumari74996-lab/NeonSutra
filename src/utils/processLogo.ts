/**
 * Converts an uploaded logo into a small white-on-transparent mask so the
 * NeonPreview can tint it in the chosen neon colour. Also keeps storage
 * usage small (max 320px PNG).
 *
 * Reliability guarantees (logo must never silently vanish after upload):
 * - Decoding is EXIF-aware (`createImageBitmap` with `imageOrientation:
 *   "from-image"`) so phone photos don't end up sideways, with an `<img>`
 *   fallback for older browsers.
 * - Every canvas step is protected: any failure falls back to the original
 *   file (which the browser already proved it can render by decoding it).
 * - Opaque images get background removal via colour distance to the border
 *   background, so thin / light details *inside* the logo survive (a global
 *   luminance threshold wiped those out and the logo looked "not shown").
 * - If the mask would end up effectively empty, the original file is
 *   returned instead of a blank image.
 * - Only genuinely undecodable files reject, so the UI can show an error.
 */
export async function processLogo(file: File): Promise<string> {
  const original = await readFileAsDataURL(file);

  let src: ImageBitmap | HTMLImageElement;
  try {
    src = await decodeImage(file);
  } catch {
    throw new Error("Invalid image");
  }

  try {
    return maskLogo(src, original);
  } finally {
    if (src instanceof ImageBitmap) src.close();
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      // EXIF-aware: phone camera photos keep their upright orientation.
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* try plain decode, then <img> fallback */
    }
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Invalid image"));
      i.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function sourceSize(src: ImageBitmap | HTMLImageElement): { w: number; h: number } {
  if (src instanceof ImageBitmap) return { w: src.width, h: src.height };
  return { w: src.naturalWidth, h: src.naturalHeight };
}

function maskLogo(src: ImageBitmap | HTMLImageElement, original: string): string {
  const { w: w0, h: h0 } = sourceSize(src);
  if (!w0 || !h0) return original;

  const max = 320;
  const k = Math.min(1, max / Math.max(w0, h0));
  const w = Math.max(1, Math.round(w0 * k));
  const h = Math.max(1, Math.round(h0 * k));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx =
    canvas.getContext("2d", { willReadFrequently: true }) ?? canvas.getContext("2d");
  if (!ctx) return original;

  try {
    ctx.drawImage(src, 0, 0, w, h);
  } catch {
    return original;
  }

  let data: ImageData;
  try {
    data = ctx.getImageData(0, 0, w, h);
  } catch {
    return original;
  }
  const px = data.data;

  let hasTransparency = false;
  for (let i = 3; i < px.length; i += 4) {
    if (px[i] < 245) {
      hasTransparency = true;
      break;
    }
  }

  if (hasTransparency) {
    // Already has an alpha channel (e.g. transparent PNG/SVG): keep the
    // shape exactly, just whiten it for the neon tint filter.
    let kept = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] > 8) kept++;
      px[i] = 255;
      px[i + 1] = 255;
      px[i + 2] = 255;
    }
    if (kept === 0) return original;
  } else {
    // Opaque image (JPG / flat PNG): alpha comes from colour distance to the
    // border background. Unlike a global luminance threshold, this keeps
    // thin / light interior details at full strength while the background
    // itself goes fully transparent. Falls back to the legacy global
    // threshold for photo-like images, and to the original file when the
    // mask would otherwise be blank.
    const kept = distanceMask(px, w, h);
    if (kept === 0) {
      const legacyKept = legacyLuminanceMask(px, w, h);
      if (legacyKept === 0) return original;
    }
  }

  ctx.putImageData(data, 0, 0);
  try {
    return canvas.toDataURL("image/png");
  } catch {
    return original;
  }
}

/**
 * Alpha from colour distance to the border background: background pixels go
 * fully transparent, logo pixels (even thin, light ones) stay fully opaque,
 * with a short ramp for smooth anti-aliased edges. Returns the number of
 * kept pixels, or 0 when this strategy doesn't apply (photo-like borders) or
 * nothing would remain — the caller then falls back further.
 */
function distanceMask(px: Uint8ClampedArray, w: number, h: number): number {
  const at = (x: number, y: number) => (y * w + x) * 4;

  // Sample the border (corners + edge midpoints) as the background colour.
  const pts: Array<[number, number]> = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [w >> 1, 0],
    [w >> 1, h - 1],
    [0, h >> 1],
    [w - 1, h >> 1],
  ];
  let br = 0;
  let bg = 0;
  let bb = 0;
  const samples: Array<[number, number, number]> = [];
  for (const [x, y] of pts) {
    const o = at(x, y);
    samples.push([px[o], px[o + 1], px[o + 2]]);
    br += px[o];
    bg += px[o + 1];
    bb += px[o + 2];
  }
  br /= samples.length;
  bg /= samples.length;
  bb /= samples.length;

  let variance = 0;
  for (const [r, g, b] of samples) {
    variance = Math.max(variance, Math.abs(r - br) + Math.abs(g - bg) + Math.abs(b - bb));
  }
  if (variance > 210) return 0; // not a flat-background logo → legacy mode

  // Adaptive ramp: fully transparent below the border noise floor, fully
  // opaque a little above it, smooth in between.
  const low = Math.min(60, Math.max(18, variance * 0.5));
  const high = low + 80;

  let kept = 0;
  for (let i = 0; i < px.length; i += 4) {
    const dr = px[i] - br;
    const dg = px[i + 1] - bg;
    const db = px[i + 2] - bb;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    let a: number;
    if (dist <= low) a = 0;
    else if (dist >= high) a = 255;
    else a = ((dist - low) / (high - low)) * 255;
    if (a > 8) kept++;
    px[i] = 255;
    px[i + 1] = 255;
    px[i + 2] = 255;
    px[i + 3] = a;
  }
  // Require at least a speck of content, otherwise let the caller fall back.
  if (kept < Math.max(8, w * h * 0.0005)) return 0;
  return kept;
}

/**
 * Legacy global luminance mask, kept for photo-like images where the
 * distance mask doesn't apply. Returns the number of kept pixels.
 */
function legacyLuminanceMask(px: Uint8ClampedArray, w: number, h: number): number {
  const lumAt = (i: number) => (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
  let borderLum = 0;
  let borderCount = 0;
  for (let x = 0; x < w; x++) {
    borderLum += lumAt((0 * w + x) * 4) + lumAt(((h - 1) * w + x) * 4);
    borderCount += 2;
  }
  const lightBackground = borderLum / borderCount > 0.5;

  let kept = 0;
  for (let i = 0; i < px.length; i += 4) {
    let a: number;
    const l = lumAt(i);
    const v = lightBackground ? 1 - l : l;
    a = Math.max(0, Math.min(255, (v - 0.12) * 1.6 * 255));
    if (a > 8) kept++;
    px[i] = 255;
    px[i + 1] = 255;
    px[i + 2] = 255;
    px[i + 3] = a;
  }
  return kept;
}

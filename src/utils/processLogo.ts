/**
 * Converts an uploaded logo into a small white-on-transparent mask so the
 * NeonPreview can tint it in the chosen neon colour. Also keeps localStorage
 * usage small (max 320px PNG).
 */
export async function processLogo(file: File): Promise<string> {
  const original = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Invalid image"));
    i.src = original;
  });

  const max = 320;
  const w0 = img.naturalWidth || 320;
  const h0 = img.naturalHeight || 320;
  const k = Math.min(1, max / Math.max(w0, h0));
  const w = Math.max(1, Math.round(w0 * k));
  const h = Math.max(1, Math.round(h0 * k));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, w, h);

  let data: ImageData;
  try {
    data = ctx.getImageData(0, 0, w, h);
  } catch {
    return original;
  }
  const px = data.data;

  let transparent = false;
  for (let i = 3; i < px.length; i += 4) {
    if (px[i] < 245) {
      transparent = true;
      break;
    }
  }

  // Average luminance of the border decides whether the logo is dark-on-light or light-on-dark.
  let borderLum = 0;
  let borderCount = 0;
  const lumAt = (i: number) => (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
  for (let x = 0; x < w; x++) {
    borderLum += lumAt((0 * w + x) * 4) + lumAt(((h - 1) * w + x) * 4);
    borderCount += 2;
  }
  const lightBackground = borderLum / borderCount > 0.5;

  for (let i = 0; i < px.length; i += 4) {
    let a: number;
    if (transparent) {
      a = px[i + 3];
    } else {
      const l = lumAt(i);
      const v = lightBackground ? 1 - l : l;
      a = Math.max(0, Math.min(255, (v - 0.12) * 1.6 * 255));
    }
    px[i] = 255;
    px[i + 1] = 255;
    px[i + 2] = 255;
    px[i + 3] = a;
  }
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL("image/png");
}

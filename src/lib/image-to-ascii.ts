import sharp from 'sharp';

const columns = 40;
const rows = 20;
const cellWidth = 8;
const cellHeight = 16;
const size = columns * cellWidth;
const ramp = ' .:-=+*#%@';

/** Build-time conversion. The HTML contains text and needs no browser image processing. */
export async function imageToAscii(image: Buffer) {
  const source = sharp(image, { density: 144 });
  const metadata = await source.metadata();
  const { data, info } = await source
    .rotate()
    .resize(size, size, { fit: 'inside' })
    .toColourspace('srgb')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const transparent = metadata.format === 'svg' || data.some((value, index) => index % 4 === 3 && value < 255);
  const luminance = (offset: number) =>
    (data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722) / 255;
  const corners = [0, (info.width - 1) * 4, (info.height - 1) * info.width * 4, data.length - 4];
  const lightBackground = corners.reduce((sum, offset) => sum + luminance(offset), 0) / corners.length > 0.5;
  const left = Math.floor((size - info.width) / 2);
  const top = Math.floor((size - info.height) / 2);
  const lines = [];
  let weight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;

  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let column = 0; column < columns; column++) {
      let coverage = 0;
      for (let y = 0; y < cellHeight; y++) {
        for (let x = 0; x < cellWidth; x++) {
          const sourceX = column * cellWidth + x - left;
          const sourceY = row * cellHeight + y - top;
          if (sourceX < 0 || sourceX >= info.width || sourceY < 0 || sourceY >= info.height) continue;
          const offset = (sourceY * info.width + sourceX) * 4;
          // Transparency preserves solid marks of any color. Opaque images use contrast against their background.
          const density = transparent
            ? data[offset + 3] / 255
            : lightBackground
              ? 1 - luminance(offset)
              : luminance(offset);
          coverage += density;
          weight += density;
          red += data[offset] * density;
          green += data[offset + 1] * density;
          blue += data[offset + 2] * density;
        }
      }
      line += ramp[Math.round((coverage / (cellWidth * cellHeight)) * (ramp.length - 1))];
    }
    lines.push(line.trimEnd());
  }

  const rgb = weight > 0 ? [red, green, blue].map((channel) => Math.round(channel / weight)) : [0, 0, 0];
  // Neutral logos inherit the technology's theme color; colored covers keep their own ink.
  const color = Math.max(...rgb) - Math.min(...rgb) > 24 ? `rgb(${rgb.join(' ')})` : undefined;
  return { ascii: lines.join('\n'), color };
}

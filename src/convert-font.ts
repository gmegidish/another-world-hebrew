import assert = require("assert");

const fs = require("fs");
const PNG = require("pngjs").PNG;
const YAML = require('yaml');

const data = fs.readFileSync('hebrew-font.png');
const png = PNG.sync.read(data);

const letters_in_font =
	" !\"#$%&'()*+,-./" +
	"0123456789:;<=>?" +
	"@ABCDEFGHIJKLMNO" +
	"PQRSTUVWXYZ[\\]^_" +
	"אבגדהוזחטיךכלםמן" +
	"נסעףפץצקרשת" +
	"{|}~";

const generate_pixel_at = (x: number, y: number) => {
	return `\tspr     45296   ${x}     ${y}     1`;
};

const draw_character = (c: number, x: number, y: number) => {

	let cx = c * 7;
	let cy = 128 - 6 * 8;
	while (cx >= 112) {
		cx -= 112;
		cy += 8;
	}

	for (let _y = 0; _y < 8; _y++) {
		for (let _x = 0; _x < 7; _x++) {
			const offset = (png.width * (cy + _y) + cx + _x) * 4;
			const pixel = png.data[offset];
			if (pixel === 0) {
				console.log(generate_pixel_at(x + _x, y + _y));
			}
		}
	}
};

// read yaml
const yml = YAML.parse(fs.readFileSync("translation-hebrew.yaml", "utf8"));

const items = yml["items"];
for (const item of items) {
	const position = item["position"].split(",");
	const x0 = parseInt(position[0]);
	const y0 = parseInt(position[1]);
	let x = x0;
	let y = y0;
	console.log(item["function"] + ":\t\t\t// \"" + item["original"].replaceAll("\n", " ") + "\"");
	const text = item["translated"];
	const direction = item["direction"];
	assert(direction === "rtl" || direction === "ltr");
	const xstep = (direction === "ltr" ? 7 : -7);
	for (let i = 0; i < text.length; i++) {
		const c = text.charAt(i);
		if (c === "\n") {
			x = x0;
			y += 10;
			continue;
		}

		const p = letters_in_font.indexOf(c);
		if (p >= 0) {
			draw_character(p, x, y);
			x += xstep;
		}
	}

	console.log("\treturn");
	console.log("");
}

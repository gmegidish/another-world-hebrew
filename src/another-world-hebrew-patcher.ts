import assert = require("assert");

import fs = require("fs");
import YAML = require('yaml');

import {PNGWithMetadata, PNG} from "pngjs";

export class AnotherWorldHebrewPatcher {

	private letters_in_font =
		" !\"#$%&'()*+,-./" +
		"0123456789:;<=>?" +
		"@ABCDEFGHIJKLMNO" +
		"PQRSTUVWXYZ[\\]^_" +
		"אבגדהוזחטיךכלםמן" +
		"נסעףפץצקרשת" +
		"{|}~";

	private generatePixelAt(x: number, y: number): string {
		return `\tspr     45296   ${x}     ${y}     1`;
	}

	private drawCharacter(png: PNGWithMetadata, c: number, x: number, y: number): string {

		let cx = c * 7;
		let cy = 128 - 6 * 8;
		while (cx >= 112) {
			cx -= 112;
			cy += 8;
		}

		let output = "";
		for (let _y = 0; _y < 8; _y++) {
			for (let _x = 0; _x < 7; _x++) {
				const offset = (png.width * (cy + _y) + cx + _x) * 4;
				const pixel = png.data[offset];
				if (pixel === 0) {
					output += this.generatePixelAt(x + _x, y + _y) + "\n";
				}
			}
		}

		return output;
	}

	private patch() {
		const data = fs.readFileSync(__dirname + '/hebrew-font.png');
		const png = PNG.sync.read(data);
		const yml = YAML.parse(fs.readFileSync(__dirname + "/hebrew.yaml", "utf8"));

		let output = "";

		const items = yml["items"];
		for (const item of items) {
			const position = item["position"].split(",");
			const x0 = parseInt(position[0]);
			const y0 = parseInt(position[1]);
			let x = x0;
			let y = y0;
			output += (item["function"] + ":\t\t\t// \"" + item["original"].replaceAll("\n", " ") + "\"\n");
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

				const p = this.letters_in_font.indexOf(c);
				if (p >= 0) {
					output += this.drawCharacter(png, p, x, y);
					x += xstep;
				}
			}

			output += "\treturn\n";
			output += "\n";
		}

		console.log(output);
	}

	public static main() {
		const ref = new AnotherWorldHebrewPatcher();
		ref.patch();
	}
}

AnotherWorldHebrewPatcher.main();

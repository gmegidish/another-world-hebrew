# Another World - Hebrew Translation Project

This is a fan project to translate the game **Another World** (Out of This World, Outer World) into Hebrew.

### How does it look? 👀

![image](website/logos.gif)
![image](website/intro.gif)

### Introduction 🎁

Another World means a lot to many people. Some of us have been obsessed with this game since it
was released in the 1991.

There are plenty of fandom sites regarding Another World, and every fan will tell you a different story of how
much this games means to them. I would like to share my story here.

I've been crazy about this game. I remember the first time I jumped on that rope and kicked
an alien where it hurts.

In 2003, I discovered the 3DO version of the game. It featured 16-bit scanned background graphics,
incredible music and stunning sound effects. I was blown away. I started reverse-engineering that version, in hopes
to be releasing this for the Gameboy Advance. Having contributed to  [KOS](https://github.com/KallistiOS/KallistiOS) (
pronounced Chaos), I figured I'll be able to make the CD version fit in a 16MB cartridge.

I was able to complete the task and was talking about this over IRC. A friend of mine, did 1+1, and told me that
there's another person, Cyx, who was working on rewriting the DOS version of AW. I wasted no time and pinged him.

Even back then, Cyx had an *amazing* record for reverse-engineering games and was part of ScummVM. He taught me new
tricks in IDA. I was so thrilled. Reverse-engineering is in itself a game.

Cyx told me that Eric Chahi contacted him and requested that he stopped working on the project. This was because
Eric was working on a 15th Anniversary version of the game. I immediately contacted Eric and told him about my port.
And like with Cyx, he requested the same from me. I also learned about a 3rd person rewriting the
game, [Foxy](http://www.foxysofts.com/index.php?l=content/gba/anworld.inc).

While Eric allowed Foxy to keep his release, my version never saw the light of day.

The 3DO version of the game was done without Eric. Same goes for the
sequel, [Heart of The Alien](https://www.mobygames.com/game/8140/heart-of-the-alien-out-of-this-world-parts-i-and-ii/).

Throughout the years since 2003, the game has been ported to every new platform imaginable, including the PS4 and
Switch. [Vinyl records](https://blackscreenrecords.com/products/another-world?variant=43865193971978) of the soundtrack
have been released, and two anniversary editions were published: 15th and 20th.

In 2006, as I was making plans for the summer holiday season, I contacted Eric and asked if it's possible to meet him.
And so I did. We met for dinner, at sushi place he picked. He was very kind and humble.

I never got to release my gba port, but at least got to have dinner. Unfortunately I
was so starstruck that I forgot to ask for a picture :facepalm:.

Here are some of my projects related to Another World:

- Another World Hebrew (2024)
    - Hebrew translation of the introduction of the game.
- Another World Swiss Army Knife (2024)
    - Tool for manipulating resources, such as game code.
- AWJS (2009)
    - An HTML5 implementation of Another
      World [src](https://github.com/gmegidish/awjs), [chrome experiments](https://experiments.withgoogle.com/another-world-js)
- AWPSP (2006)
    - A port of *Another World* to the PSP, created the day the homebrew SDK was available
      [pic1](https://www.flickr.com/photos/gawd0r/197508197/), [pic2](https://www.flickr.com/photos/gawd0r/197508195/)
- Heart of The Alien Redux (2005)
    - Remake of the sequel to *Another World* [website](https://hota.sf.net/)

### Technical Details 🤓

Throughout the game there are only a few strings. All of them are stored within the main executable file, `ANOTHER.EXE`.

There were two ways of translating the game:

1. Patch the executable file, change the strings, add new font.
2. Patch the animation file, render the new font by reusing shapes available.

I chose the second option, because this allows translations to other languages and portability with other platforms. You
are no longer bound by the sizes of the strings within the .exe. Furthermore, just run the patch on a different
version, and it should work just fine. Although some versions have additional opcodes that are not covered by Another
World Swiss Army Knife.

### Hebrew Font אַ

For the Hebrew font, I chose to use the font that I dumped from my Apple IIe computer. It's a 6x8 font, and it looks
great in the game. Any
font of any size would work fine.

Here is the entire font from the Apple IIe rom dump:

![image](src/hebrew-font.png)

Alternatively, I could have picked the VGA Hebrew font which would be as symbolic as this one.

### Introduction Files

Introduction for Another World is split into 3 files: a palette file, a code file, and a shapes file.

```text
 2048 resources/0017.pal
 9871 resources/0018.txt
65230 resources/0019.shp
```

So is every level in the game. You can read more about the resources in the game
at [Fabien's Another World](https://fabiensanglard.net/another_world_polygons/index.html)
technical document.

### Implementation Details

Adding each letter of the new font into the shapes file and using the code file to render the text seemed logical.
However, with only 305 bytes left
within the 64KB limit, I opted for a creative alternative.

Each shape in the shapes file can be rendered with a zoom factor (scale), you can scale down to 1/64 or scale up to x4.
I tracked down a simple shape
at offset 45296 that when scaled down to 1/64th, it renders a single pixel.

A small TypeScript program processes a YAML file of required translations and patches the code file to render a sprite
for each pixel in the font. For example,
the text "HELLO" would generate up to 6 * (6*8) = 288 calls to the `spr` opcode.

Here is a snippet of the code that draws "Good evening professor." (in Hebrew, of course):

```text
draw_good_evening_professor:			// "Good evening professor."
	spr     45296   291     171     1
	spr     45296   292     171     1
	spr     45296   294     171     1
	spr     45296   295     171     1
	spr     45296   292     172     1
	spr     45296   295     172     1
	spr     45296   293     173     1
	spr     45296   295     173     1
	spr     45296   293     174     1
	spr     45296   295     174     1
	spr     45296   293     175     1
	spr     45296   294     175     1
	spr     45296   291     176     1
	spr     45296   292     176     1
	spr     45296   293     176     1
	spr     45296   284     171     1
	spr     45296   285     171     1
	spr     45296   286     171     1
	spr     45296   287     171     1
```

Each non-transparent pixel in the font yields an `spr` opcode with 1/64 scale. Since this adds many opcodes, the
resulting code file is larger:

```text
46904 resources/0018.txt
```

Still below 64kb, so we're good 😎

### Links ⛓️

- Eric Chahi's technical document of Another World's opcodes [link](https://anotherworld.fr/another_world.htm)
- Fabien Sanglard's 8-part technical document of Another
  World [link](https://fabiensanglard.net/another_world_polygons/index.html)
- Cyx's reverse-engineered Another World on all of its versions [link](https://github.com/cyxx/rawgl)
- Another World on Eric Chahi's website [link](https://anotherworld.fr/another_world.htm)

### License 🖖

This project is licensed under the GPL 3 License - see the [LICENSE.md](LICENSE.md) file for details

### Credits 🫡

Introduction title graphics in Hebrew done by the brilliant Niv Baehr [github](https://github.com/blooperz) 🙏

### Contact

You may contact me at **gil** at **megidish** dot **net**. 

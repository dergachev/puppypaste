# PuppyPaste

Extract HTML clipboard contents without losing the structure, as you'd get from pasting into TextEdit or Notepad.

Uses the <a href="https://github.com/neocotic/html.md">html.md</a> package by @neocotic to convert HTML to markdown.

## Textile

Textile parsing is a totally hacky experiment of porting html.md lib into textile. It's only included for demo purposes (and cause it's useful to me).
DO NOT RELY ON IT BEING CORRECT!

TODOs:

* Image links, like <a href="bob.com"><img src="bob.jpg"/></a> (DONE?)
* PRE/code, relative links, special chars, quotes, asterisks, line breaks, block quotes, table
* footnotes, strikethough, underline.

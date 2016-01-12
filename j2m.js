// extracted from https://github.com/kylefarris/J2M/blob/master/index.js

function md2jira(md_str) {
    var map = {
      cite: '??',
      del: '-',
      ins: '+',
      sup: '^',
      sub: '~'
    };

    return md_str
        // Bold, Italic, and Combined (bold+italic)
        .replace(/([*_]+)(\S.*?)\1/g, function (match,wrapper,content) {
            switch (wrapper.length) {
                case 1: return '_' + content + '_';
                case 2: return '*' + content + '*';
                case 3: return '_*' + content + '*_';
                default: return wrapper + content * wrapper;
            }
         })
         // All Headers (# format)
         .replace(/^([#]+)(.*?)$/gm, function (match,level,content) {
             return 'h' + level.length + '.' + content;
         })
         // Headers (H1 and H2 underlines)
         .replace(/^(.*?)\n([=-]+)$/gm, function (match,content,level) {
             return 'h' + (level[0] === '=' ? 1 : 2) + '. ' + content
         })
        // Ordered lists
        .replace(/^([ \t]*)\d+\.\s+/gm, function(match, spaces) {
            return Array(spaces.length + 1).join("#") + '# ';
        })
        // Un-Ordered Lists
        .replace(/^([ \t]*)\*\s+/gm, function(match, spaces) {
            return Array(spaces.length + 1).join("*") + '* ';
        })
        // Headers (h1 or h2) (lines "underlined" by ---- or =====)
        // Citations, Inserts, Subscripts, Superscripts, and Strikethroughs
        .replace(new RegExp('<(' + Object.keys(map).join('|') + ')>(.*?)<\/\\1>', 'g'), function (match,from,content) {
            var to = map[from];
            return to + content + to;
        })
        // Other kind of strikethrough
        .replace(/~~(.*?)~~/g, '-$1-')
        // Named/Un-Named Code Block
        .replace(/`{3,}(\w+)?((?:\n|[^`])+)`{3,}/g, function(match, synt, content) {
            var code = '{code';
            if (synt) code += ':' + synt;
            return code + '}' + content + '{code}';
        })
        // Inline-Preformatted Text
        .replace(/`([^`]+)`/g, '{{$1}}')
        // Named Link
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1|$2]')
        // Un-Named Link
        .replace(/<([^>]+)>/g, '[$1]')
        // Single Paragraph Blockquote
        .replace(/^>/gm, 'bq.');
}

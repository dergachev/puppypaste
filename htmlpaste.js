// contenteditable selectText function; via http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
jQuery.fn.selectText = function(){
   var doc = document;
   var element = this[0];
   if (doc.body.createTextRange) {
       var range = document.body.createTextRange();
       range.moveToElementText(element);
       range.select();
   } else if (window.getSelection) {
       var selection = window.getSelection();
       var range = document.createRange();
       range.selectNodeContents(element);
       selection.removeAllRanges();
       selection.addRange(range);
   }
};

// shim to make j2m.js (and other npm libs) not crash
function require(str) {
  return window[str];
}

(function () {

  var input, output;

  function updateOutput() {
    var html = input.data('redactor').getCode();
    var outData = getSelectedType().converter(html);
    output.val(outData);
  }

  function updateOutputUI(type) {
    $('#output-header a').removeClass('active');
    $(type.buttonSelector).addClass('active');

    $('#output-container .output-toolbar').removeClass('active');
    $(type.toolbarSelector).addClass('active');
  }

  function setSelectedType(type) {
    window.localStorage.setItem("selectedType", type);
  }

  function getSelectedType() {
    // By default it's set to markdown.
    var typeKey = window.localStorage.getItem("selectedType") || "markdown";
    return types[typeKey];
  }

  // Work-around bug in md.html markdown converter,
  // which ignores that in HTML \n is just a space.
  function fixExtraSpaces(html) {
    return html.replace(/[\n ]+/g, " ");
  }

  function toMarkdown(html) {
    html = fixExtraSpaces(html);
    return md(html, {'absolute': true, 'inline': true});
  }

  function toHTML(html) {
    if (jQuery('#setting-html-tidy').prop('checked')) {
      var mdText = toMarkdown(html);
      return markdown.toHTML(mdText);
    }
    return html;
  }

  function toTextile(html) {
    html = fixExtraSpaces(html);
    return textile(html, {'absolute': true, 'inline': true});
  }

  function toJira(html) {
    var mdText = toMarkdown(html);
    return J2M.prototype.to_jira(mdText);
  }

  var types = {
    'markdown': {
      'converter': toMarkdown,
      'buttonSelector': '#output-header-markdown',
      'toolbarSelector': '#output-toolbar-markdown',
    },
    'html': {
      'converter': toHTML,
      'buttonSelector': '#output-header-html',
      'toolbarSelector': '#output-toolbar-html',
    },
    'textile': {
      'converter': toTextile,
      'buttonSelector': '#output-header-textile',
      'toolbarSelector': '#output-toolbar-textile',
    },
    'jira': {
      'converter': toJira,
      'buttonSelector': '#output-header-jira',
      'toolbarSelector': '#output-toolbar-jira',
    }
  }

  jQuery(function($) {

    // initialize on load
    input = jQuery('#input');
    output = jQuery('#output');

    // Copy Paste setup
  var a = new Clipboard('.copy-clipboard');


    input.redactor({
      keyupCallback: updateOutput,
      execCommandCallback: updateOutput,
    });

    updateOutput();
    updateOutputUI(getSelectedType());

    var setClick = function(typeKey) {
      var type = types[typeKey];
      $('#output-header').on('click', type.buttonSelector, function() {
        setSelectedType(typeKey);
        updateOutput();
        updateOutputUI(type);
        return false;
      });
    }

    // associate click handler with all buttons for each type
    jQuery.each(types, function( typeKey, type ) {
      if (type.buttonSelector) {
        setClick(typeKey);
      }
    });

    $('#setting-html-tidy').change(function() {
      updateOutput();
    });

    // focus select all
    $('#output').focus(function() {
      var $this = $(this);
      $this.select();

      // Work around Chrome's little problem
      $this.mouseup(function() {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
      });
    })
  });


})();

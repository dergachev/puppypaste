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
  var input, output, gfm;

  function updateOutput() {
    output.value = selectedType.converter(input.innerHTML);
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    input = document.getElementById('input');
    output = document.getElementById('output');
    // gfm = document.getElementById('gfm');

    input.addEventListener('input', updateOutput, false);
    input.addEventListener('keydown', updateOutput, false);

    // gfm.addEventListener('change', updateOutput, false);

    updateOutput();
  });

  var types = {
    'markdown': {
      'converter': function(text) { return md(text, {'absolute': true, 'inline': true}); },
      'buttonSelector': '#output-header-markdown',
    },
    'htmlclean': {
      'converter': function(text) { return markdown.toHTML(md(text, {'absolute': true, 'inline': true})); },
      'buttonSelector': '#output-header-htmlclean',
    },
    'html': {
      'converter': function(text) { return text; },
      'buttonSelector': '#output-header-html',
    },
    'textile': {
      'converter': function(text) { return textile(text, {'absolute': true, 'inline': true}); },
      'buttonSelector': '#output-header-textile',
    },
    'jira': {
      'converter': function(text) { return J2M.prototype.to_jira(md(text, {'absolute': true, 'inline': true})); },
      'buttonSelector': '#output-header-jira',
    }
  }

  // By default it's set to markdown.
  var selectedType = types.markdown;

  jQuery(function($) {

    var setClick = function(type) {
      $('#output-header').on('click', type.buttonSelector, function() {
        $('#output-header a').removeClass('active');
        $(type.buttonSelector).addClass('active');
        selectedType = type;
        updateOutput();
        return false;
      });
    }


    setClick(types.html);
    setClick(types.htmlclean);
    setClick(types.markdown);
    setClick(types.textile);
    setClick(types.jira);

    // focus select all
    $('#input').focus(function() {
      $(this).selectText();
    })
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

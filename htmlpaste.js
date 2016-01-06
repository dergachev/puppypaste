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
      'converter': function(text) { return md(text); },
      'label': '<b>Markdown</b> or <a id="output-header-html" href="#">HTML</a> or <a id="output-header-textile" href="#">Textile</a>'
    },
    'html': {
      'converter': function(text) { return text; },
      'label': '<a id="output-header-markdown" href="#">Markdown</a> or <b>HTML</b> or <a id="output-header-textile" href="#">Textile</a>'
    },
    'textile': {
      'converter': function(text) { return "TEXTILE CONVERTER COMING SOON"; },
      'label': '<a id="output-header-markdown" href="#">Markdown</a> or <a id="output-header-html" href="#">HTML</a> or <b>Textile</b>'
    }
  }

  var selectedType = types.markdown;

  jQuery(function($) {
    $('#output-header').on('click', '#output-header-html', function() {
      $('#output-header').html(types.html.label);
      selectedType = types.html;
      updateOutput();
    });
    $('#output-header').on('click', '#output-header-markdown', function() {
      $('#output-header').html(types.markdown.label);
      selectedType = types.markdown;
      updateOutput();
    });
    $('#output-header').on('click', '#output-header-textile', function() {
      $('#output-header').html(types.textile.label);
      selectedType = types.textile;
      updateOutput();
    });

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

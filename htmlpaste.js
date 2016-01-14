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
    output.value = getSelectedType().converter(input.innerHTML);
  }

  function updateButtons(type) {
    $('#output-header a').removeClass('active');
    $(type.buttonSelector).addClass('active');
  }

  function setSelectedType(type) {
    window.localStorage.setItem("selectedType", type);
  }

  function getSelectedType() {
    // By default it's set to markdown.
    var typeKey = window.localStorage.getItem("selectedType") || "markdown";
    return types[typeKey];
  }

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

  jQuery(function($) {
    
    // initialize on load
    input = jQuery('#input');
    output = jQuery('#output');

    updateOutput();
    updateButtons(getSelectedType());

    input.on('input', updateOutput);
    output.on('keydown', updateOutput);

    var setClick = function(typeKey) {
      var type = types[typeKey];
      $('#output-header').on('click', type.buttonSelector, function() {
        setSelectedType(typeKey);
        updateOutput();
        updateButtons(type);
        return false;
      });
    }

    // associate click handler with all buttons for each type
    jQuery.each(types, function( typeKey, type ) {
      if (type.buttonSelector) {
        setClick(typeKey);
      }
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

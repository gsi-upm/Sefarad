(function ($) {

AjaxSolr.SirenTextWidget = AjaxSolr.AbstractTextWidget.extend({
  
  name:null,
  
  init: function () {
    var self = this;
    $(this.target).html(
        '<label>'+this.name+'</label>'+
        '<textarea type="text" name="text"></textarea>');
    
    $(this.target).find('textarea,input').bind('keydown', function(e) {
      if (e.which == 13) {
        var value = $(this).val();
        
        self.manager.checkForEmptyQuery(value);
        
        if (value && self.set( value.replace(/^\s+|\s+$/g, '') )){
          self.manager.doRequest(0);
        }
      }
    });
  },

  afterRequest: function () {
    var value = "";
    if( this.manager.store.get("q")){
      value = this.manager.store.get("q").value;
    }
    $(this.target).find('textarea,input').val(value).keydown();  // keydown is to trigger the resize of textarea
                                                                 // if jquery.autogrow-textarea.js is used 
  }

});

})(jQuery);

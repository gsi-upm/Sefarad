(function ($) {

AjaxSolr.SirenResultCountWidget = AjaxSolr.AbstractWidget.extend({
  
    name:null,
  
    init:function(){
      $(this.target).html(this.name+ ': <span/>');
    },
    
    beforeRequest: function () {
	    $(this.target+" span").html('<span class="ajax-indicator" />');
    },

    afterRequest: function () {
      $(this.target+" span").empty().text(this.manager.response.response.numFound);
    }

});

})(jQuery);
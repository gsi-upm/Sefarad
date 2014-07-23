(function ($) {

AjaxSolr.SirenResultsWidget = AjaxSolr.AbstractWidget.extend({
  
  beforeRequest: function () {
    $(this.target).html('<span class="ajax-indicator" />');
  },

    afterRequest: function () {
	  var self = this;
	  $(this.target).empty();
	
	  for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
			      var doc = this.manager.response.response.docs[i];
			      
			      //here select entity handler
			      var selectEntityHandler = function(id){
			          if(self.set(id)){
			              self.manager.doRequest(0);
			          }
			      };
			      
			      // check that the template exists
			      // and if yes - use it
			      var template = null;
			      var templateSource = null;
			      if($("#document_template").size()==1){
			    	  templateSource = $("#document_template").html();
			      }
			      
			      if(templateSource != null){
			    	  template = Handlebars.compile(templateSource);
			      }
			      $(this.target).append(AjaxSolr.theme('result', doc, selectEntityHandler, template));
			      
			      // check that there is any custom javascript function to execute
			      // and if yes execute it
			      if(document["document_function"]){
			    	  document["document_function"](doc);
			      }
	  }
	  
	  if(hljs){
	    hljs.initHighlighting.called = false;
	    hljs.initHighlighting();
	  }
  }

});

})(jQuery);
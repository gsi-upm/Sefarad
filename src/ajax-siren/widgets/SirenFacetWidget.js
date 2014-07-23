(function($) {

  AjaxSolr.SirenFacetWidget = AjaxSolr.SirenAbstractFacetWidget.extend({
    
    limit: 11,
    
    afterRequest : function() {
      var self=this;
      if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
        $(this.target).html(AjaxSolr.theme('loading_items'));
        return;
      }

      var maxCount = 0;
      var objectedItems = [];
      
      for ( var i=0;i< this.manager.response.facet_counts.facet_fields[this.field].length;i+=2) {
    	  
    	  
    	  var facet_value = this.manager.response.facet_counts.facet_fields[this.field][i];
    	  var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][i+1]);
    	  
    	  if (count > maxCount) {
              maxCount = count;
          }
          
    	  var clickValue = pathToJson(this.field, facet_value);
    	  
    	  if(count>0){
        	  objectedItems.push({
                  value : facet_value,
                  count : count,
                  handler : this.clickHandler(clickValue)
              });
    	  }
      }    
      
      objectedItems.sort(function(a, b) {
        return a.count > b.count ? -1 : 1;
      });
      // here check how many items is there 
      var objectedItemsLength = objectedItems.length; 
      
      if(objectedItemsLength==this.limit){
    	  objectedItems.pop();
      }
      
      $(this.target).empty();
      $(this.target).append(AjaxSolr.theme('facet2', objectedItems));
      if(objectedItemsLength == this.limit){
    	  $(this.target).append('<a class="show_more" href="#">show more</a>');
    	  $(this.target).find("a.show_more").click(function(e){
    		  e.preventDefault();
    		  $(this).addClass("ajax-indicator");
    		  self.changeLimit(self.limit + 10);
    	  });
      }
    },

    changeLimit : function(limit) {
      var self = this;
      self.limit = limit;
      self.manager.store.addByValue('f.' + self.field + '.facet.limit',limit);
      self.manager.doRequest(undefined,undefined,[self.target.replace("#","")]);
    }
  });

})(jQuery);
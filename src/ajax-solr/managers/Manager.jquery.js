// $Id$

/**
 * @see http://wiki.apache.org/solr/SolJSON#JSON_specific_parameters
 * @class Manager
 * @augments AjaxSolr.AbstractManager
 */
AjaxSolr.Manager = AjaxSolr.AbstractManager.extend(
  /** @lends AjaxSolr.Manager.prototype */
  {
   
	// this method return a array of class ids for which 
	// isEmpty:false should be set in the query because 
	// a specific relation has been marked by user as required  
    getRequiredRelations: function(){
	  var relations =[];
   	  var _rs = this.store.get("_r");
   	  for(var i=0;i<_rs.length;i++){
   		if(_rs[i] && _rs[i].value != null){
   			var a = _rs[i].value.split("->");
   			if(relations.indexOf(a[0]) == -1){
   				relations.push(a[0]);
   			}
   			if(relations.indexOf(a[1]) == -1){
   				relations.push(a[1]);
   			}
   		}
   	  }
   	  return relations;
   },
	  
   executeRequest: function (servlet, string, handler) {
    
	// here add isEmpty 
	var requiredRelations = this.getRequiredRelations();
	var focused = this.store.get("ff").value;
	for(var c in this.classes){
		if(c != focused && requiredRelations.indexOf(c) != -1){ //add another condition to avoid unnecessary isEmpty if there is already filter on particular class
			this.store.addByValue(c, "isEmpty:false");
		}
	}
	// end
	
	var self = this;
    string = string || this.store.string();
    handler = handler || function (data) {
      self.handleResponse(data);
    };
    if (this.proxyUrl) {
      jQuery.post(this.proxyUrl, { query: string }, handler, 'json');
    }
    else {
      jQuery.getJSON(this.solrUrl + servlet + '?' + string + '&wt=json&json.wrf=?', {}, handler);
    }
    
    // remove isEmpty
    for(var c in this.classes){
    	this.store.removeByValue(c, "isEmpty:false");
    }
  }
});

(function ($) {

AjaxSolr.theme.prototype.result = function (doc,selectEntityHandler,template) {
	
	// if there is a template use it 
	if(template!=null){
		// render using template
		// handlebar way
		var $templateDom = $( template(doc) );
		
		$templateDom.find(".selectEntity").bind("click",function(e){
			e.preventDefault();
			selectEntityHandler(doc.id);
		});
		
		return $templateDom;
	}
			
	// if not render the default way 
	
	var label = doc.id;
	if(SindiceHelper.replacePrefix){
		label = SindiceHelper.replacePrefix(doc.id);
	}
	if(SindiceHelper.shortenLongWords){
		label = SindiceHelper.shortenLongWords(label,100,40);
	}

	if(doc.title && doc.title.length>0){
		label = doc.title[0];
	}else if(doc.label && doc.label.length>0){
		label = doc.label[0];
	}
	
	var output = '<div id="'+makeSafeId(doc.id)+'" class="container document shadow">'+
					'<h2 style="float:left;"><a href="'+doc.id+'">' + escape(label) + '</a></h2>'+
		      '<br /><table></table></div>';
	
    var $templateDom = $(output);
		
    $templateDom.find(".selectEntity").bind("click",function(e){
    	e.preventDefault();
		selectEntityHandler(doc.id);
	});
		
    var prepareSingleValue = function(fieldName , v){
    	// special handling of json field
    	if(fieldName == "json"){
        	//TODO: 
        	// here we could hide the whole json and return only pieces that match the query 
    		// but lets leave it for later 
    		
    		// srip html tags 
    		v = strip(v);
            return '<div class="jsonContainer"><pre><code class=" hljs json">'+JSON.stringify( JSON.parse(v), null, " ")+'</code></pre></div>';
        }

    	v = strip(v);
        
        if(SindiceHelper.replacePrefix){
            v = SindiceHelper.replacePrefix(v);
        }
        if(SindiceHelper.shortenLongWords){
            v = SindiceHelper.shortenLongWords(v,100,40);
        }
        
        return v;
    };
		
	for (field in doc) {
        if (field == 'id') {
            continue;
        }
        
        // replace value in the template 
        
        if (doc[field] instanceof Array){
            var value = '<ul>';
            for(var i=0;i<doc[field].length;i++){
                value += '<li>'+prepareSingleValue( field, doc[field][i] )+'</li>';
            }
            value += '</ul>';
        } else {
            value =  prepareSingleValue(field, doc[field] ); 
	    }
        
        
        $templateDom.find("table").append('<tr><td><b>' + escape(field) + ':</b></td><td class="value">' +value+ '</td></tr>');
	}
    return $templateDom;
};


AjaxSolr.theme.prototype.snippet = function (doc) {
  var output = '';
  if (doc.hasDescription.length > 300) {
    output += doc.dateline + ' ' + doc.text.substring(0, 300);
    output += '<span style="display:none;">' + doc.text.substring(300);
    output += '</span> <a href="#" class="more">more</a>';
  }
  else {
    output += doc.dateline + ' ' + doc.hasDescription;
  }
  return output;
};

AjaxSolr.theme.prototype.facet_container = function (title, name) {
  return $('#facets').append('<h2>').text(title);
};

/**
 * Create a list with counts for each facet value and a link to filter with it
 */
AjaxSolr.theme.prototype.facet = function (facet) { 
  var list = $('<ul>');
  for (var i = 0; i < facet.length; i++) {
    var item = facet[i];
    var link_label = item.value;
    if(SindiceHelper.replacePrefix){
    	link_label = SindiceHelper.replacePrefix(link_label);
	}
    var link = $('<a href="#"/>').text(link_label).click(item.handler);
    var list_item = $('<li>').append(link).append(' (' + item.count + ')');
    list.append(list_item);
  }
  return list;
};


AjaxSolr.theme.prototype.facet2 = function (facet) { 
	  var list = $('<ul>');
	  for (var i = 0; i < facet.length; i++) {
	    var item = facet[i];
	    var link_label = item.value;
	    if(SindiceHelper.replacePrefix){
	    	link_label = SindiceHelper.replacePrefix(link_label);
		}
	    var link = $('<a href="#"/>').text(link_label).click(item.handler);
	    var list_item = $('<li>').append(link).append(' (' + item.count + ')');
	    list.append(list_item);
	  }
	  return list;
	};


AjaxSolr.theme.prototype.facet_link = function (value, handler) {
  return $('<a href="#"/>').text(value).click(handler);
};

AjaxSolr.theme.prototype.no_items_found = function () {
  return 'no items found in current selection';
};

AjaxSolr.theme.prototype.loading_items = function () {
  return '<span class="ajax-loader" />';
};


AjaxSolr.theme.prototype.currentSearch = function () {
	  return '<span class="ajax-loader" />';
	};


})(jQuery);

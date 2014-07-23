(function($) {

  AjaxSolr.SirenCurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
    
    name:null,
    
    init:function(){
      this._initWidgetUI();
    },
    
    afterRequest : function() {
      var self = this;

      var keywordLinks = [];
      var jsonLinks = [];

      var q = self.manager.store.get('q').val();
      
      if (q != null) {

        qp.parse(q);
        var parsed = qp.getParsed();

        for (var i = 0; i < parsed.keywords.length; i++) {
          var keyword = parsed.keywords[i];

          keywordLinks.push($('<a href="#"/>').text('(x) ' + keyword).click(
              function() {

                var q1 = self.manager.store.get('q').val();
                qp.parse(q1);
                qp.removeKeyword(keyword);

                self.manager.store.get('q').val(qp.generateQ());
                self.manager.doRequest(0);
                return false;
              }));
        }

        for (var i = 0; i < parsed.jsons.length; i++) {
          var jsonPart = parsed.jsons[i];

          (function(json) {
            // ==========================
            jsonLinks.push($('<a href="#"/>').text('(x) ' + json).click(
                function() {

                  var q2 = self.manager.store.get('q').val();
                  qp.parse(q2);
                  qp.removeJson(json);

                  self.manager.store.get('q').val(qp.generateQ());
                  self.manager.doRequest(0);
                  return false;
                }));
            // ==========================
          })(jsonPart);

        }
      }

      var sortF = function($a, $b) {
        var aText = $a.text().toLowerCase();
        var bText = $b.text().toLowerCase();
        if (aText > bText) {
          return 1;
        } else if (bText > aText) {
          return -1;
        } else {
          return 0;
        }
      };

      keywordLinks = keywordLinks.sort(sortF);
      jsonLinks = jsonLinks.sort(sortF);

      var links = [].concat(keywordLinks, jsonLinks);

      if (links.length > 1) {
        links.unshift($('<a href="#"/>').text('remove all').click(function() {

          self.manager.store.removeByValue("q",Manager.store.get('q').val());
          self.manager.checkForEmptyQuery();
          self.manager.doRequest(0);
          return false;
        }));
      }

      if (links.length) {
        this._initWidgetUI();

        AjaxSolr.theme('list_items', this.target+" ul", links);
      } else {
        $(this.target).html('<div>Viewing all documents!</div>');
      }
    },
    
    _initWidgetUI: function(){
      $(this.target).html(
          '<h2>'+this.name+'</h2>'+
          '<ul class="selection"></ul>');
    }

  });

})(jQuery);

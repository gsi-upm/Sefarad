(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Ember.TEMPLATES['components/data-table-bin'] = require('./template.hbs');

var DataTableBinComponent = Ember.Component.extend({
  classNames: ['header-item-bin'],
  classNameBindings: ['over'],

  dragOver: function (event) {
    this.set('over', true);
    event.preventDefault();
  },

  drop: function (event) {
    var data = JSON.parse(event.dataTransfer.getData('application/json'));
    var columns = this.get('columns');
    var headerColumns = this.get('parentView.columns');
    var defaultColumns = this.get('parentView.defaultColumns');
    var column;

    if (!columns.findBy('name', data.name) && headerColumns.length > 1) {
      column = this.get('parentView.availableColumns').findBy('name', data.name);
      this.get('columns').pushObject(column);

      if (column) {
        this.set('parentView.columns', headerColumns.without(column));
      }
    }

    this.set('over', false);
  },

  dragEnter: function () {
    this.set('over', true);
  },

  dragLeave: function () {
    this.set('over', false);
  }
});

module.exports = DataTableBinComponent;

},{"./template.hbs":2}],2:[function(require,module,exports){
// hbsfy compiled Handlebars template
var compiler = Ember.Handlebars;
module.exports = compiler.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <li>");
  data.buffer.push(escapeExpression((helper = helpers['data-table-column'] || (depth0 && depth0['data-table-column']),options={hash:{
    'content': ("")
  },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "data-table-column", options))));
  data.buffer.push("</li>\n  ");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n    <li><span class=\"text-muted\">No attributes available.</span></li>\n  ");
  }

  data.buffer.push("<ul class=\"well well-sm list-unstyled list-inline\">\n  ");
  stack1 = helpers.each.call(depth0, "columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</ul>\n");
  return buffer;
  
});

},{}],3:[function(require,module,exports){
Ember.TEMPLATES['components/data-table-column'] = require('./template.hbs');

var DataTableColumnComponent = Ember.Component.extend({
  classNames: ['label', 'label-default'],
  classNameBindings: ['dataType'],
  attributeBindings: ['draggable'],
  draggable: 'true',

  dataType: function () {
    return 'type-' + this.get('content.dataType') || 'default';
  }.property('content.dataType'),

  dragStart: function (event) {
    var data = {
      id: this.get('elementId'),
      name: this.get('content.name')
    };

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(data));
  }
});

module.exports = DataTableColumnComponent;

},{"./template.hbs":4}],4:[function(require,module,exports){
// hbsfy compiled Handlebars template
var compiler = Ember.Handlebars;
module.exports = compiler.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  stack1 = helpers._triageMustache.call(depth0, "content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

},{}],5:[function(require,module,exports){
var DataTableHeaderView = require('./header');
Ember.TEMPLATES['components/data-table'] = require('./template.hbs');

var DataTableComponent = Ember.Component.extend({
  columns: Ember.A(),
  dataTableHeader: DataTableHeaderView,

  types: function () {
    return this.get('dataset').reduce(function (previous, current) {
      if (!previous.findBy('type', current.constructor.typeKey)) {
        previous.pushObject(Ember.Object.create({
          type: current.constructor.typeKey,
          keys: Ember.keys(current.toJSON())
        }));
      }

      return previous;
    }, []);
  }.property('dataset'),

  availableColumns: function () {
    var dataset = this.get('dataset');
    return this.generateColumns(dataset);
  }.property(),

  columnsNotInHeader: function () {
    var available = this.get('availableColumns');
    var displayed = this.get('columns');

    return available.reduce(function (previous, item) {
      if (!displayed.findBy('name', item.name)) {
        previous.pushObject(item);
      }

      return previous;
    }, []);
  }.property('availableColumns', 'columns'),

  prePopulateColumns: function () {
    var defaultColumns = this.get('defaultColumns');
    var availableColumns = this.get('availableColumns');
    var filtered = availableColumns.filter(function (item) {
      return defaultColumns.contains(item.get('name'));
    });

    this.get('columns').pushObjects(filtered);
  }.on('init'),

  data: function () {
    var dataset = this.get('dataset');
    var columns = this.get('columns');
    var self = this;

    dataset = Ember.isArray(dataset) ? dataset : dataset.get('content');

    if (!Ember.isArray(dataset)) {
      throw new Error('Dataset input must be an array.');
    }

    return dataset.map(function (item) {
      var type = item.constructor.typeKey;

      if (columns) {
        return self.columnAttributeMap(columns, item, type);
      }

    }).filter(function (item) {
      // Remove if
      var allEmpty = item.every(function (col) {
        return Ember.isEmpty(col)
      });

      if (allEmpty) {
        return false;
      }
      else {
        return !item.isAny('@this', '');
      }
    });
  }.property('dataset', 'columns.length'),

  columnAttributeMap: function (columns, row, type) {
    if (!row) {
      return;
    }

    var result = [],
      rowJson = row.toJSON(),
      rowKeys = Ember.keys(rowJson),
      col = 0,
      columnsAdded = [],
      prop, attr;

    for (; col < columns.length; col++) {
      columns.objectAt(col).get('attributes').forEach(function (attr) {
        var split = attr.split(':');
        prop = split[1];
        if (rowJson.hasOwnProperty(prop) && !columnsAdded.contains(prop)) {
          columnsAdded.push(prop);
          result.splice(col, 0, rowJson[prop]);
        }
        else if (!columnsAdded.contains(prop)) {
          result.splice(col, 0, '');
        }
      });
    }

    return result;
  },

  generateColumns: function (dataset) {
    var types = this.get('types');

    if (types) {
      return types.reduce(function (previous, current, index, arr) {
        var type = current.get('type');

        current.get('keys').forEach(function (item) {
          var name = item.capitalize();
          var column = previous.findBy('name', name);
          var attribute = type + ':' + item;
          
          if (column) {
            column.get('attributes').pushObject(attribute);
          }
          else {
            previous.pushObject(Ember.Object.create({
              name: name,
              attributes: [attribute],
              dataType: type
            }));
          }
        });

        return previous;
      }, []);
    }
  }
});

module.exports = DataTableComponent;

},{"./header":8,"./template.hbs":10}],6:[function(require,module,exports){
// hbsfy compiled Handlebars template
var compiler = Ember.Handlebars;
module.exports = compiler.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression((helper = helpers['data-table-column'] || (depth0 && depth0['data-table-column']),options={hash:{
    'content': ("view.content")
  },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "data-table-column", options))));
  data.buffer.push("\n");
  return buffer;
  
});

},{}],7:[function(require,module,exports){
Ember.TEMPLATES['components/data-table/collection-item'] = require('./collection-item.hbs');

var CollectionItemView = Ember.View.extend({
  elementId: Ember.computed.alias('name'),
  templateName: 'components/data-table/collection-item',
  classNameBindings: ['dropSide'],
  tagName: 'th',
  dropSide: null,
  target: Ember.computed.alias('parentView'),

  dragOver: function (event) {
    Ember.run.throttle(this, function () {
      if (event.originalEvent.offsetX > (this.$().width() / 2)) {
        this.set('dropSide', 'right');
      }
      else {
        this.set('dropSide', 'left');
      }

      this.set('parentView.over', true);
    }, 300);
  },

  dragLeave: function () {
    this.set('dropSide', null);
    this.set('parentView.over', false);
  },

  drop: function () {
    var sideDropped = this.get('dropSide');
    var data = JSON.parse(event.dataTransfer.getData('application/json'));
    var column = this.get('parentView.parentView.availableColumns').findBy('name', data.name);

    if (sideDropped === 'left') {
      this.send('insertBefore', this.get('content'), column);   
    }
    else {
      this.send('insertAfter', this.get('content'), column);   
    }

    this.set('dropSide', null);
  }
});

module.exports = CollectionItemView;

},{"./collection-item.hbs":6}],8:[function(require,module,exports){
var CollectionItemView = require('./collection-item');
Ember.TEMPLATES['components/data-table/header'] = require('./template.hbs');

var DataTableHeaderCollection = Ember.CollectionView.extend({
  tagName: 'tr',
  templateName: 'components/data-table/header',
  content: Ember.computed.alias('parentView.columns'),
  classNameBindings: ['over'],
  columnsNotInHeader: Ember.computed.alias('parentView.binComponent.columns'),
  itemViewClass: CollectionItemView,

  dragOver: function (event) {
    event.preventDefault();
  },

  dragEnter: function (event) {
    this.set('over', true);
  },

  dragLeave: function () {
    this.set('over', false);
  },

  drop: function (event) {
    var data = JSON.parse(event.dataTransfer.getData('application/json'));
    var column = this.get('parentView.availableColumns').findBy('name', data.name);
    var content = this.get('content');
    var columnsNotInHeader = this.get('columnsNotInHeader');

    if (!content.findBy('name', column.name)) {
      this.get('content').pushObject(column);

      droppedItem = columnsNotInHeader.findBy('name', data.name);
      if (droppedItem) {
        this.set('columnsNotInHeader', columnsNotInHeader.without(droppedItem));
      }
    }
    else {
      if (column) {
        this.set('columnsNotInHeader', columnsNotInHeader.without(column));
      }
    }

    this.set('over', false);
  },

  insertAt: function (existing, dropped, add) {
    var columns = this.get('content');
    var existingIndex = columns.indexOf(existing);
    var duplicate = columns.findBy('name', dropped.get('name'));
    var modifedIndex;
    var dupIndex;

    if (existing.get('name') === dropped.get('name')) {
      return;
    }
    else {
      modifiedIndex = existingIndex + add;
    }

    if (columns) {
      if (duplicate) {
        dupIndex = columns.indexOf(duplicate);
        if (typeof dupIndex === 'number') {
          columns.arrayContentWillChange(dupIndex, 1, 0);
          columns.splice(dupIndex, 1);
          this.set('content', columns);
          columns.arrayContentDidChange(dupIndex, 1, 0);
        }
      }
      
      if (modifiedIndex > columns.length) {
        columns.pushObject(dropped);
      }
      else {
        columns.arrayContentWillChange(modifiedIndex, 0, 1);
        columns.splice(modifiedIndex, 0, dropped);
        this.set('content', columns);
        columns.arrayContentDidChange(modifiedIndex, 0, 1);
      }
    } 
  },

  actions: {
    insertBefore: function (existing, dropped) {
      this.insertAt(existing, dropped, 0);  
    },

    insertAfter: function (existing, dropped) {
      this.insertAt(existing, dropped, 1);  
    }
  }
});

module.exports = DataTableHeaderCollection;

},{"./collection-item":7,"./template.hbs":9}],9:[function(require,module,exports){
// hbsfy compiled Handlebars template
var compiler = Ember.Handlebars;
module.exports = compiler.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  return buffer;
  
});

},{}],10:[function(require,module,exports){
// hbsfy compiled Handlebars template
var compiler = Ember.Handlebars;
module.exports = compiler.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n      <tr>\n        ");
  stack1 = helpers.each.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </tr>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n          <td>");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n        ");
  return buffer;
  }

  data.buffer.push(escapeExpression((helper = helpers['data-table-bin'] || (depth0 && depth0['data-table-bin']),options={hash:{
    'columns': ("columnsNotInHeader"),
    'viewName': ("binComponent")
  },hashTypes:{'columns': "ID",'viewName': "STRING"},hashContexts:{'columns': depth0,'viewName': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "data-table-bin", options))));
  data.buffer.push("\n<table class=\"table table-responsive table-hover table-condensed\">\n  <thead>\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "dataTableHeader", {hash:{
    'viewName': ("columnCollection")
  },hashTypes:{'viewName': "STRING"},hashContexts:{'viewName': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  </thead>\n  <tbody>\n    ");
  stack1 = helpers.each.call(depth0, "data", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </tbody>\n</table>\n");
  return buffer;
  
});

},{}],11:[function(require,module,exports){
var DataTableComponent = require('./data-table/component');
var DataTableBinComponent = require('./data-table-bin/component');
var DataTableColumnComponent = require('./data-table-column/component');

Ember.Application.initializer({
  name: 'data-table',

  initialize: function(container, application) {
    container.register('component:data-table', DataTableComponent);
    container.register('component:data-table-bin', DataTableBinComponent);
    container.register('component:data-table-column', DataTableColumnComponent);
  }
});

},{"./data-table-bin/component":1,"./data-table-column/component":3,"./data-table/component":5}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvaXJhZGNoZW5rby9zYW5kYm94L2RhdGEtdGFibGUvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9pcmFkY2hlbmtvL3NhbmRib3gvZGF0YS10YWJsZS9zcmMvZGF0YS10YWJsZS1iaW4vY29tcG9uZW50LmpzIiwiL1VzZXJzL2lyYWRjaGVua28vc2FuZGJveC9kYXRhLXRhYmxlL3NyYy9kYXRhLXRhYmxlLWJpbi90ZW1wbGF0ZS5oYnMiLCIvVXNlcnMvaXJhZGNoZW5rby9zYW5kYm94L2RhdGEtdGFibGUvc3JjL2RhdGEtdGFibGUtY29sdW1uL2NvbXBvbmVudC5qcyIsIi9Vc2Vycy9pcmFkY2hlbmtvL3NhbmRib3gvZGF0YS10YWJsZS9zcmMvZGF0YS10YWJsZS1jb2x1bW4vdGVtcGxhdGUuaGJzIiwiL1VzZXJzL2lyYWRjaGVua28vc2FuZGJveC9kYXRhLXRhYmxlL3NyYy9kYXRhLXRhYmxlL2NvbXBvbmVudC5qcyIsIi9Vc2Vycy9pcmFkY2hlbmtvL3NhbmRib3gvZGF0YS10YWJsZS9zcmMvZGF0YS10YWJsZS9oZWFkZXIvY29sbGVjdGlvbi1pdGVtLmhicyIsIi9Vc2Vycy9pcmFkY2hlbmtvL3NhbmRib3gvZGF0YS10YWJsZS9zcmMvZGF0YS10YWJsZS9oZWFkZXIvY29sbGVjdGlvbi1pdGVtLmpzIiwiL1VzZXJzL2lyYWRjaGVua28vc2FuZGJveC9kYXRhLXRhYmxlL3NyYy9kYXRhLXRhYmxlL2hlYWRlci9pbmRleC5qcyIsIi9Vc2Vycy9pcmFkY2hlbmtvL3NhbmRib3gvZGF0YS10YWJsZS9zcmMvZGF0YS10YWJsZS9oZWFkZXIvdGVtcGxhdGUuaGJzIiwiL1VzZXJzL2lyYWRjaGVua28vc2FuZGJveC9kYXRhLXRhYmxlL3NyYy9kYXRhLXRhYmxlL3RlbXBsYXRlLmhicyIsIi9Vc2Vycy9pcmFkY2hlbmtvL3NhbmRib3gvZGF0YS10YWJsZS9zcmMvaW5pdGlhbGl6ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJFbWJlci5URU1QTEFURVNbJ2NvbXBvbmVudHMvZGF0YS10YWJsZS1iaW4nXSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUuaGJzJyk7XG5cbnZhciBEYXRhVGFibGVCaW5Db21wb25lbnQgPSBFbWJlci5Db21wb25lbnQuZXh0ZW5kKHtcbiAgY2xhc3NOYW1lczogWydoZWFkZXItaXRlbS1iaW4nXSxcbiAgY2xhc3NOYW1lQmluZGluZ3M6IFsnb3ZlciddLFxuXG4gIGRyYWdPdmVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB0aGlzLnNldCgnb3ZlcicsIHRydWUpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG5cbiAgZHJvcDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJykpO1xuICAgIHZhciBjb2x1bW5zID0gdGhpcy5nZXQoJ2NvbHVtbnMnKTtcbiAgICB2YXIgaGVhZGVyQ29sdW1ucyA9IHRoaXMuZ2V0KCdwYXJlbnRWaWV3LmNvbHVtbnMnKTtcbiAgICB2YXIgZGVmYXVsdENvbHVtbnMgPSB0aGlzLmdldCgncGFyZW50Vmlldy5kZWZhdWx0Q29sdW1ucycpO1xuICAgIHZhciBjb2x1bW47XG5cbiAgICBpZiAoIWNvbHVtbnMuZmluZEJ5KCduYW1lJywgZGF0YS5uYW1lKSAmJiBoZWFkZXJDb2x1bW5zLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbHVtbiA9IHRoaXMuZ2V0KCdwYXJlbnRWaWV3LmF2YWlsYWJsZUNvbHVtbnMnKS5maW5kQnkoJ25hbWUnLCBkYXRhLm5hbWUpO1xuICAgICAgdGhpcy5nZXQoJ2NvbHVtbnMnKS5wdXNoT2JqZWN0KGNvbHVtbik7XG5cbiAgICAgIGlmIChjb2x1bW4pIHtcbiAgICAgICAgdGhpcy5zZXQoJ3BhcmVudFZpZXcuY29sdW1ucycsIGhlYWRlckNvbHVtbnMud2l0aG91dChjb2x1bW4pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldCgnb3ZlcicsIGZhbHNlKTtcbiAgfSxcblxuICBkcmFnRW50ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldCgnb3ZlcicsIHRydWUpO1xuICB9LFxuXG4gIGRyYWdMZWF2ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0KCdvdmVyJywgZmFsc2UpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVGFibGVCaW5Db21wb25lbnQ7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgY29tcGlsZXIgPSBFbWJlci5IYW5kbGViYXJzO1xubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlci50ZW1wbGF0ZShmdW5jdGlvbiBhbm9ueW1vdXMoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG50aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgRW1iZXIuSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSAnJywgc3RhY2sxLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSAnJywgaGVscGVyLCBvcHRpb25zO1xuICBkYXRhLmJ1ZmZlci5wdXNoKFwiXFxuICAgIDxsaT5cIik7XG4gIGRhdGEuYnVmZmVyLnB1c2goZXNjYXBlRXhwcmVzc2lvbigoaGVscGVyID0gaGVscGVyc1snZGF0YS10YWJsZS1jb2x1bW4nXSB8fCAoZGVwdGgwICYmIGRlcHRoMFsnZGF0YS10YWJsZS1jb2x1bW4nXSksb3B0aW9ucz17aGFzaDp7XG4gICAgJ2NvbnRlbnQnOiAoXCJcIilcbiAgfSxoYXNoVHlwZXM6eydjb250ZW50JzogXCJJRFwifSxoYXNoQ29udGV4dHM6eydjb250ZW50JzogZGVwdGgwfSxjb250ZXh0czpbXSx0eXBlczpbXSxkYXRhOmRhdGF9LGhlbHBlciA/IGhlbHBlci5jYWxsKGRlcHRoMCwgb3B0aW9ucykgOiBoZWxwZXJNaXNzaW5nLmNhbGwoZGVwdGgwLCBcImRhdGEtdGFibGUtY29sdW1uXCIsIG9wdGlvbnMpKSkpO1xuICBkYXRhLmJ1ZmZlci5wdXNoKFwiPC9saT5cXG4gIFwiKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG5mdW5jdGlvbiBwcm9ncmFtMyhkZXB0aDAsZGF0YSkge1xuICBcbiAgXG4gIGRhdGEuYnVmZmVyLnB1c2goXCJcXG4gICAgPGxpPjxzcGFuIGNsYXNzPVxcXCJ0ZXh0LW11dGVkXFxcIj5ObyBhdHRyaWJ1dGVzIGF2YWlsYWJsZS48L3NwYW4+PC9saT5cXG4gIFwiKTtcbiAgfVxuXG4gIGRhdGEuYnVmZmVyLnB1c2goXCI8dWwgY2xhc3M9XFxcIndlbGwgd2VsbC1zbSBsaXN0LXVuc3R5bGVkIGxpc3QtaW5saW5lXFxcIj5cXG4gIFwiKTtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCBcImNvbHVtbnNcIiwge2hhc2g6e30saGFzaFR5cGVzOnt9LGhhc2hDb250ZXh0czp7fSxpbnZlcnNlOnNlbGYucHJvZ3JhbSgzLCBwcm9ncmFtMywgZGF0YSksZm46c2VsZi5wcm9ncmFtKDEsIHByb2dyYW0xLCBkYXRhKSxjb250ZXh0czpbZGVwdGgwXSx0eXBlczpbXCJJRFwiXSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBkYXRhLmJ1ZmZlci5wdXNoKHN0YWNrMSk7IH1cbiAgZGF0YS5idWZmZXIucHVzaChcIlxcbjwvdWw+XFxuXCIpO1xuICByZXR1cm4gYnVmZmVyO1xuICBcbn0pO1xuIiwiRW1iZXIuVEVNUExBVEVTWydjb21wb25lbnRzL2RhdGEtdGFibGUtY29sdW1uJ10gPSByZXF1aXJlKCcuL3RlbXBsYXRlLmhicycpO1xuXG52YXIgRGF0YVRhYmxlQ29sdW1uQ29tcG9uZW50ID0gRW1iZXIuQ29tcG9uZW50LmV4dGVuZCh7XG4gIGNsYXNzTmFtZXM6IFsnbGFiZWwnLCAnbGFiZWwtZGVmYXVsdCddLFxuICBjbGFzc05hbWVCaW5kaW5nczogWydkYXRhVHlwZSddLFxuICBhdHRyaWJ1dGVCaW5kaW5nczogWydkcmFnZ2FibGUnXSxcbiAgZHJhZ2dhYmxlOiAndHJ1ZScsXG5cbiAgZGF0YVR5cGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ3R5cGUtJyArIHRoaXMuZ2V0KCdjb250ZW50LmRhdGFUeXBlJykgfHwgJ2RlZmF1bHQnO1xuICB9LnByb3BlcnR5KCdjb250ZW50LmRhdGFUeXBlJyksXG5cbiAgZHJhZ1N0YXJ0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGlkOiB0aGlzLmdldCgnZWxlbWVudElkJyksXG4gICAgICBuYW1lOiB0aGlzLmdldCgnY29udGVudC5uYW1lJylcbiAgICB9O1xuXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFUYWJsZUNvbHVtbkNvbXBvbmVudDtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBjb21waWxlciA9IEVtYmVyLkhhbmRsZWJhcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVyLnRlbXBsYXRlKGZ1bmN0aW9uIGFub255bW91cyhIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbnRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBFbWJlci5IYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9ICcnLCBzdGFjazE7XG5cblxuICBzdGFjazEgPSBoZWxwZXJzLl90cmlhZ2VNdXN0YWNoZS5jYWxsKGRlcHRoMCwgXCJjb250ZW50Lm5hbWVcIiwge2hhc2g6e30saGFzaFR5cGVzOnt9LGhhc2hDb250ZXh0czp7fSxjb250ZXh0czpbZGVwdGgwXSx0eXBlczpbXCJJRFwiXSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBkYXRhLmJ1ZmZlci5wdXNoKHN0YWNrMSk7IH1cbiAgZGF0YS5idWZmZXIucHVzaChcIlxcblwiKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgXG59KTtcbiIsInZhciBEYXRhVGFibGVIZWFkZXJWaWV3ID0gcmVxdWlyZSgnLi9oZWFkZXInKTtcbkVtYmVyLlRFTVBMQVRFU1snY29tcG9uZW50cy9kYXRhLXRhYmxlJ10gPSByZXF1aXJlKCcuL3RlbXBsYXRlLmhicycpO1xuXG52YXIgRGF0YVRhYmxlQ29tcG9uZW50ID0gRW1iZXIuQ29tcG9uZW50LmV4dGVuZCh7XG4gIGNvbHVtbnM6IEVtYmVyLkEoKSxcbiAgZGF0YVRhYmxlSGVhZGVyOiBEYXRhVGFibGVIZWFkZXJWaWV3LFxuXG4gIHR5cGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdkYXRhc2V0JykucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91cywgY3VycmVudCkge1xuICAgICAgaWYgKCFwcmV2aW91cy5maW5kQnkoJ3R5cGUnLCBjdXJyZW50LmNvbnN0cnVjdG9yLnR5cGVLZXkpKSB7XG4gICAgICAgIHByZXZpb3VzLnB1c2hPYmplY3QoRW1iZXIuT2JqZWN0LmNyZWF0ZSh7XG4gICAgICAgICAgdHlwZTogY3VycmVudC5jb25zdHJ1Y3Rvci50eXBlS2V5LFxuICAgICAgICAgIGtleXM6IEVtYmVyLmtleXMoY3VycmVudC50b0pTT04oKSlcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgfSwgW10pO1xuICB9LnByb3BlcnR5KCdkYXRhc2V0JyksXG5cbiAgYXZhaWxhYmxlQ29sdW1uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhc2V0ID0gdGhpcy5nZXQoJ2RhdGFzZXQnKTtcbiAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUNvbHVtbnMoZGF0YXNldCk7XG4gIH0ucHJvcGVydHkoKSxcblxuICBjb2x1bW5zTm90SW5IZWFkZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXZhaWxhYmxlID0gdGhpcy5nZXQoJ2F2YWlsYWJsZUNvbHVtbnMnKTtcbiAgICB2YXIgZGlzcGxheWVkID0gdGhpcy5nZXQoJ2NvbHVtbnMnKTtcblxuICAgIHJldHVybiBhdmFpbGFibGUucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91cywgaXRlbSkge1xuICAgICAgaWYgKCFkaXNwbGF5ZWQuZmluZEJ5KCduYW1lJywgaXRlbS5uYW1lKSkge1xuICAgICAgICBwcmV2aW91cy5wdXNoT2JqZWN0KGl0ZW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgfSwgW10pO1xuICB9LnByb3BlcnR5KCdhdmFpbGFibGVDb2x1bW5zJywgJ2NvbHVtbnMnKSxcblxuICBwcmVQb3B1bGF0ZUNvbHVtbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVmYXVsdENvbHVtbnMgPSB0aGlzLmdldCgnZGVmYXVsdENvbHVtbnMnKTtcbiAgICB2YXIgYXZhaWxhYmxlQ29sdW1ucyA9IHRoaXMuZ2V0KCdhdmFpbGFibGVDb2x1bW5zJyk7XG4gICAgdmFyIGZpbHRlcmVkID0gYXZhaWxhYmxlQ29sdW1ucy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Q29sdW1ucy5jb250YWlucyhpdGVtLmdldCgnbmFtZScpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZ2V0KCdjb2x1bW5zJykucHVzaE9iamVjdHMoZmlsdGVyZWQpO1xuICB9Lm9uKCdpbml0JyksXG5cbiAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhc2V0ID0gdGhpcy5nZXQoJ2RhdGFzZXQnKTtcbiAgICB2YXIgY29sdW1ucyA9IHRoaXMuZ2V0KCdjb2x1bW5zJyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGF0YXNldCA9IEVtYmVyLmlzQXJyYXkoZGF0YXNldCkgPyBkYXRhc2V0IDogZGF0YXNldC5nZXQoJ2NvbnRlbnQnKTtcblxuICAgIGlmICghRW1iZXIuaXNBcnJheShkYXRhc2V0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhc2V0IGlucHV0IG11c3QgYmUgYW4gYXJyYXkuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGFzZXQubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgdHlwZSA9IGl0ZW0uY29uc3RydWN0b3IudHlwZUtleTtcblxuICAgICAgaWYgKGNvbHVtbnMpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY29sdW1uQXR0cmlidXRlTWFwKGNvbHVtbnMsIGl0ZW0sIHR5cGUpO1xuICAgICAgfVxuXG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAvLyBSZW1vdmUgaWZcbiAgICAgIHZhciBhbGxFbXB0eSA9IGl0ZW0uZXZlcnkoZnVuY3Rpb24gKGNvbCkge1xuICAgICAgICByZXR1cm4gRW1iZXIuaXNFbXB0eShjb2wpXG4gICAgICB9KTtcblxuICAgICAgaWYgKGFsbEVtcHR5KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gIWl0ZW0uaXNBbnkoJ0B0aGlzJywgJycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LnByb3BlcnR5KCdkYXRhc2V0JywgJ2NvbHVtbnMubGVuZ3RoJyksXG5cbiAgY29sdW1uQXR0cmlidXRlTWFwOiBmdW5jdGlvbiAoY29sdW1ucywgcm93LCB0eXBlKSB7XG4gICAgaWYgKCFyb3cpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICByb3dKc29uID0gcm93LnRvSlNPTigpLFxuICAgICAgcm93S2V5cyA9IEVtYmVyLmtleXMocm93SnNvbiksXG4gICAgICBjb2wgPSAwLFxuICAgICAgY29sdW1uc0FkZGVkID0gW10sXG4gICAgICBwcm9wLCBhdHRyO1xuXG4gICAgZm9yICg7IGNvbCA8IGNvbHVtbnMubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29sdW1ucy5vYmplY3RBdChjb2wpLmdldCgnYXR0cmlidXRlcycpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYXR0ci5zcGxpdCgnOicpO1xuICAgICAgICBwcm9wID0gc3BsaXRbMV07XG4gICAgICAgIGlmIChyb3dKc29uLmhhc093blByb3BlcnR5KHByb3ApICYmICFjb2x1bW5zQWRkZWQuY29udGFpbnMocHJvcCkpIHtcbiAgICAgICAgICBjb2x1bW5zQWRkZWQucHVzaChwcm9wKTtcbiAgICAgICAgICByZXN1bHQuc3BsaWNlKGNvbCwgMCwgcm93SnNvbltwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNvbHVtbnNBZGRlZC5jb250YWlucyhwcm9wKSkge1xuICAgICAgICAgIHJlc3VsdC5zcGxpY2UoY29sLCAwLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgZ2VuZXJhdGVDb2x1bW5zOiBmdW5jdGlvbiAoZGF0YXNldCkge1xuICAgIHZhciB0eXBlcyA9IHRoaXMuZ2V0KCd0eXBlcycpO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91cywgY3VycmVudCwgaW5kZXgsIGFycikge1xuICAgICAgICB2YXIgdHlwZSA9IGN1cnJlbnQuZ2V0KCd0eXBlJyk7XG5cbiAgICAgICAgY3VycmVudC5nZXQoJ2tleXMnKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgdmFyIG5hbWUgPSBpdGVtLmNhcGl0YWxpemUoKTtcbiAgICAgICAgICB2YXIgY29sdW1uID0gcHJldmlvdXMuZmluZEJ5KCduYW1lJywgbmFtZSk7XG4gICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IHR5cGUgKyAnOicgKyBpdGVtO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmIChjb2x1bW4pIHtcbiAgICAgICAgICAgIGNvbHVtbi5nZXQoJ2F0dHJpYnV0ZXMnKS5wdXNoT2JqZWN0KGF0dHJpYnV0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHJldmlvdXMucHVzaE9iamVjdChFbWJlci5PYmplY3QuY3JlYXRlKHtcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgYXR0cmlidXRlczogW2F0dHJpYnV0ZV0sXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiB0eXBlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVGFibGVDb21wb25lbnQ7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgY29tcGlsZXIgPSBFbWJlci5IYW5kbGViYXJzO1xubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlci50ZW1wbGF0ZShmdW5jdGlvbiBhbm9ueW1vdXMoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG50aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgRW1iZXIuSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSAnJywgaGVscGVyLCBvcHRpb25zLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cblxuICBkYXRhLmJ1ZmZlci5wdXNoKGVzY2FwZUV4cHJlc3Npb24oKGhlbHBlciA9IGhlbHBlcnNbJ2RhdGEtdGFibGUtY29sdW1uJ10gfHwgKGRlcHRoMCAmJiBkZXB0aDBbJ2RhdGEtdGFibGUtY29sdW1uJ10pLG9wdGlvbnM9e2hhc2g6e1xuICAgICdjb250ZW50JzogKFwidmlldy5jb250ZW50XCIpXG4gIH0saGFzaFR5cGVzOnsnY29udGVudCc6IFwiSURcIn0saGFzaENvbnRleHRzOnsnY29udGVudCc6IGRlcHRoMH0sY29udGV4dHM6W10sdHlwZXM6W10sZGF0YTpkYXRhfSxoZWxwZXIgPyBoZWxwZXIuY2FsbChkZXB0aDAsIG9wdGlvbnMpIDogaGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCwgXCJkYXRhLXRhYmxlLWNvbHVtblwiLCBvcHRpb25zKSkpKTtcbiAgZGF0YS5idWZmZXIucHVzaChcIlxcblwiKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgXG59KTtcbiIsIkVtYmVyLlRFTVBMQVRFU1snY29tcG9uZW50cy9kYXRhLXRhYmxlL2NvbGxlY3Rpb24taXRlbSddID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9uLWl0ZW0uaGJzJyk7XG5cbnZhciBDb2xsZWN0aW9uSXRlbVZpZXcgPSBFbWJlci5WaWV3LmV4dGVuZCh7XG4gIGVsZW1lbnRJZDogRW1iZXIuY29tcHV0ZWQuYWxpYXMoJ25hbWUnKSxcbiAgdGVtcGxhdGVOYW1lOiAnY29tcG9uZW50cy9kYXRhLXRhYmxlL2NvbGxlY3Rpb24taXRlbScsXG4gIGNsYXNzTmFtZUJpbmRpbmdzOiBbJ2Ryb3BTaWRlJ10sXG4gIHRhZ05hbWU6ICd0aCcsXG4gIGRyb3BTaWRlOiBudWxsLFxuICB0YXJnZXQ6IEVtYmVyLmNvbXB1dGVkLmFsaWFzKCdwYXJlbnRWaWV3JyksXG5cbiAgZHJhZ092ZXI6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIEVtYmVyLnJ1bi50aHJvdHRsZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudC5vZmZzZXRYID4gKHRoaXMuJCgpLndpZHRoKCkgLyAyKSkge1xuICAgICAgICB0aGlzLnNldCgnZHJvcFNpZGUnLCAncmlnaHQnKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnNldCgnZHJvcFNpZGUnLCAnbGVmdCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldCgncGFyZW50Vmlldy5vdmVyJywgdHJ1ZSk7XG4gICAgfSwgMzAwKTtcbiAgfSxcblxuICBkcmFnTGVhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldCgnZHJvcFNpZGUnLCBudWxsKTtcbiAgICB0aGlzLnNldCgncGFyZW50Vmlldy5vdmVyJywgZmFsc2UpO1xuICB9LFxuXG4gIGRyb3A6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2lkZURyb3BwZWQgPSB0aGlzLmdldCgnZHJvcFNpZGUnKTtcbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKSk7XG4gICAgdmFyIGNvbHVtbiA9IHRoaXMuZ2V0KCdwYXJlbnRWaWV3LnBhcmVudFZpZXcuYXZhaWxhYmxlQ29sdW1ucycpLmZpbmRCeSgnbmFtZScsIGRhdGEubmFtZSk7XG5cbiAgICBpZiAoc2lkZURyb3BwZWQgPT09ICdsZWZ0Jykge1xuICAgICAgdGhpcy5zZW5kKCdpbnNlcnRCZWZvcmUnLCB0aGlzLmdldCgnY29udGVudCcpLCBjb2x1bW4pOyAgIFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZCgnaW5zZXJ0QWZ0ZXInLCB0aGlzLmdldCgnY29udGVudCcpLCBjb2x1bW4pOyAgIFxuICAgIH1cblxuICAgIHRoaXMuc2V0KCdkcm9wU2lkZScsIG51bGwpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uSXRlbVZpZXc7XG4iLCJ2YXIgQ29sbGVjdGlvbkl0ZW1WaWV3ID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9uLWl0ZW0nKTtcbkVtYmVyLlRFTVBMQVRFU1snY29tcG9uZW50cy9kYXRhLXRhYmxlL2hlYWRlciddID0gcmVxdWlyZSgnLi90ZW1wbGF0ZS5oYnMnKTtcblxudmFyIERhdGFUYWJsZUhlYWRlckNvbGxlY3Rpb24gPSBFbWJlci5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICB0YWdOYW1lOiAndHInLFxuICB0ZW1wbGF0ZU5hbWU6ICdjb21wb25lbnRzL2RhdGEtdGFibGUvaGVhZGVyJyxcbiAgY29udGVudDogRW1iZXIuY29tcHV0ZWQuYWxpYXMoJ3BhcmVudFZpZXcuY29sdW1ucycpLFxuICBjbGFzc05hbWVCaW5kaW5nczogWydvdmVyJ10sXG4gIGNvbHVtbnNOb3RJbkhlYWRlcjogRW1iZXIuY29tcHV0ZWQuYWxpYXMoJ3BhcmVudFZpZXcuYmluQ29tcG9uZW50LmNvbHVtbnMnKSxcbiAgaXRlbVZpZXdDbGFzczogQ29sbGVjdGlvbkl0ZW1WaWV3LFxuXG4gIGRyYWdPdmVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuXG4gIGRyYWdFbnRlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdGhpcy5zZXQoJ292ZXInLCB0cnVlKTtcbiAgfSxcblxuICBkcmFnTGVhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldCgnb3ZlcicsIGZhbHNlKTtcbiAgfSxcblxuICBkcm9wOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKSk7XG4gICAgdmFyIGNvbHVtbiA9IHRoaXMuZ2V0KCdwYXJlbnRWaWV3LmF2YWlsYWJsZUNvbHVtbnMnKS5maW5kQnkoJ25hbWUnLCBkYXRhLm5hbWUpO1xuICAgIHZhciBjb250ZW50ID0gdGhpcy5nZXQoJ2NvbnRlbnQnKTtcbiAgICB2YXIgY29sdW1uc05vdEluSGVhZGVyID0gdGhpcy5nZXQoJ2NvbHVtbnNOb3RJbkhlYWRlcicpO1xuXG4gICAgaWYgKCFjb250ZW50LmZpbmRCeSgnbmFtZScsIGNvbHVtbi5uYW1lKSkge1xuICAgICAgdGhpcy5nZXQoJ2NvbnRlbnQnKS5wdXNoT2JqZWN0KGNvbHVtbik7XG5cbiAgICAgIGRyb3BwZWRJdGVtID0gY29sdW1uc05vdEluSGVhZGVyLmZpbmRCeSgnbmFtZScsIGRhdGEubmFtZSk7XG4gICAgICBpZiAoZHJvcHBlZEl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXQoJ2NvbHVtbnNOb3RJbkhlYWRlcicsIGNvbHVtbnNOb3RJbkhlYWRlci53aXRob3V0KGRyb3BwZWRJdGVtKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGNvbHVtbikge1xuICAgICAgICB0aGlzLnNldCgnY29sdW1uc05vdEluSGVhZGVyJywgY29sdW1uc05vdEluSGVhZGVyLndpdGhvdXQoY29sdW1uKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoJ292ZXInLCBmYWxzZSk7XG4gIH0sXG5cbiAgaW5zZXJ0QXQ6IGZ1bmN0aW9uIChleGlzdGluZywgZHJvcHBlZCwgYWRkKSB7XG4gICAgdmFyIGNvbHVtbnMgPSB0aGlzLmdldCgnY29udGVudCcpO1xuICAgIHZhciBleGlzdGluZ0luZGV4ID0gY29sdW1ucy5pbmRleE9mKGV4aXN0aW5nKTtcbiAgICB2YXIgZHVwbGljYXRlID0gY29sdW1ucy5maW5kQnkoJ25hbWUnLCBkcm9wcGVkLmdldCgnbmFtZScpKTtcbiAgICB2YXIgbW9kaWZlZEluZGV4O1xuICAgIHZhciBkdXBJbmRleDtcblxuICAgIGlmIChleGlzdGluZy5nZXQoJ25hbWUnKSA9PT0gZHJvcHBlZC5nZXQoJ25hbWUnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1vZGlmaWVkSW5kZXggPSBleGlzdGluZ0luZGV4ICsgYWRkO1xuICAgIH1cblxuICAgIGlmIChjb2x1bW5zKSB7XG4gICAgICBpZiAoZHVwbGljYXRlKSB7XG4gICAgICAgIGR1cEluZGV4ID0gY29sdW1ucy5pbmRleE9mKGR1cGxpY2F0ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgZHVwSW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgY29sdW1ucy5hcnJheUNvbnRlbnRXaWxsQ2hhbmdlKGR1cEluZGV4LCAxLCAwKTtcbiAgICAgICAgICBjb2x1bW5zLnNwbGljZShkdXBJbmRleCwgMSk7XG4gICAgICAgICAgdGhpcy5zZXQoJ2NvbnRlbnQnLCBjb2x1bW5zKTtcbiAgICAgICAgICBjb2x1bW5zLmFycmF5Q29udGVudERpZENoYW5nZShkdXBJbmRleCwgMSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKG1vZGlmaWVkSW5kZXggPiBjb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICBjb2x1bW5zLnB1c2hPYmplY3QoZHJvcHBlZCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29sdW1ucy5hcnJheUNvbnRlbnRXaWxsQ2hhbmdlKG1vZGlmaWVkSW5kZXgsIDAsIDEpO1xuICAgICAgICBjb2x1bW5zLnNwbGljZShtb2RpZmllZEluZGV4LCAwLCBkcm9wcGVkKTtcbiAgICAgICAgdGhpcy5zZXQoJ2NvbnRlbnQnLCBjb2x1bW5zKTtcbiAgICAgICAgY29sdW1ucy5hcnJheUNvbnRlbnREaWRDaGFuZ2UobW9kaWZpZWRJbmRleCwgMCwgMSk7XG4gICAgICB9XG4gICAgfSBcbiAgfSxcblxuICBhY3Rpb25zOiB7XG4gICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAoZXhpc3RpbmcsIGRyb3BwZWQpIHtcbiAgICAgIHRoaXMuaW5zZXJ0QXQoZXhpc3RpbmcsIGRyb3BwZWQsIDApOyAgXG4gICAgfSxcblxuICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbiAoZXhpc3RpbmcsIGRyb3BwZWQpIHtcbiAgICAgIHRoaXMuaW5zZXJ0QXQoZXhpc3RpbmcsIGRyb3BwZWQsIDEpOyAgXG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVGFibGVIZWFkZXJDb2xsZWN0aW9uO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIGNvbXBpbGVyID0gRW1iZXIuSGFuZGxlYmFycztcbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZXIudGVtcGxhdGUoZnVuY3Rpb24gYW5vbnltb3VzKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xudGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEVtYmVyLkhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gJyc7XG5cblxuICByZXR1cm4gYnVmZmVyO1xuICBcbn0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIGNvbXBpbGVyID0gRW1iZXIuSGFuZGxlYmFycztcbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZXIudGVtcGxhdGUoZnVuY3Rpb24gYW5vbnltb3VzKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xudGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEVtYmVyLkhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gJycsIHN0YWNrMSwgaGVscGVyLCBvcHRpb25zLCBzZWxmPXRoaXMsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSAnJywgc3RhY2sxO1xuICBkYXRhLmJ1ZmZlci5wdXNoKFwiXFxuICAgICAgPHRyPlxcbiAgICAgICAgXCIpO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIFwiXCIsIHtoYXNoOnt9LGhhc2hUeXBlczp7fSxoYXNoQ29udGV4dHM6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDIsIHByb2dyYW0yLCBkYXRhKSxjb250ZXh0czpbZGVwdGgwXSx0eXBlczpbXCJJRFwiXSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBkYXRhLmJ1ZmZlci5wdXNoKHN0YWNrMSk7IH1cbiAgZGF0YS5idWZmZXIucHVzaChcIlxcbiAgICAgIDwvdHI+XFxuICAgIFwiKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuZnVuY3Rpb24gcHJvZ3JhbTIoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSAnJywgc3RhY2sxO1xuICBkYXRhLmJ1ZmZlci5wdXNoKFwiXFxuICAgICAgICAgIDx0ZD5cIik7XG4gIHN0YWNrMSA9IGhlbHBlcnMuX3RyaWFnZU11c3RhY2hlLmNhbGwoZGVwdGgwLCBcIlwiLCB7aGFzaDp7fSxoYXNoVHlwZXM6e30saGFzaENvbnRleHRzOnt9LGNvbnRleHRzOltkZXB0aDBdLHR5cGVzOltcIklEXCJdLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGRhdGEuYnVmZmVyLnB1c2goc3RhY2sxKTsgfVxuICBkYXRhLmJ1ZmZlci5wdXNoKFwiPC90ZD5cXG4gICAgICAgIFwiKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG4gIGRhdGEuYnVmZmVyLnB1c2goZXNjYXBlRXhwcmVzc2lvbigoaGVscGVyID0gaGVscGVyc1snZGF0YS10YWJsZS1iaW4nXSB8fCAoZGVwdGgwICYmIGRlcHRoMFsnZGF0YS10YWJsZS1iaW4nXSksb3B0aW9ucz17aGFzaDp7XG4gICAgJ2NvbHVtbnMnOiAoXCJjb2x1bW5zTm90SW5IZWFkZXJcIiksXG4gICAgJ3ZpZXdOYW1lJzogKFwiYmluQ29tcG9uZW50XCIpXG4gIH0saGFzaFR5cGVzOnsnY29sdW1ucyc6IFwiSURcIiwndmlld05hbWUnOiBcIlNUUklOR1wifSxoYXNoQ29udGV4dHM6eydjb2x1bW5zJzogZGVwdGgwLCd2aWV3TmFtZSc6IGRlcHRoMH0sY29udGV4dHM6W10sdHlwZXM6W10sZGF0YTpkYXRhfSxoZWxwZXIgPyBoZWxwZXIuY2FsbChkZXB0aDAsIG9wdGlvbnMpIDogaGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCwgXCJkYXRhLXRhYmxlLWJpblwiLCBvcHRpb25zKSkpKTtcbiAgZGF0YS5idWZmZXIucHVzaChcIlxcbjx0YWJsZSBjbGFzcz1cXFwidGFibGUgdGFibGUtcmVzcG9uc2l2ZSB0YWJsZS1ob3ZlciB0YWJsZS1jb25kZW5zZWRcXFwiPlxcbiAgPHRoZWFkPlxcbiAgICBcIik7XG4gIGRhdGEuYnVmZmVyLnB1c2goZXNjYXBlRXhwcmVzc2lvbihoZWxwZXJzLnZpZXcuY2FsbChkZXB0aDAsIFwiZGF0YVRhYmxlSGVhZGVyXCIsIHtoYXNoOntcbiAgICAndmlld05hbWUnOiAoXCJjb2x1bW5Db2xsZWN0aW9uXCIpXG4gIH0saGFzaFR5cGVzOnsndmlld05hbWUnOiBcIlNUUklOR1wifSxoYXNoQ29udGV4dHM6eyd2aWV3TmFtZSc6IGRlcHRoMH0sY29udGV4dHM6W2RlcHRoMF0sdHlwZXM6W1wiSURcIl0sZGF0YTpkYXRhfSkpKTtcbiAgZGF0YS5idWZmZXIucHVzaChcIlxcbiAgPC90aGVhZD5cXG4gIDx0Ym9keT5cXG4gICAgXCIpO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIFwiZGF0YVwiLCB7aGFzaDp7fSxoYXNoVHlwZXM6e30saGFzaENvbnRleHRzOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgxLCBwcm9ncmFtMSwgZGF0YSksY29udGV4dHM6W2RlcHRoMF0sdHlwZXM6W1wiSURcIl0sZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgZGF0YS5idWZmZXIucHVzaChzdGFjazEpOyB9XG4gIGRhdGEuYnVmZmVyLnB1c2goXCJcXG4gIDwvdGJvZHk+XFxuPC90YWJsZT5cXG5cIik7XG4gIHJldHVybiBidWZmZXI7XG4gIFxufSk7XG4iLCJ2YXIgRGF0YVRhYmxlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9kYXRhLXRhYmxlL2NvbXBvbmVudCcpO1xudmFyIERhdGFUYWJsZUJpbkNvbXBvbmVudCA9IHJlcXVpcmUoJy4vZGF0YS10YWJsZS1iaW4vY29tcG9uZW50Jyk7XG52YXIgRGF0YVRhYmxlQ29sdW1uQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9kYXRhLXRhYmxlLWNvbHVtbi9jb21wb25lbnQnKTtcblxuRW1iZXIuQXBwbGljYXRpb24uaW5pdGlhbGl6ZXIoe1xuICBuYW1lOiAnZGF0YS10YWJsZScsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oY29udGFpbmVyLCBhcHBsaWNhdGlvbikge1xuICAgIGNvbnRhaW5lci5yZWdpc3RlcignY29tcG9uZW50OmRhdGEtdGFibGUnLCBEYXRhVGFibGVDb21wb25lbnQpO1xuICAgIGNvbnRhaW5lci5yZWdpc3RlcignY29tcG9uZW50OmRhdGEtdGFibGUtYmluJywgRGF0YVRhYmxlQmluQ29tcG9uZW50KTtcbiAgICBjb250YWluZXIucmVnaXN0ZXIoJ2NvbXBvbmVudDpkYXRhLXRhYmxlLWNvbHVtbicsIERhdGFUYWJsZUNvbHVtbkNvbXBvbmVudCk7XG4gIH1cbn0pO1xuIl19

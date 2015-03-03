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

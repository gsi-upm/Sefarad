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

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

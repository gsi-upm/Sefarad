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

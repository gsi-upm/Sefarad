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

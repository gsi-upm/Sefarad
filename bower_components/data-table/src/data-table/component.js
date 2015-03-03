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

/*var client = new $.es.Client({
  hosts: 'localhost:9200'
});
client.search({
  // undocumented params are appended to the query string
  index: 'bank',
  type: 'account',
  body: {
    query: { 
	"match_all": {
	} 
    }
  }
}).then(function (resp) {
  var resultsDough = [];
  var resultsPie = [];
  var hits = resp.hits.hits;
  console.log(hits);
  hits.forEach(function(entry) {
  	resultsDough.push(entry._source.balance);
	resultsPie.push(entry._source.age);
  });
  document.querySelector('chart-doughnut').setAttribute('values','['+resultsDough+']');
  document.querySelector('chart-pie').setAttribute('values','['+resultsPie+']');
}, function (error) {
  console.trace(error.message);
});
client.search({
  // undocumented params are appended to the query string
  index: 'twitter',
  type: 'tweets',
  body: {
    query: { 
	"match_all": {
	} 
    }
  }
}).then(function (resp) {
  var hits = resp.hits.hits;
  var resultsTweet = [];
  console.log(hits);
  hits.forEach(function(entry) {
	resultsTweet.push(entry._source.favorite_count);
  });
  document.querySelector('#favs').setAttribute('values','['+resultsTweet+']');
}, function (error) {
  console.trace(error.message);
});*/
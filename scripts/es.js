document.addEventListener('WebComponentsReady', function() {
        
        var ldfClientStreaming = document.querySelector('#ldf-client-streaming');
        // Process data as it appears
        ldfClientStreaming.addEventListener('ldf-query-streaming-response-partial',
            function(e) {
          var pre = document.createElement('pre');
          pre.classList.add('streaming');
          pre.textContent = JSON.stringify(e.detail.response);
          document.querySelector('#td2').appendChild(pre);
        });
        // Get notified once all data is received
        ldfClientStreaming.addEventListener('ldf-query-streaming-response-end', function() {
          alert('Received all data');
        });
      });

var array = [];
array.push({ term: {'sentiment': 'negative'}})
console.log(array)

var client = new $.es.Client({
          hosts: 'localhost:9200'
        });

      var id = this.extraId;
        client.search({
          // undocumented params are appended to the query string
          index: 'sentiment',
          type: 'tweet',
          body: {
            size: 10,
            query: {
              filtered: {
                filter: {
                  bool: {
                    should: array,
                  }
                }
              }
            },
            aggs: {
              rest: {
                terms: {
                  field: 'sentiment',
                  size: 5,
                  order: {
                    _count: "desc"
                  }
                }
              }
            }
          }
        }).then(function (resp) {
          console.log(resp)
        });
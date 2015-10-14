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
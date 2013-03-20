    function getBarChartConfig(renderId, title, cat, data) {
      var config = {};
      config.chart = {
        renderTo: renderId,
        backgroundColor: '#fff',
        plotShadow: false,
        type: 'column',
      };
      config.tooltip = {

      };				
      config.title = { margin: 10, 
       align: 'left',
       text: title,
       x: 15
     };
     config.xAxis = {
      categories: cat,
      labels: {
        rotation: -45,
        align: 'right',
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    };
    config.yAxis = {
      min: 0,
      title: {
        text: 'Coincidencias'
      }
    };

    config.legend = { enabled: false };

    config.series = [ { 
     name: 'Population',
     data: data,
     dataLabels: {
      enabled: true,
      rotation: -90,
      color: '#FFFFFF',
      align: 'right',
      x: -3,
      y: 10,
      formatter: function() {
        return this.y;
      },
      style: {
        fontSize: '13px',
        fontFamily: 'Verdana, sans-serif'
      }
    }			
  } ];

  return config;
};


function getPieChartConfig(renderId, title, data) {
   // format data
   data = cleanData(data); 
   console.log("GetPieChartConfig - data:");
   console.log(data);
   // Configuration
   var config = {};
   // chart 
   config.chart = {
      renderTo: renderId,
      backgroundColor: '#fff',
      plotBackgroundColor: '#fff',
      plotBorderWidth: null,
      plotShadow: false,
      height: 300,
      animation: {
         duration: 1000,
         easing: 'swing'	
      }
   };
   // title
   config.title = { 
      margin: 0, 
      align: 'left',
      text: title,
      x: 4
   };
   // tooltip hover
   config.tooltip = {
      pointFormat: '{series.name}: <b>{point.percentage}%</b>',
      percentageDecimals: 1
   };				
   // plot options
   config.plotOptions = {
      pie: {
         allowPointSelect: true,
         cursor: 'pointer',
         dataLabels: {
            enabled: true
         },
         point: {
            events: {
               legendItemClick: function() {
                  if (this.visible) {
                     this['y_old'] = this.y;
                     this.update(0, true, true);
                  }
                   else {
                     this.update(this.y_old, true, true);
                  }
               }
            }
         },
         series: {
			   animation: false //Problem only occurs when plotOptions animation:false
		    },					
         showInLegend: true
      }
   };
   // legend
   config.legend = { 
      enabled: true,
      layout: 'vertical',
      align: 'left',
      y:40,
      itemWidth: 100,
      verticalAlign: 'center',
      maxHeight: 160 
   };
   // data
   config.series = [{ 
      type: 'pie',
      name: 'Proporción',
      data: data 
   }];
   return config;
};

// We can improve the look of the chart if we remove superflous data. 
function cleanData(data) {
  console.log(data);
  var start = sharedStart(data);
  for (var i = 0; i < data.length; i++) {
    data[i][0] = data[i][0].replace(start, "");
    console.log(data[i][0]);
  }
  return data;
}

function sharedStart(A) {
  var tem1, tem2, s, A = A.slice(0).sort(function(a, b){
    var nameA=a[0].toLowerCase(), nameB=b[0].toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1 
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      })
   // var tem1, tem2, s, A = A.slice(0).sort();
   tem1 = A[0][0];
   s = tem1.length;
   tem2 = A.pop()[0];
   while(s && tem2.indexOf(tem1) == -1) {
    tem1 = tem1.substring(0, --s);
  }
  console.log("SHARED START:" + tem1 );
  return tem1;
}


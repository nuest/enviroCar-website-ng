


angular.module('app')
  .constant('dashboard',{
    type: 'user',
    comments: 'Number of Tracks',
    color: 'primary',
    url1: 'https://envirocar.org/api/stable/users/',
    numberoftracks: 5,
    urltracks: 'https://envirocar.org/api/stable/tracks/',
    urlredirect: '#/dashboard/chart/',
    charttype: 'multiBarHorizontalChart',
    chartheight: 450,
    duration: 300,
    yaxislabel: 'Values',
    format: ',.2f',
    urlusers: 'https://envirocar.org/api/stable/users/',
    urlco2stats: '/statistics/CO2',
    textco2: 'CO2(',
    urlspeedstats: '/statistics/Speed',
    textspeed: 'Speed(',
    urlconsstats: '/statistics/Consumption',
    textcons: 'Consumption(',
    key1: 'User Statistics',
    color1: '#d62728',
    // one strring
    urlcommonco2: 'https://envirocar.org/api/stable/statistics/CO2',
    urlcommonspeed: 'https://envirocar.org/api/stable/statistics/Speed',
    urlcommoncons: 'https://envirocar.org/api/stable/statistics/Consumption',
    key2: "Other User's Statistics",
    color2: '#1f77b4',


  });
angular.module('app')
 .controller('DashboardController',['$scope','$http','$rootScope','requesthomestats','requestgraphstats','dashboard',function($scope,$http,$rootScope,requesthomestats,requestgraphstats,dashboard)
  {
      $scope.events = [];
      var helperevents = [];
      console.log("came in dashboard controller");
      $scope.trial = "Further comparision insights on the way :)";
      $scope.type = dashboard.type;
      $scope.comments = dashboard.comments;
      $scope.colour = dashboard.color;
      var url1 = dashboard.url1;
      url1 = url1 + $rootScope.globals.currentUser.username + "/tracks";
      $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
      var timeline = {};
      console.log(url1);
      requesthomestats.get(url1).then(function(data)
      {
          $scope.number = data.data.tracks.length;
          var limit=0;
          if($scope.number >= dashboard.numberoftracks)
            limit = dashboard.numberoftracks;
          else
            limit = $scope.number;
            console.log(limit+"is limit")
          for(var i=0; i<limit; i++)
          {
            (function(cntr)
            {
                      var helper_events = {};
                      helper_events['id'] = data.data.tracks[cntr].id;
                      helper_events['title'] = data.data.tracks[cntr].name;
                      helper_events['urlredirect'] = dashboard.urlredirect + data.data.tracks[cntr].id;
                      helper_events['url'] = dashboard.urltracks + data.data.tracks[cntr].id+"/preview";
                      helper_events['modified'] = new Date(data.data.tracks[cntr].modified).toLocaleString();
                      if(cntr%2 == 0)
                      {
                        helper_events['side']='left'
                      }
                      else
                      {
                        helper_events['side']='right';
                      }
                      /*  requesthomestats.get(url1 + "/" + data.data.tracks[cntr].id).then(function(data2)
                      {
                        helper_events['carmodel'] = data2.data.properties.sensor.properties.model;
                        helper_events['length'] = data2.data.properties['length'].toFixed(2);
                        helper_events['starttime'] = new Date(data2.data.features[0].properties.time).toLocaleString();
                        helper_events['badgeIconClass'] = 'glyphicon-check';
                        helper_events['badgeClass'] = 'info';
                        console.log("came in track details");
                        data2.data['url'] = dashboard.urltracks + data2.data.properties.id+"/preview";
                        console.log(data2.data.properties['length'] = Number(data2.data.properties['length'].toFixed(2)));
                        if((cntr+1)%2 == 0)
                        {
                          data2.data['placement'] = 'direction-r';
                        }
                        else
                        {
                          data2.data['placement'] = 'direction-l';
                        }
                        timeline[data.data.tracks[cntr].id] = data2.data;
                        console.log(timeline);
                      })
                      */
                      helperevents.push(helper_events);
            })(i);
          }
          $scope.timelinevalues = timeline;
          console.log(timeline);
          console.log($scope.timelinevalues);
      });
      $scope.events = helperevents;
      //*******************************************************
      //*******************************************************
      //******************GRAPHS PART**************************
      $scope.options = {
              chart: {
                  type: dashboard.charttype,
                  height: dashboard.chartheight,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  showControls: false,
                  showValues: true,
                  duration: dashboard.duration,
                  xAxis: {
                      showMaxMin: true,
                      rotatelabels: -90
                  },
                  yAxis: {
                      axisLabel: dashboard.yaxislabel,
                      tickFormat: function(d){
                          return d3.format(dashboard.format)(d);
                      }
                  }
              }
          };
          var datausers = [];
          var dataotherusers =[];
            var url = dashboard.urlusers + $rootScope.globals.currentUser.username + dashboard.urlco2stats;
            requestgraphstats.get(url).then(function(data){
            console.log(data.data);
            var data = {
                  "label": dashboard.textco2 + data.data.phenomenon.unit+")",
                  "value": data.data.avg
               };
               datausers.push(data);
             });
            url = dashboard.urlusers+$rootScope.globals.currentUser.username + dashboard.urlspeedstats;
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": dashboard.textspeed + data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              datausers.push(data);
            });
            url = dashboard.urlusers+$rootScope.globals.currentUser.username + dashboard.urlconsstats;
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": dashboard.textcons+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              datausers.push(data);
            });
            var datacumulusers = {
              "key": dashboard.key1,
              "color": dashboard.color1,
              "values": datausers
            };
            url = dashboard.urlcommonco2;
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": dashboard.textco2 + data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              dataotherusers.push(data);
            });
            url = dashboard.urlcommonspeed;
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": dashboard.textspeed+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              dataotherusers.push(data);
            });
            url = dashboard.urlcommoncons;
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": dashboard.textcons+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              dataotherusers.push(data);
            });
            var datacumulotherusers = {
                "key": dashboard.key2,
                "color": dashboard.color2,
                "values": dataotherusers
              };
            $scope.data = [datacumulotherusers,datacumulusers];

  //**********************************************************
  //***********************END OF GRAPHS**********************

  //********************* START OF INSIGHTS*******************
  //**********************************************************
  /*
  var ratingco2;
  if(datausers[0].value<(dataotherusers[0].value*0.60))
  {
    ratingco2 = "+4";
  }
  else if(datausers[0].value<(dataotherusers[0].value*0.70))
  {
    ratingco2 = "+3";
  }
  else if(datausers[0].value<(dataotherusers[0].value*0.80))
  {
    ratingco2 = "+2";
  }
  else if(datausers[0].value<(dataotherusers[0].value*0.90))
  {
    ratingco2 = "+1";
  }
  else if(datausers[0].value>(dataotherusers[0].value))
  {
    ratingco2 = "-1";
  }
  else if(datausers[0].value>(dataotherusers[0].value*1.1))
  {
    ratingco2 = "-2";
  }
  else if(datausers[0].value>(dataotherusers[0].value*1.2))
  {
    ratingco2 = "-3";
  }
  else if(datausers[0].value>(dataotherusers[0].value*1.30))
  {
    ratingco2 = "-4";
  }
  var ratiospeed = datausers[2].value/dataotherusers[2].value;
  var ratioco2 = datausers[0].value/dataotherusers[0].value;
  var ratioconsumption = datausers[1].value/dataotherusers[1].value;
  var co2comments;
  var consumptionscomments;
if(ratioco2 < ratiospeed)
{
  co2comments = "Your CO2 consumption is optimal in comparision to your average speed";
}
*/
  }]);

  angular.module('app')
  .factory('requesthomestats',function($http){
    var get = function(url)
    {
      return $http.get(url).success(function(data){
        console.log(data);
        return data;
      })
    }
    return {
      get: get
    }
  });

  angular.module('app')
  .factory('requestgraphstats',function($http){
      var get = function(url) {
          return $http.get(url).success(function(data) {
          //console.log(data)
          return data;
        });
      }

      return {
        get: get
      }
    });
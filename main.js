angular.module('musicApp', ["pubnub.angular.service"])
  .controller('MusicController', musicController);
  
  // MusicController.$inject = ["$http"]; this causes thing to not work for some reason 
  
  function musicController($rootScope, $scope, Pubnub) {
    var ctrl = this; 
    ctrl.dictateIt = dictateIt; 
    ctrl.theText = "Press Record and Say Something";
    
    // On Click of a button
    function dictateIt() {
        ctrl.theText = "";
        // Construct the api function..
        var recognition = new webkitSpeechRecognition();
        //onresult property
        recognition.onresult = function (event) {
            $scope.$apply(function() {
            // resultIndex read-only property      
            for (var i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                // result event
                ctrl.theText  += event.results[i][0].transcript;
                }
            }
            });
        };
        recognition.start();
    };

    //example to http request 
    function getData(object){
        $http.get('https://tacos-ocecwkpxeq.now.sh/'+object.toString()).then(function(response){
            switch(object){
                case "shells":
                    ctrl.shells = response.data;
                    break;
                case "baselayers":
                    ctrl.baselayers = response.data;
                    break;
                case "mixins":
                    ctrl.mixins = response.data;
                    break;
                case "condiments":
                    ctrl.condiments = response.data;
                    break;
                case "seasonings":
                    ctrl.seasonings = response.data;
                    break;
                default:
                    break;
            }
            
        })
    }
};




 


   

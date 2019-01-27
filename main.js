angular.module('musicApp', ["pubnub.angular.service"])
  .controller('MusicController', musicController);
  
  // MusicController.$inject = ["$http"]; this causes thing to not work for some reason 
  
  function musicController($rootScope, $scope, Pubnub) {
    var ctrl = this; 
    ctrl.dictateIt = dictateIt; 
    ctrl.theText = "";
    ctrl.parseText = parseText; 
    ctrl.score;

    ctrl.onInit = init; 

    $scope.$watch("ctrl.theText", parseText);

    function init(){
        // Initialize the Noteflight client API.
        NFClient.init(function(info) {
        var options = {width: 650, height: 600};
        ctrl.score = new NFClient.ScoreView('score1','2f458252564f838c19b69d97153c0b608b64782d', options);
        });
    }
    
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

    function parseText(){
        if (ctrl.theText.indexOf("play")!== -1){
            ctrl.score.playFromMeasure(0);
        }
        if (ctrl.theText.indexOf("stop")!== -1){
            ctrl.score.stopPlayback();
        }
        if (ctrl.theText.indexOf("transpose")!== -1){
            transpose();
        }
    };

    function transpose(){
        var up = true;
        if (ctrl.theText.indexOf("down")!== -1){
            up = false;
        }
        var interval = ctrl.theText.replace(/^\D+/g, '').parseInt();
        if (!up){
            interval = 0-interval; 
        }
        alert("hi")
        ctrl.score.transpose({semitones: interval});
    }

    

    init(); 
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




 


   

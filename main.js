angular.module('musicApp', ["pubnub.angular.service"])
  .controller('MusicController', musicController);
  
  // MusicController.$inject = ["$http"]; this causes thing to not work for some reason 
  
  function musicController($rootScope, $scope, Pubnub) {
    var ctrl = this; 
    ctrl.dictateIt = dictateIt; 
    ctrl.theText = "";
    ctrl.parseText = parseText; 
    ctrl.history = [];
    ctrl.isPaused = false; 
    ctrl.toggle = toggle; 
    ctrl.score;

    ctrl.onInit = init; 

    $scope.$watch("ctrl.theText", function(oldevent, newevent){
        if(oldevent){
            ctrl.history.push(oldevent);
        }
        parseText();
    });

    function init(){
        // Initialize the Noteflight client API.
        NFClient.init(function(info) {
        var options = {width: 650, height: 300};
        ctrl.score = new NFClient.ScoreView('score1','4498660f18270084d372ffc0e58831c6515924f0', options);
        });
        ctrl.dictateIt();
    }

    function toggle(){
        if (ctrl.isPaused){
            ctrl.isPaused = false; 
            ctrl.dictateIt(); 
        }else{
            ctrl.isPaused = true; 
        }
        
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
                    if (ctrl.isPaused == false){
                        ctrl.theText  += event.results[i][0].transcript;
                    }
                }
            }
            });
        };
        recognition.start();
    };

    function parseText(){
        if (ctrl.theText.indexOf("play")!== -1){
            ctrl.score.playFromSelection();
        }
        if (ctrl.theText.indexOf("stop")!== -1){
            ctrl.score.stopPlayback();
        }
        if (ctrl.theText.indexOf("transpose")!== -1){
            transpose();
        }

        if (ctrl.theText.indexOf("speed up")!== -1){
            changeSpeed();
        }

        if (ctrl.theText.indexOf("measure")!== -1){
            playMeasure();
        } 

        if (ctrl.theText.indexOf("slow down")!== -1){
            slowDown();
        }
        if (ctrl.isPaused == false){
            ctrl.dictateIt();
        }
        if (ctrl.isPaused == true){
            ctrl.theText = "";
        }

    };

    function transpose(){
        var up = true;
        if (ctrl.theText.indexOf("down")!== -1){
            up = false;
        }
        var interval;
        
        var strings = ctrl.theText.split(" ");
        for (var i = 0; i<strings.length; i++){
            if (text2num(strings[i])>0){
                interval = text2num(strings[i]);
            }
        }
        
        if (!up){
            interval = 0-interval; 
        }
        ctrl.score.transpose({semitones: interval}, {resumePlayback: true});
    }

    function text2num(text){
        switch(text){
            case "one":
            case "1":
                return 1;
            case "two":
            case "to":
            case "2":
                return 2;
            case "three":
            case "3":
                return 3;
            case "four":
            case "4":
                return 4;
            case "five":
            case "5":
                return 5;
            case "six":
            case "6":
                return 6;
            case "seven":
            case "7":
                return 7;
            case "eight":
            case"8":
                return 8;
            case "nine":
            case "9":
                return 9;
            case "ten":
            case"10":
                return 10;
            case "eleven":
            case "11":
                return 11;
            case "twelve":
            case "12":
                return 12;
            default:
                return -1;

        }
    }

    function changeSpeed(){
    	ctrl.score.setPlaybackSpeed(1);
    	ctrl.score.playFromMeasure(0);
    }

    function playMeasure(){
        var measure;
    	var strings = ctrl.theText.split(" ");
        for (var i = 0; i<strings.length; i++){
            if (text2num(strings[i])>0){
                measure = text2num(strings[i]);
            }
        }
        ctrl.score.playFromMeasure(measure);
    }

    function slowDown(){
        ctrl.score.setPlaybackSpeed(-1);
        ctrl.score.playFromMeasure(0);
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
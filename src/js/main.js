var angular = require('angular');
var app = angular.module('app', []);
app.controller('myController', function ($scope, $timeout, QueueService) {
    var audio, manifest = [
        {
            id: "sound",
            src: "./res/text1.wav"
        },
        {
            id: "sound2",
            src: "./res/start_count_down.m4a"
        }
    ];
    $scope.init = function () {
        console.log("init");
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
        QueueService.loadManifest(manifest);
        console.log("support: " + createjs.HTMLAudioPlugin.isSupported());
    };
    $scope.$on('queueProgress', function (event, queueProgress) {
        console.log($scope.$root.$$phase);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
        console.log(event);
    });
    $scope.$on('queueComplete', function (event, manifest) {
        $scope.$apply(function () {
            console.log("queueComplete");
            console.log(event);
            $scope.bgm = createjs.Sound.createInstance(manifest[0].id);
            $scope.bgm.addEventListener("complete", function () {
                audio.playbackRate = 1.0;
            });
        });
    });
    $scope.outerClick = function () {
        console.log("outerClick");
    };
    $scope.play = function () {
        console.log("playAudio");
        $scope.bgm.play();
        if (audio === undefined) {
            audio = document.querySelector("audio");
        }
    };
    $scope.stop = function () {
        console.log("stopAudio");
        $scope.bgm.stop();
    };
    $scope.next = function () {
        console.log("next");
        $scope.bgm.stop();
    };
    $scope.slow = function () {
        if ($scope.getAudioPlaybackRate() == 0.8) {
            $scope.setAudioPlaybackRate(0.6);
        }
        else {
            $scope.setAudioPlaybackRate(0.8);
        }
    };
    $scope.normal = function () {
        $scope.setAudioPlaybackRate(1.0);
    };
    $scope.fast = function () {
        if ($scope.getAudioPlaybackRate() == 1.2) {
            $scope.setAudioPlaybackRate(1.4);
        }
        else {
            $scope.setAudioPlaybackRate(1.2);
        }
    };
    $scope.cueing = function () {
        $scope.bgm.stop();
        $scope.bgm.play();
    };
    $scope.getAudioPlaybackRate = function () {
        return audio.playbackRate;
    };
    $scope.setAudioPlaybackRate = function (rate) {
        console.log("setAudioPlaybackRate: " + rate);
        audio.playbackRate = rate;
    };
});
app.factory('QueueService', function ($rootScope) {
    var queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    function loadManifest(manifest) {
        console.log("QueueService:loadManifest");
        queue.loadManifest(manifest);
        queue.on('progress', function (event) {
            console.log("on:progress");
            $rootScope.$broadcast('queueProgress', event);
        });
        queue.on('complete', function () {
            console.log("on:complete");
            $rootScope.$broadcast('queueComplete', manifest);
        });
        console.log(queue);
    }
    return {
        loadManifest: loadManifest
    };
});

/// <reference path="./typings/tsd.d.ts" />

import $ = require('jquery');
import angular = require('angular');

var app = angular.module('app', []);

app.controller('myController', ($scope, $timeout, QueueService) => {
    var audio:any,
        manifest = [
            {
                id: "sound",
                src: "./res/text1.wav"
            },
            {
                id: "sound2",
                src: "./res/start_count_down.m4a"
            }
        ];

    $scope.init = () => {
        console.log("init");
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
        QueueService.loadManifest(manifest);

        console.log("support: " + createjs.HTMLAudioPlugin.isSupported());
    };

    $scope.$on('queueProgress', (event, queueProgress) => {
        console.log($scope.$root.$$phase);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

        console.log(event);
    });

    $scope.$on('queueComplete', (event, manifest) => {
        $scope.$apply(() => {
            console.log("queueComplete");
            console.log(event);
            $scope.bgm = createjs.Sound.createInstance(manifest[0].id);

            $scope.bgm.addEventListener("complete", function () {
                audio.playbackRate = 1.0;
            });
        });
    });

    $scope.outerClick = () => {
        console.log("outerClick");
    };

    $scope.play = () => {
        console.log("playAudio");
        $scope.bgm.play();
        if (audio === undefined) {
            audio = document.querySelector("audio");
        }
    };

    $scope.stop = () => {
        console.log("stopAudio");
        $scope.bgm.stop();
    };

    $scope.next = () => {
        console.log("next");
        $scope.bgm.stop();
    };


    $scope.slow = () => {
        if ($scope.getAudioPlaybackRate() == 0.8) {
            $scope.setAudioPlaybackRate(0.6);
        } else {
            $scope.setAudioPlaybackRate(0.8);
        }
    };

    $scope.normal = () => {
        $scope.setAudioPlaybackRate(1.0);
    };

    $scope.fast = () => {
        if ($scope.getAudioPlaybackRate() == 1.2) {
            $scope.setAudioPlaybackRate(1.4);
        } else {
            $scope.setAudioPlaybackRate(1.2);
        }
    };

    $scope.cueing = () => {
        $scope.bgm.stop();
        $scope.bgm.play();
    };

    $scope.getAudioPlaybackRate = ():number => {
        return audio.playbackRate;
    };

    $scope.setAudioPlaybackRate = (rate:number):void => {
        console.log("setAudioPlaybackRate: " + rate);
        audio.playbackRate = rate;
    };
});

app.factory('QueueService', ($rootScope) => {

    var queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);

    function loadManifest(manifest) {
        console.log("QueueService:loadManifest");

        queue.loadManifest(manifest);

        queue.on('progress', (event) => {
            console.log("on:progress");
            $rootScope.$broadcast('queueProgress', event);
        });

        queue.on('complete', () => {
            console.log("on:complete");
            $rootScope.$broadcast('queueComplete', manifest);
        });

        console.log(queue);
    }

    return {
        loadManifest: loadManifest
    }
});


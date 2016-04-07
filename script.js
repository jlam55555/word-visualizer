angular.module("app", [])
	.controller("MainController", function($scope) {
  	var uiDefault = {
      fontHeight: 0,
      word: "Google",
      brightenBy: 64,
      colors: ["#0266C8", "#F90101", "#F2B50F", "#00933B"],
      bold: false,
      italic: false,
      fontFamily: "times new roman",
      width: 400,
      height: 200
    };
    var canvas = document.querySelector("canvas");
  	var ctx = canvas.getContext("2d");
    $scope.ui = JSON.parse(JSON.stringify(uiDefault));
    $scope.autoSize = function() {
    	$scope.ui.fontHeight = 1;
      ctx.font = getFont();
    	while(ctx.measureText($scope.ui.word).width <= $scope.ui.width && $scope.ui.fontHeight <= $scope.ui.height) {
        $scope.ui.fontHeight++;
        ctx.font = getFont();
      }
      $scope.ui.fontHeight--;
      ctx.font = getFont();
    };
    $scope.reset = function() {
    	$scope.ui = JSON.parse(JSON.stringify(uiDefault));
      $scope.autoSize();
    };
    $scope.removeColor = function(index) {
    	$scope.ui.colors.splice(index, 1);
      if($scope.ui.colors.length == 0)
      	$scope.ui.colors.push("#000000");
    };
    $scope.newColor = "000000";
    $scope.addColor = function() {
    	if($scope.newColor.length != 6)
      	return;
      for(var i = 0; i < 6; i++) {
      	if(
        	$scope.newColor.charCodeAt(i) > 102 ||
          $scope.newColor.charCodeAt(i) < 48 ||
          ($scope.newColor.charCodeAt(i) < 65 && $scope.newColor.charCodeAt(i) > 57) ||
          ($scope.newColor.charCodeAt(i) < 97 && $scope.newColor.charCodeAt(i) > 70)
        )
        	return;
      }
    	$scope.ui.colors.push("#" + $scope.newColor);
    	$scope.newColor = "000000";
    };
    $scope.download = function(link) {
    	var link = document.querySelector("a#downloadButton");
    	link.href = canvas.toDataURL();
      link.download = "THLWORD-" + $scope.ui.word + ".png";
      console.log(link.innerHTML);
    };
    var getFont = function() {
      return ($scope.ui.italic ? "italic " : "") + ($scope.ui.bold ? "bold " : "") + $scope.ui.fontHeight + "px " + $scope.ui.fontFamily;
    };
    var brighten = function(color, amount) {
      var brightened = "#";
      for(var i = 0; i < 3; i++) {
        var colorDec = parseInt(color.substring(i*2+1,i*2+3),16);
        var newColor = colorDec + parseInt(amount) > 255 ? 255 : (colorDec + parseInt(amount));
        var newColorHex = newColor.toString(16);
        brightened += newColorHex.length == 1 ? "0" + newColorHex : newColorHex;
      }
      return brightened;
    };
    var draw = function() {
      canvas.height = $scope.ui.height;
      canvas.width = $scope.ui.width;
      ctx.font = getFont();
      ctx.textBaseline = "middle";
      var wordWidth = ctx.measureText($scope.ui.word).width;
      var colorIndex = 0;
      var left = $scope.ui.width/2-wordWidth/2;
      var top = $scope.ui.height/2;
      for(var i = 0; i < $scope.ui.word.length; i++) {
        var letter = $scope.ui.word[i];
        var gradient = ctx.createLinearGradient(left, top-$scope.ui.fontHeight/2, left+ctx.measureText(letter).width, top+$scope.ui.fontHeight/2);
        gradient.addColorStop(0, brighten($scope.ui.colors[colorIndex], $scope.ui.brightenBy));
        gradient.addColorStop(1, $scope.ui.colors[colorIndex]);
        ctx.fillStyle = gradient;
        colorIndex = (colorIndex + 1 < $scope.ui.colors.length) ? colorIndex+1 : 0;
        ctx.fillText(letter, left, top);
        left += ctx.measureText(letter).width;
      }
    };
   	draw();
    $scope.autoSize();
    $scope.$watch(function() {
    	draw();
    });
  });

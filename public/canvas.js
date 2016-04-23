/*eslint-env browser */
var Canvas = function() {
    
    _canvasObj,
    _canvasCtx,
    WIDTH,    
    HEIGHT,
    canvasMinX,
    canvasMaxX,
    canvasMinY,
    canvasMaxY;
    
    
    // right
    this.player1 = {
        x : 0,
        y : 0
    },
    // left
    this.player2 = {
        x : 0,
        y : 0
    },
    
    _setLimits = function () {
        canvasMinX = _canvasObj.offsetLeft;
        canvasMaxX = canvasMinX + _canvasObj.width;
        canvasMinY = _canvasObj.offsetTop;
        canvasMaxY = canvasMinY + _canvasObj.height;
    }
    
    function clearCanvas() {
	_canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    
    
    
    this.draw() = function(){
    	//Draw everything
    	
    	
    }
    
    
    _canvasObj = document.getElementById('playerCanvas');
    WIDTH = _canvasObj.width;
    HEIGHT = _canvasObj.height;

    _canvasCtx = _canvasObj.getContext("2d");

    this.obj = _canvasObj;
    this.ctx = _canvasCtx;
    
}

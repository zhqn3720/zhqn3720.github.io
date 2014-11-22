/**
 * Created by Simple on 2014年5月20日.
 */

/**
 * Main
 */
var board = new Array(),
    score = 0,
    bast = 0,
    hasConflicted = new Array(),
    //捕捉触摸位置
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0;

$(document).ready(function () {
    if (window.localStorage) {
        bast = localStorage.getItem("bast") == null ? 0 : localStorage.getItem("bast");
    } else {
        bast = getCookie("bast") == null ? 0 : getCookie("bast");
    }
    prepareForMobile();
    newGame();

    if (navigator.appName == "Microsoft Internet Explorer") {
        var version = navigator.appVersion,
            ms = parseInt(version.substr(version.indexOf("MSIE ") + 5, 3));
        if (ms < 9) {
            window.attachEvent('touchstart', function (event) {
                startX = event.touches[0].pageX;
                startY = event.touches[0].pageY;
            });
            document.attachEvent('touchmove', function (event) {
                event.preventDefault();
            });
            document.attachEvent('touchend', function (event) {

                touched(event);
            });
        }
    } else {
        /**
         * 触摸事件监听
         */

        document.addEventListener('touchstart', function (event) {
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
        });
        document.addEventListener('touchmove', function (event) {
            event.preventDefault();
        });
        document.addEventListener('touchend', function (event) {
            touched(event);

        });

    }
});

function touched(event) {
    //changedTouches 触摸状态改变
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;
    /***
     * 屏幕中Y轴向下是正方向
     */
    var deltaX = endX - startX,
        deltaY = endY - startY;

    if (Math.abs(deltaX) < 0.3 * documentWidth && Math.abs(deltaY) < 0.3 * documentWidth)
        return;
    //X
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        if (deltaX > 0) {
            //moveRight
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        } else {
            //moveLeft
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
    }
    //Y
    else {
        if (deltaY > 0) {
            //moveDown
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        } else {
            //moveUp
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }

        }
    }
}

function prepareForMobile() {
    if (documentWidth > 500) {
        gridContainerWidth = 410;
        cellSpace = 10;
        cellSideLength = 90;
    }
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-raidus', 0.02 * cellSideLength);
}

function newGame() {
    //初始化棋盘格
    init();

    //再在随机两个格子内生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            var cell = $("#grid-cell-" + i + "-" + j);
            cell.css('top', getPosTop(i, j));
            cell.css('left', getPosLeft(i, j));
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    score = 0;
    updateBoardView();
}

function updateBoardView() {

    $(".number-cell").remove();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div');
            var thisNumberCell = $("#number-cell-" + i + "-" + j);

            if (board[i][j] == 0) {
                thisNumberCell.css('width', '0px');
                thisNumberCell.css('height', '0px');
                thisNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                thisNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                thisNumberCell.css('width', cellSideLength);
                thisNumberCell.css('height', cellSideLength);
                thisNumberCell.css('top', getPosTop(i, j));
                thisNumberCell.css('left', getPosLeft(i, j));
                thisNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                thisNumberCell.css('color', getNumberColor(board[i][j]));
                thisNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.4 * cellSideLength + 'px');
    updateScore(score);
}

function generateOneNumber() {
    if (noSpace(board)) return false;
    //随机一个位置
    var randX = parseInt(Math.floor(Math.random() * 4));
    var randY = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50) {
        if (board[randX][randY] == 0) break;

        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                if (board[i][j] == 0) {
                    randX = i;
                    randY = j;
                }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    randNumber = parseInt(score) > 1024 ? 2 : randNumber;

    //在随机位置显示随机数字
    board[randX][randY] = randNumber;

    showNumberWithAnimation(randX, randY, randNumber);

    return true;
}

$(document).keydown(function (event) {
    switch (event.keyCode) {
    case 37: //Left
        event.preventDefault(); //阻止原本的按键默认效果
        if (moveLeft()) {
            setTimeout("generateOneNumber()", 210);
            setTimeout("isGameOver()", 300);
        }
        break;
    case 38: //Up
        event.preventDefault(); //阻止原本的按键默认效果
        if (moveUp()) {
            setTimeout("generateOneNumber()", 210);
            setTimeout("isGameOver()", 300);
        }
        break;
    case 39: //Right
        event.preventDefault(); //阻止原本的按键默认效果
        if (moveRight()) {
            setTimeout("generateOneNumber()", 210);
            setTimeout("isGameOver()", 300);
        }
        break;
    case 40: //Down
        event.preventDefault(); //阻止原本的按键默认效果
        if (moveDown()) {
            setTimeout("generateOneNumber()", 210);
            setTimeout("isGameOver()", 300);
        }
        break;
    default: //Default
        break;
    }
});

function isGameOver() {
    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}

function gameOver() {
    if (window.localStorage) {
        localStorage.setItem("bast", bast);
    } else {
        setCookie("bast", bast);
    }
    showTips("革命尚未成功<br/>同志仍需努力");
}

function moveLeft() {
    if (!canMoveLeft(board)) return false;
    //moveLeft
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) return false;
    //moveUp
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) return false;
    //moveUp
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) return false;
    //moveUp
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}


/**
 * Support
 */
//相对尺寸设计
var documentWidth = window.screen.availWidth, //当前设备屏幕的宽度
    gridContainerWidth = 0.92 * documentWidth, //大容器的宽度
    cellSideLength = 0.18 * documentWidth, //小方块的边长
    cellSpace = 0.04 * documentWidth; //小方块间距


function getPosTop(i, j) {
    return cellSpace + i * (cellSpace + cellSideLength);
}

function getPosLeft(i, j) {
    return cellSpace + j * (cellSpace + cellSideLength);
}

function getNumberBackgroundColor(number) {
    switch (number) {
    case 2:
        return "#eee4da";
        break;
    case 4:
        return "#ede0c8";
        break;
    case 8:
        return "#f2b179";
        break;
    case 16:
        return "#f59563";
        break;
    case 32:
        return "#f67c5f";
        break;
    case 64:
        return "#f65e3b";
        break;
    case 128:
        return "#edcf72";
        break;
    case 256:
        return "#edcc61";
        break;
    case 512:
        return "#9c0";
        break;
    case 1024:
        return "#33b5e5";
        break;
    case 2048:
        return "#00c";
        break;
    case 4096:
        return "#93c";
        break;
    }
    return "black";
}

function getNumberColor(number) {
    if (number <= 4) return "#776e65";
    return "white";
}

function noSpace(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) return false;
        }
    return true;
}

function canMoveLeft(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0)
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                    return true;
    return false;
}

function canMoveUp(board) {
    for (var i = 1; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] != 0)
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                    return true;
    return false;
}

function canMoveRight(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--)
            if (board[i][j] != 0)
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                    return true;
    return false;
}

function canMoveDown(board) {
    for (var i = 2; i >= 0; i--)
        for (var j = 0; j < 4; j++)
            if (board[i][j] != 0)
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                    return true;
    return false;
}
/**
 * 判断横向是否有障碍物
 * @param row
 * @param col1
 * @param col2
 * @param board
 * @returns {boolean}
 */
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++)
        if (board[row][i] != 0) return false;
    return true;
}
/**
 * 判断纵向是否有障碍物
 * @param col
 * @param row1
 * @param row2
 * @param board
 * @returns {boolean}
 */
function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++)
        if (board[i][col] != 0) return false;
    return true;
}

function noMove() {
    if (canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board))
        return false;
    return true;
}

function setCookie(name, value) //两个参数，一个是cookie的名字，一个是值

{

    var Days = 30; //此 cookie 将被保存 30 天

    var exp = new Date(); //new Date("December 31, 9998");

    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);

    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();

}

function getCookie(name) //取cookies函数        

{

    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));

    if (arr != null) return unescape(arr[2]);
    return null;



}

function delCookie(name) //删除cookie

{

    var exp = new Date();

    exp.setTime(exp.getTime() - 1);

    var cval = getCookie(name);

    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();

}


/**
 * showAnimation
 */
function showNumberWithAnimation(i, j, number) {
    var numberCell = $("#number-cell-" + i + "-" + j);

    numberCell.css('background-color', getNumberBackgroundColor(number));
    numberCell.css('color', getNumberColor(number));
    numberCell.text(number);

    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}

function showMoveAnimation(fromX, fromY, toX, toY) {
    var numberCell = $("#number-cell-" + fromX + "-" + fromY);
    numberCell.animate({
        top: getPosTop(toX, toY),
        left: getPosLeft(toX, toY)
    }, 200);

}

function updateScore(score) {
    $("#score").text(score);
    if (score > bast) bast = score;
    $("#bast").text(bast)
}

function showTips(text) {

    var sHeight = document.body.scrollHeight,
        sWidth = document.body.scrollWidth,
        cHeight = document.body.clientHeight;
    var mask = document.createElement("div");
    mask.id = "mask";
    mask.style.height = sHeight + "px";
    mask.style.width = sWidth + "px";
    document.body.appendChild(mask);
    var tips = document.createElement("div");
    tips.id = "tips";
    document.body.appendChild(tips);

    tips.style.top = cHeight / 2 - tips.offsetHeight / 2 + "px";
    tips.style.left = sWidth / 2 - tips.offsetWidth / 2 + "px";
    tips.innerHTML = text;

    mask.onclick = function () {
        document.body.removeChild(mask);
        document.body.removeChild(tips);
    };
    setTimeout(function () {
        document.body.removeChild(mask);
        document.body.removeChild(tips);
    }, 1500);


}
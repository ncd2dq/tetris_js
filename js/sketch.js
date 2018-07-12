let Canvas_Width = 600;
let Canvas_Height = 600;

let game_board;

function setup(){
    createCanvas(Canvas_Width, Canvas_Height);
    game_board = new GameBoard();
    
}


function draw(){
    background(0, 0, 0);
    game_board.run();
}


function keyPressed(){
    //down right up left space
    //40  39  38  37  32
    if(keyCode == 40){
        game_board.focus_piece.move_down();
        
    } else if (keyCode == 39){
        game_board.focus_piece.move_right();
    } else if (keyCode == 38){

    } else if (keyCode == 37){
        game_board.focus_piece.move_left();
    } else if (keyCode == 32){
        game_board.focus_piece.rotate();
    }
}

function keyReleased(){
    
}
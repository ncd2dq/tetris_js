let Canvas_Width = 600;
let Canvas_Height = 600;

let game_board;
let sliding = false;
let slide_timer = 0;

let backgrond_sound;


function preload(){
    soundFormats('mp3');
    background_sound = loadSound("assets/backtrack.mp3");
    background_sound.setVolume(0.6);
}

function setup(){
    createCanvas(Canvas_Width, Canvas_Height);
    game_board = new GameBoard();
    
    if(background_sound.isLoaded()){
        background_sound.loop();
    }
}


function draw(){
    background(0, 0, 0);
    game_board.run();
    console.log(slide_timer);
    
    if(slide_timer == 25 && frameCount % 2 == 0){
        game_board.move('down');
        console.log('slide');
    }
    if(sliding && slide_timer < 25){
        slide_timer++;
    }
}


function keyPressed(){
    //down right up left space
    //40  39  38  37  32
    if(keyCode == 40){
        game_board.move('down')
        sliding = true;
        
    } else if (keyCode == 39){
        game_board.move('right');
    } else if (keyCode == 38){

    } else if (keyCode == 37){
        game_board.move('left');
    } else if (keyCode == 32){
        game_board.focus_piece.rotate();
    }
}

function keyReleased(){
    if(keyCode == 40){
        sliding = false;
        slide_timer = 0;
    }
}
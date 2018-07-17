let Canvas_Width = 400; 
let Canvas_Height = 600;
let real_width = 600;

let game_board;
let sliding_down = false;
let sliding_right = false;
let sliding_left = false;
let slide_timer = 0;

let backgrond_sound;
let place_block_sound;
let clear_row_sound;

let score = 0;


function preload(){
    soundFormats('mp3');
    
    background_sound = loadSound("assets/backtrack.mp3");
    background_sound.setVolume(0.6);
    
    place_block_sound = loadSound("assets/place_block.mp3");
    place_block_sound.setVolume(0.7);
    
    clear_row_sound = loadSound("assets/clear_row.mp3");
    clear_row_sound.setVolume(0.4);
}

function setup(){
    createCanvas(real_width, Canvas_Height);
    game_board = new GameBoard();
    
    if(background_sound.isLoaded()){
        background_sound.loop();
    }
}


function draw(){
    background(0, 0, 0);
    fill(255, 255, 255);
    stroke(100);
    strokeWeight(5);
    rect(Canvas_Width + 1, 0, real_width - Canvas_Width, Canvas_Height);
    game_board.run();
    
    if(slide_timer == 25 && frameCount % 2 == 0){
        if(sliding_down){
            game_board.move('down');
        } else if(sliding_right){
            game_board.move('right'); 
        } else if (sliding_left){
            game_board.move('left'); 
        }
    }
    if((sliding_down || sliding_left || sliding_right) && slide_timer < 25){
        slide_timer++;
    }
    display_score();
}


function keyPressed(){
    //down right up left space
    //40  39  38  37  32
    if(keyCode == 40){ //down
        game_board.move('down')
        sliding_down = true;
        
    } else if (keyCode == 39){ //right
        game_board.move('right');
        sliding_right = true;
    } else if (keyCode == 38){ //up
        game_board.rotate();
    } else if (keyCode == 37){ //left
        game_board.move('left');
        sliding_left = true;
    } else if (keyCode == 32){ //space
        game_board.instant_down();
    } else if(keyCode == 16){ //shift
        game_board.swap_piece();
    }
}

function keyReleased(){
    if(keyCode == 40){
        sliding_down = false;
        slide_timer = 0;
    } else if (keyCode == 39){
        sliding_right = false;
        slide_timer = 0;
    } else if(keyCode == 37){
        sliding_left = false;
        slide_timer = 0;
    }
}

function display_score(){
    textSize(25);
    stroke(0);
    strokeWeight(2);
    fill(0, 255, 0);
    text("Score: " + score, Canvas_Width + (real_width - Canvas_Width) / 4 - 35, 30);
}
class Game{
    constructor(){
        this.pause = false;
        this.show_instructions = false;
        this.score = 0;
        this.level = 1;
    }
    
    instructions(){
        textSize(15);
        fill(0, 255, 0);
        text("Use Left, Right, Down to move pieces", 20, 50);
        text("Press SpaceBar to instantly drop a piece", 20, 70);
        text("Press Up to rotate your piece", 20, 90);
        text("Press Shift to store / swap a piece", 20, 110);
    }
    
    score(){
        
    }
    
    level_up(){
        if(game_board.force_down_time >= 6){
            game_board.force_down_time -= 5;
        } else if(game_board.force_down_time >= 2){
            game_board.force_down_time--;
        }
    }
    
    run(){
        
    }
}
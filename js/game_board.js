//5 == solidified piece
//1 == focus piece
//2 = preview piece

class GameBoard{
    constructor(){
        this.max_w = 10;
        this.max_h = 20; 
        
        this.game_board = this.create_game_board();
        this.pieces_dict = this.create_pieces_dict();
        
        this.width = Canvas_Width / this.max_w;
        this.height = Canvas_Height / this.max_h;
        this.timer = 0;
        //this.current_pieces = [];
        this.focus_piece = this.choose_piece();
        this.preview_piece = this.create_preview();
        
        this.saved_pieces_dict = this.create_saved_dict();
        this.saved_piece = false;
        
        this.already_saved = false;
        
        this.up_coming_pieces = [];
        
        for(let i = 0; i < 4; i ++){
            this.up_coming_pieces.push(this.choose_piece());
        }
        
        this.force_down_time = 75;
    }
    
    choose_piece(){
        let new_piece_name = random(['T', 'SQ', 'S_L', 'S_R', 'L_L', 'L_R', 'L']);
        let new_rotation = random([0, 90, 180, 270]);
        let actual_piece_list = this.pieces_dict[new_piece_name][new_rotation];
        
        let piece_obj = new Piece(actual_piece_list, new_piece_name, new_rotation, this.pieces_dict[new_piece_name], this.max_h, this.max_w);
        return piece_obj;
    }
    
    create_preview(){
        let preview = new Piece(this.focus_piece.piece['type'], this.focus_piece.piece['name'], this.focus_piece.piece['rotation'], false, false, false);
        preview.piece['x'] = this.focus_piece.piece['x'];
        preview.piece['y'] = this.focus_piece.piece['y'];
        
        let find_bot = false;
        let store_x = this.focus_piece.piece['x'];
        let store_y = this.focus_piece.piece['y'];
        while(!find_bot){
            find_bot = this.move('down', true);
        }
        preview.piece['x'] = this.focus_piece.piece['x'];
        preview.piece['y'] = this.focus_piece.piece['y'];
        
        this.focus_piece.piece['x'] = store_x;
        this.focus_piece.piece['y'] = store_y;

        return preview;
    }
    
    include_preview_piece(){
        let x = this.preview_piece.piece['x'];
        let y = this.preview_piece.piece['y'];

        for(let j = 0; j < this.preview_piece.piece['type'].length; j++){
            for(let i = 0; i < this.preview_piece.piece['type'][0].length; i++){
                if(this.preview_piece.piece['type'][j][i] == 1){
                    this.game_board[j + y][i + x] = 2;
                }
            }
        }
    }
    
    //NEW METHOD TO TRY AND GET INDIVIDUAL BLOCKS
    include_new_piece(piece){
        let y = piece.piece['y'];
        let x = piece.piece['x'];
        for(let j = 0; j < piece.piece['type'].length; j++){
            for(let k = 0; k < piece.piece['type'][0].length; k++){
                if(piece.piece['type'][j][k] == 1){
                    this.game_board[j + y][k + x] = 5;
                }
            }
        }
    }
    
    reset(){
        for(let j = 0; j < this.game_board.length; j++){
            for(let i = 0; i < this.game_board[0].length; i ++){
                if(this.game_board[j][i] == 1 || this.game_board[j][i] == 2){
                    this.game_board[j][i] = 0;
                }
            }
        }
    }
    
    _try_draw_focus(x_dir, y_dir, future_rotation, x_p, y_p){
        
        let x;
        let y;
        let piece;

        if(future_rotation){
            x = x_p + x_dir;
            y = y_p + y_dir;
            piece = future_rotation;
            
            let x_len = piece[0].length;
            let y_len = piece.length;
            if(x + x_len > this.max_w || x < 0 || y + y_len > this.max_h || y + y_len < 0){
                return false;
            }
        } else {
            x = this.focus_piece.piece['x'] + x_dir;
            y = this.focus_piece.piece['y'] + y_dir;
            piece = this.focus_piece.piece['type'];
        }

        for(let i = 0; i < piece.length; i++){
            for(let j = 0; j < piece[0].length; j++){
                if(this.game_board[i + y][j + x] == 5 && piece[i][j] == 1){
                    return false;
                }   
            }
        }
        return true;
    }
    
    _try_rotate(){
        let future_piece;
        if(this.focus_piece.piece['rotation'] == 0){
            future_piece = this.focus_piece.rotation_variations[90];
            
        } else if(this.focus_piece.piece['rotation'] == 90){
            future_piece = this.focus_piece.rotation_variations[180];
            
        } else if(this.focus_piece.piece['rotation'] == 180){
            future_piece = this.focus_piece.rotation_variations[270];
            
        }  else if(this.focus_piece.piece['rotation'] == 270){
            future_piece = this.focus_piece.rotation_variations[0];
            
        }
        let result = this._try_draw_focus(0, 0, future_piece, this.focus_piece.piece['x'], this.focus_piece.piece['y']);

        return result;
    }
    
    rotate(){
        if(this._try_rotate()){
            this.focus_piece.rotate()
            this.preview_piece = this.create_preview();
        }
    }
    
    instant_down(){
        let find_bot = false;
        while(!find_bot){
            if(this._try_move_focus(0, 1) && this._try_draw_focus(0, 1)){
                this.focus_piece.move_down();
            } else {
                find_bot = true;
            }
        }
        
        this.include_new_piece(this.focus_piece);
        //this.focus_piece = this.choose_piece();
        //UPDATE HERE
        this.focus_piece = this.up_coming_pieces[0];
        this.check_game_over();
        this.up_coming_pieces.splice(0, 1);
        this.up_coming_pieces.push(this.choose_piece());
        
        this.preview_piece = this.create_preview();
        this.already_saved = false;
        this.clear_floor();
        score += 5;
        
        place_block_sound.play();
    }
    
    move(dir, preview){
        if(dir == 'down'){
            if(this._try_move_focus(0, 1) && this._try_draw_focus(0, 1)){
                this.focus_piece.move_down();
                if(preview){
                    return false;
                } else {
                    this.timer = 0;
                }
            } else {
                if(preview){
                    return true;
                } else {
                    //this.current_pieces.push(this.focus_piece);
                    this.include_new_piece(this.focus_piece);
                    //this.focus_piece = this.choose_piece();
                    //UPDATE HERE
                    this.focus_piece = this.up_coming_pieces[0];
                    this.check_game_over();
                    this.up_coming_pieces.splice(0, 1);
                    this.up_coming_pieces.push(this.choose_piece());
                    
                    this.preview_piece = this.create_preview();
                    this.already_saved = false;
                    this.clear_floor();
                    score += 5;
                    place_block_sound.play();
                }
            }
        } else if (dir == 'left'){
            if(this._try_move_focus(-1, 0) && this._try_draw_focus(-1, 0)){
                this.focus_piece.move_left();
                this.preview_piece = this.create_preview();
            }
        } else if (dir == 'right'){
            if(this._try_move_focus(1, 0) && this._try_draw_focus(1, 0)){
                this.focus_piece.move_right();
                this.preview_piece = this.create_preview();
            }
        }
    }
    
    _try_move_focus(x_dir, y_dir){
        let x = this.focus_piece.piece['x'];
        let y = this.focus_piece.piece['y'];
        let x_len = this.focus_piece.piece['type'][0].length;
        let y_len = this.focus_piece.piece['type'].length;
        
        if(x + x_len + x_dir > this.max_w || x + x_dir < 0 || y + y_len + y_dir> this.max_h || y + y_len + y_dir< 0){
            return false;
        }
        return true;
    }
    
    include_focus_piece(){
        let x = this.focus_piece.piece['x'];
        let y = this.focus_piece.piece['y'];

        for(let j = 0; j < this.focus_piece.piece['type'].length; j++){
            for(let i = 0; i < this.focus_piece.piece['type'][0].length; i++){
                if(this.focus_piece.piece['type'][j][i] == 1){
                    this.game_board[j + y][i + x] = 1;
                }
            }
        }
    }
    
    create_game_board(){
        let game_board = [];
        
        for (let j = 0; j < this.max_h; j++){
            
            let temp_row = [];
            
            for(let i = 0; i < this.max_w; i++){
                temp_row.push(0);
            }
            game_board.push(temp_row);
        }
        
        return game_board;
    }
    
    create_pieces_dict(){
        //  {'SQ': {}, 'L': {}} 
        //  --> sub dictionary {'type': [[]], 'rotation': 0, 90, 180, 270}
        //type = T, SQ, S_L, S_R, L_L, L_R, L
        
        let pieces_dict = {'SQ': {}, 'T': {}, 'S_L': {}, 'S_R': {}, 'L_L': {}, 'L_R': {}, 'L': {}};
        
        pieces_dict['SQ']['0'] = [[1, 1],
                                  [1, 1]]
        
        pieces_dict['SQ']['90'] = [[1, 1],
                                   [1, 1]]
        
        pieces_dict['SQ']['180'] = [[1, 1],
                                    [1, 1]]
        
        pieces_dict['SQ']['270'] = [[1, 1],
                                    [1, 1]]
        
        pieces_dict['T']['0'] = [[1, 1, 1],
                                 [0, 1, 0]]
        
        pieces_dict['T']['90'] = [[0, 1],
                                  [1, 1],
                                  [0, 1]]
        
        pieces_dict['T']['180'] = [[0, 1, 0],
                                   [1, 1, 1]]
        
        pieces_dict['T']['270'] = [[1, 0],
                                   [1, 1],
                                   [1, 0]]
        
        pieces_dict['S_L']['0'] = [[1, 1, 0],
                                   [0, 1, 1]]
        
        pieces_dict['S_L']['90'] = [[0, 1],
                                    [1, 1],
                                    [1, 0]]
        
        pieces_dict['S_L']['180'] = [[1, 1, 0],
                                     [0, 1, 1]]
        
        pieces_dict['S_L']['270'] = [[0, 1],
                                     [1, 1],
                                     [1, 0]]
        
        pieces_dict['S_R']['0'] = [[0, 1, 1],
                                   [1, 1, 0]]
        
        pieces_dict['S_R']['90'] = [[1, 0],
                                    [1, 1],
                                    [0, 1]]
        
        pieces_dict['S_R']['180'] = [[0, 1, 1],
                                     [1, 1, 0]]
        
        pieces_dict['S_R']['270'] = [[1, 0],
                                     [1, 1],
                                     [0, 1]]

        pieces_dict['L_L']['0'] = [[1, 0, 0],
                                   [1, 1, 1]]
        
        pieces_dict['L_L']['90'] = [[1, 1],
                                    [1, 0],
                                    [1, 0]]
        
        pieces_dict['L_L']['180'] = [[1, 1, 1],
                                     [0, 0, 1]]
        
        pieces_dict['L_L']['270'] = [[0, 1],
                                     [0, 1],
                                     [1, 1]]
        
        pieces_dict['L_R']['0'] = [[0, 0, 1],
                                   [1, 1, 1]]
        
        pieces_dict['L_R']['90'] = [[1, 0],
                                    [1, 0],
                                    [1, 1]]
        
        pieces_dict['L_R']['180'] = [[1, 1, 1],
                                     [1, 0, 0]]
        
        pieces_dict['L_R']['270'] = [[1, 1],
                                     [0, 1],
                                     [0, 1]]
        
        pieces_dict['L']['0'] = [[1, 1, 1, 1]]
        
        pieces_dict['L']['90'] = [[1],
                                  [1],
                                  [1],
                                  [1]]
        
        pieces_dict['L']['180'] = [[1, 1, 1, 1]]
        
        pieces_dict['L']['270'] = [[1],
                                   [1],
                                   [1],
                                   [1]]
        
        return pieces_dict;
    }
    

    display(){
        for(let j = 0; j < this.max_h; j++){
            for(let i = 0; i < this.max_w; i++){
                if(this.game_board[j][i] == 1 || this.game_board[j][i] == 5){ //solidified or focus
                    fill(0, 255, 0);
                    stroke(255);
                    strokeWeight(1);
                    rect(i * this.width, j * this.height, this.width - 0.3, this.height - 0.3);
                } else if (this.game_board[j][i] == 2){ // preview piece
                    fill(255, 255, 255);
                    stroke(100);
                    strokeWeight(1);
                    rect(i * this.width, j * this.height, this.width - 0.3, this.height - 0.3);
                }
            }
        }
        
    }
    
    create_saved_dict(){
        let save_dict = {};
        save_dict['L'] = loadImage('assets/L.png');
        save_dict['L_L'] = loadImage('assets/L_L.png');
        save_dict['L_R'] = loadImage('assets/L_R.png');
        save_dict['S_L'] = loadImage('assets/S_L.png');
        save_dict['S_R'] = loadImage('assets/S_R.png');
        save_dict['SQ'] = loadImage('assets/SQ.png');
        save_dict['T'] = loadImage('assets/T.png');
        return save_dict;
    }
    
    swap_piece(){
        if(!this.already_saved){
            if(this.saved_piece == false){
                this.saved_piece = this.focus_piece;
                this.saved_piece.piece['x'] = this.max_w / 2 - 2;
                this.saved_piece.piece['y'] = 0;
                
                //UPDATE HERE
                //this.focus_piece = this.choose_piece();
                this.focus_piece = this.up_coming_pieces[0];
                this.up_coming_pieces.splice(0, 1);
                this.up_coming_pieces.push(this.choose_piece());
                
                this.preview_piece = this.create_preview();
            } else {
                let temp = this.focus_piece;
                this.focus_piece = this.saved_piece;
                this.saved_piece = temp;
                this.saved_piece.piece['y'] = 0;
                this.preview_piece = this.create_preview();
            }
            this.already_saved = true;
        }

    }
    
    display_saved(){
        if(this.saved_piece){
            image(this.saved_pieces_dict[this.saved_piece.piece['name']], Canvas_Width + (real_width - Canvas_Width) / 4, 50, this.saved_pieces_dict[this.saved_piece.piece['name']].width * 2 / 3, this.saved_pieces_dict[this.saved_piece.piece['name']].height / 2);
            fill(0,0,0);
            stroke(0);
            strokeWeight(2);
            line(Canvas_Width, 80 * 2 - 20, real_width, 80 * 2 - 20);
        } else {
            fill(0,0,0);
            stroke(0);
            strokeWeight(2);
            line(Canvas_Width, 80 * 2 - 20, real_width, 80 * 2 - 20);
            line(Canvas_Width, 80 * 2 - 20, real_width, 80 * 2 - 20);
        }
        
    }
    
    display_up_coming(){
        for(let i = 0; i < this.up_coming_pieces.length; i++){
            image(this.saved_pieces_dict[this.up_coming_pieces[i].piece['name']], Canvas_Width + (real_width - Canvas_Width) / 4, 100 * i + 80 * 2, this.saved_pieces_dict[this.up_coming_pieces[i].piece['name']].width * 2 / 3, this.saved_pieces_dict[this.up_coming_pieces[i].piece['name']].height / 2);
        }
        
    }
    
    force_move(){
        this.timer++;
        if(this.timer % this.force_down_time == 0){
            this.move('down');
        }
    }
    
    clear_floor(){
        for(let i = 0; i < this.game_board.length; i++){
            let do_it = true;
            for(let j = 0; j < this.game_board[0].length; j++){
                if(this.game_board[i][j] != 5){
                    do_it = false;;
                }
            }
            
            if(do_it){
                this.game_board.splice(i, 1);
                let new_row = [];

                for(let k = 0; k < this.max_w; k++){
                    new_row.push(0);
                }

                this.game_board.splice(0, 0, new_row);
                score += 25;
                
                if(this.force_down_time > 10){
                    this.force_down_time = Math.floor(this.force_down_time * 10 / 11);
                }
                this.preview_piece = this.create_preview(); //to prevent the preview piece from showing on the wrong row after deletion
                if(!clear_row_sound.isPlaying()){
                    clear_row_sound.play();
                }
            }
        }
    }
    
    check_game_over(){
        //solidified pieces == 5
        let piece = this.focus_piece.piece['type'];
        let x = this.focus_piece.piece['x'];
        let y = this.focus_piece.piece['y'];
        
        let game_over = false;
        for(let i = 0; i < piece.length; i++){
            for(let j = 0; j < piece[0].length; j++){
                if(this.game_board[i + y][j + x] == 5 && piece[i][j] == 1){
                    game_over = true;
                }
            }
        }
        
        if(game_over){
            noLoop();
            alert('Game over, your score was: ' + score);
            location.reload();
        }
        
    }
    
    run(){
        this.reset();
        this.include_preview_piece();
        this.include_focus_piece();
        this.display();
        this.force_move();
        this.display_saved();
        this.display_up_coming();
    }
    
    
}

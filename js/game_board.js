class GameBoard{
    constructor(){
        this.max_w = 16;
        this.max_h = 16;
        
        this.game_board = this.create_game_board();
        this.pieces_dict = this.create_pieces_dict();
        
        this.width = Canvas_Width / this.max_w;
        this.height = Canvas_Height / this.max_h;
        this.timer = 0;
        this.focus_piece = this.choose_piece();
        this.current_pieces = [];
    }
    
    choose_piece(){
        let new_piece_name = random(['T', 'SQ', 'S_L', 'S_R', 'L_L', 'L_R', 'L']);
        let new_rotation = random([0, 90, 180, 270]);
        let actual_piece_list = this.pieces_dict[new_piece_name][new_rotation];
        
        let piece_obj = new Piece(actual_piece_list, new_piece_name, new_rotation, this.pieces_dict[new_piece_name]);
        return piece_obj;
    }
    
    reset(){
        this.game_board = this.create_game_board();
    }
    
    _try_draw_focus(x_dir, y_dir){
        
    }
    
    move(dir){
        this.timer = 0;
        if(dir == 'down'){
            if(this._try_move_focus(0, 1)){
                this.focus_piece.move_down();
            } else {
                this.current_pieces.push(this.focus_piece);
                this.focus_piece = this.choose_piece();
            }
        } else if (dir == 'left'){
            if(this._try_move_focus(-1, 0)){
                this.focus_piece.move_left();
            }
        } else if (dir == 'right'){
            if(this._try_move_focus(1, 0)){
                this.focus_piece.move_right();
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
    
/*        this.max_w = 16;
        this.max_h = 16;
        this.width = Canvas_Width / this.max_w;
        this.height = Canvas_Height / this.max_h;*/
    display(){
        for(let j = 0; j < this.max_h; j++){
            for(let i = 0; i < this.max_w; i++){
                if(this.game_board[j][i] == 1){
                    fill(0, 255, 0);
                    stroke(255);
                    strokeWeight(1);
                    rect(i * this.width, j * this.height, this.width - 0.3, this.height - 0.3);
                }
            }
        }
        
    }
    
    force_move(){
        this.timer++;
        if(this.timer % 75 == 0){
            this.move('down');
        }
    }
    
    run(){
        this.reset();
        this.force_move();
        this.include_focus_piece();
        this.display();
    }
    
    
}

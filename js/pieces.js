class Piece{
    constructor(piece_type, name, rotation, rotation_varitions, max_h, max_w){
        //'x':  , 'y':  , 'type',  'rotation':
        this.piece = {'x': max_w / 2 - 2, 'y': 0, 'type': piece_type, 'rotation': rotation, 'name': name};
        this.rotation_variations = rotation_varitions;
    }
    
    move_down(){
        this.piece['y']++;
    }
    
    move_left(){
        this.piece['x']--;
    }
    
    move_right(){
        this.piece['x']++;
    }
    
    rotate(){
        if(this.piece['rotation'] == 0){
            this.piece['rotation'] = 90;
            this.piece['type'] = this.rotation_variations[90];
        } else if(this.piece['rotation'] == 90){
            this.piece['rotation'] = 180;
            this.piece['type'] = this.rotation_variations[180];
        } else if(this.piece['rotation'] == 180){
            this.piece['rotation'] = 270;
            this.piece['type'] = this.rotation_variations[270];
        }  else if(this.piece['rotation'] == 270){
            this.piece['rotation'] = 0;
            this.piece['type'] = this.rotation_variations[0];
        }
        
    }
    
    
}
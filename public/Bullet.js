class Bullet{
    constructor(x_, y_, missile){
        this.x = x_;
        this.y = y_;
        this.speed = -10;
        this.r = 20;
    }

    display() {
        ellipseMode(CENTER);
        fill(255, this.a);
        image(missile, this.x, this.y, this.r *4, this.r*6)
        // ellipse(this.x, this.y, this.r * 2);
      }
    
    move() {
        this.y += this.speed
    }
}
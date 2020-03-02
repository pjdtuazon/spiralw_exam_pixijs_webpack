export class VectorUtils
{
    static normalize (target, origin) 
    {
        var deltaX = target.x - origin.x;
        var deltaY = target.y - origin.y;
        var norm = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
        
        if(norm == 0) {
            return {x:0, y:0};
        }    
        
        var nx = deltaX / norm;
        var ny = deltaY / norm;

        return {x:nx, y:ny};
    }
}

export class MathUtils
{
    static degToRad(degrees)
    {
        return Math.PI * degrees / 180;
    }
}
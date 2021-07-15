function create(proto){
    function Temp(){}
    Temp.prototype = proto;
    return new Temp();
}
let obj = create(null)
console.log(Object.getPrototypeOf(obj))
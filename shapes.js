//npm install http-server -g
var shapes =[];
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startX = 0;
var startY = 0;
var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;
var primaryColor ='#059862';
var selectedColor='#03cffc';
ctx.strokeStyle = primaryColor;
ctx.fillStyle = '#1f154d';
ctx.lineWidth = 3;

class Rectangle {
  constructor(x0,y0,x1,y1){
    this.x0=x0;
    this.y0=y0;
    this.x1=x1;
    this.y1=y1;
    this.selected=false;

  }

  create = function(ctx) {
    ctx.beginPath();
    ctx.rect(this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0);
    ctx.fill();
    ctx.stroke();
  }
}
class Circle{
  constructor(x0,y0,x1,y1){
    this.x0=x0;
    this.y0=y0;
    this.x1=x1;
    this.y1=y1;
    this.radius = Math.sqrt( 
      Math.pow((x0-x1), 2) + 
      Math.pow((y0-y1), 2) );
    this.selected=false;
  }

  create = function(ctx)
  {
    ctx.beginPath();
    ctx.arc(this.x0,this.y0, this.radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.stroke();
  }
}
class Line{
  constructor(x0,y0,x1,y1){
    this.x0=x0;
    this.y0=y0;
    this.x1=x1;
    this.y1=y1;
    this.selected=false;

  }

  create = function (ctx){
    ctx.beginPath();
    ctx.moveTo(this.x0,this.y0)
    ctx.lineTo(this.x1,this.y1);
    ctx.stroke();
  }
}


function clearCanva(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.onmousedown = ()=>{} 
  canvas.onmouseup = ()=>{} 
}

function deleteCanva(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes=[];
  canvas.onmousedown = ()=>{} 
  canvas.onmouseup = ()=>{} 
  canvas.onmousemove = ()=>{} 
}

function draw (type) {
  var shape=null;
  let x0,y0,x1,y1;
  canvas.onmousemove = ()=>{} 
  canvas.onmousedown = function (ev) {
    x0 = ev.pageX - offsetX;
    y0 = ev.pageY - offsetY;
  };

  canvas.onmouseup = function (ev) {
    x1 = ev.pageX - offsetX;
    y1 = ev.pageY - offsetY;

    if(type === 'circle') shape=new Circle(x0,y0,x1,y1);
    if(type === 'rect') shape=new Rectangle(x0,y0,x1,y1);
    if(type === 'line') shape=new Line(x0,y0,x1,y1);

    shapes.push(shape);
    shape.create(ctx);
    delete shape;
};
  
}


const createShapeForm = document.querySelectorAll('form')[0];
createShapeForm.addEventListener("submit", function(e) {
  e.preventDefault();
  var data = new FormData(createShapeForm);
  var type = data.get("shape");
  var x0 = parseInt(data.get("x0"));
  var y0 = parseInt(data.get("y0"));
  var x1 = parseInt(data.get("x1"));
  var y1 = parseInt(data.get("y1"));
  var shape= null;
    if(type === 'circle') shape=new Circle(x0,y0,x1,y1);
    if(type === 'rect') shape=new Rectangle(x0,y0,x1,y1);
    if(type === 'line') shape=new Line(x0,y0,x1,y1);
shapes.push(shape);
shape.create(ctx);
delete shape;
})

const resizeForm = document.querySelectorAll('form')[1];
resizeForm.addEventListener("submit", function(e) {
  e.preventDefault();
  var data = new FormData(resizeForm);

  let x0Size = parseInt(data.get("x0Size"));
  let y0Size = parseInt(data.get("y0Size"));
  let radiusSize = parseInt(data.get("radiusSize"));
  let x1Size = parseInt(data.get("x1Size"));
  let y1Size = parseInt(data.get("y1Size"));
  
    console.log('siemanko')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    shapes.forEach(shape =>{
      if(shape.selected) 
      {
      shape.x1 = x1Size;
      shape.y1 = y1Size;
      if(shape.constructor.name==="Circle"){
        shape.radius =Math.sqrt( 
          Math.pow((shape.x0-shape.x1), 2) + 
          Math.pow((shape.y0-shape.y1), 2) );
        if(radiusSize)
        shape.radius=radiusSize;
      } else{
        shape.x0 = x0Size;
        shape.y0 = y0Size;
      }
      shape.selected = false;
    }
    ctx.strokeStyle=primaryColor;
    shape.create(ctx);
    });
  
}
);


function drawAllShapes(){
  shapes.forEach((shape) =>{
     shape.create(ctx);
     console.log(shape);
  });
}


function linepointNearestMouse(line, x, y) {
  lerp = function(a, b, x) {
    return (a + x * (b - a));
  };
  var dx = line.x1 - line.x0;
  var dy = line.y1 - line.y0;
  var t = ((x - line.x0) * dx + (y - line.y0) * dy) / (dx * dx + dy * dy);
  var lineX = lerp(line.x0, line.x1, t);
  var lineY = lerp(line.y0, line.y1, t);
  return ({
    x: lineX,
    y: lineY
  });
};


function isHit(shape, x, y) {
  
  if (shape.constructor.name === 'Circle') {
    var dx = shape.x0 - x;
    var dy = shape.y0 - y;
    if (dx * dx + dy * dy < shape.radius * shape.radius) {
      console.log(shape.constructor.name);
      return true
    }
  } 
  
  if (shape.constructor.name === 'Rectangle') 
  {
    if(x >= shape.x0 && 
      x<= shape.x1 &&
      y>= shape.y0 &&
      y<= shape.y1)
      {
        console.log(shape.constructor.name);

        return true;}
  }
  
  if (shape.constructor.name === 'Line')
  {

    if (!(x < shape.x0 || x > shape.x1))
    {
      var tolerance = 3;
      var linepoint = linepointNearestMouse(shape, x, y);
      var dx = x - linepoint.x;
      var dy = y - linepoint.y;
      var distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
      if (distance < tolerance) {
        console.log(shape.constructor.name);
        return true;
    }
  }
  } 
  return false;
}

var mouseDrag = function()
  {
  
    ctx.strokeStyle=primaryColor;
    canvas.onmousedown = function (evt) {
      
      startX = evt.pageX - offsetX;
      startY = evt.pageY - offsetY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape =>{
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (isHit(shape, startX, startY)) {
            shape.selected = true;
        }
        shape.create(ctx);
      });
    }
  
    canvas.onmouseup = function (evt) {
      
      shapes.forEach(shape =>{

        shape.selected=false;

        shape.create(ctx);
      });
    }
  
    canvas.onmousemove = function (evt){
      x = evt.pageX - offsetX;
      y = evt.pageY - offsetY;
      var dx = x - startX;
      var dy = y - startY;
      startX = x;
      startY = y;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape =>{
        if(shape.selected) {
        shape.x0 += dx;
        shape.y0 += dy;
        shape.x1 += dx;
        shape.y1 += dy;
      }
      shape.create(ctx);
    });

    }
  }

var mouseResize = function()
  {
    ctx.strokeStyle=primaryColor;

    canvas.onmousedown = function (evt) {
      
      startX = evt.pageX - offsetX;
      startY = evt.pageY - offsetY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape =>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (isHit(shape, startX, startY)) {
            shape.selected = true;
        }
        shape.create(ctx);
      });
    }
    canvas.onmouseup = function (evt) {
      shapes.forEach(shape =>{
        shape.selected=false;
        shape.create(ctx);
      });
    }
    
    canvas.onmousemove = function (evt) {
      x = evt.pageX - offsetX;
      y = evt.pageY - offsetY;
      var dx = x - startX;
      var dy = y - startY;
      startX = x;
      startY = y;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape =>{
        if(shape.selected) {
          console.log('im in')
        shape.x1 += dx;
        shape.y1 += dy;
        if(shape.selected && shape.constructor.name==="Circle")
          shape.radius =Math.sqrt( 
            Math.pow((shape.x0-shape.x1), 2) + 
            Math.pow((shape.y0-shape.y1), 2) );
      }
      shape.create(ctx);
    });

    }
  
  }

var inputResize =function(){
  canvas.onmousedown = function (evt) {
      
    startX = evt.pageX - offsetX;
    startY = evt.pageY - offsetY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    shapes.forEach(shape =>{
      
      
      if (isHit(shape, startX, startY)) 
      {
        ctx.strokeStyle = selectedColor;
        shape.selected = true;
        shape.create(ctx);
      }
      else{
        shape.selected = false;
        ctx.strokeStyle = primaryColor;
        shape.create(ctx);
      }
    });

  }
  
  canvas.onmouseup =() =>{};
  canvas.onmousemove =() =>{};
}



function download( ) {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
  } else {alert('File Api nie jest wspierany przez tą przeglądarke'); }
 
  var a = document.createElement("a");
  var jsonShapes= shapes;
  jsonShapes.forEach(shape =>{
    shape.type = shape.constructor.name;
  })

  var file = new Blob([JSON.stringify(jsonShapes)], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = 'shapes.json';
  a.click();
}

var rawFile;
function readFile(e) {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) 
    { 
      rawFile=evt.target.result;
    }
  };
  console.log(file.size);
  reader.readAsText(file);
  accessFileContents();
}

document.getElementById('file').addEventListener('change', readFile, false);
var fileLoadTime = 1000;

function accessFileContents(){
  setTimeout(function(){
    console.log(rawFile);
    jsonFile= JSON.parse(rawFile);
    shapes =[];
    jsonFile.forEach(e=>{
      if(e.type === 'Circle') {shapes.push(new Circle(e.x0,e.y0,e.x1,e.y1))};
      if(e.type === 'Rectangle') shapes.push(new Rectangle(e.x0,e.y0,e.x1,e.y1));
      if(e.type === 'Line') shapes.push(new Line(e.x0,e.y0,e.x1,e.y1));
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();
  }, fileLoadTime);
}
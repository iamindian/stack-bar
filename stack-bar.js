const Raphael = require("Raphael");
function StackBar(dom){
	let xSlots= [];	
	let rect = {
		cx:0,cy:0,width:0,height:0
	}
	let line = {
		head:{x:0,y:0},tail:{x:0,y:0},width:0
	};
	let text = {
		cx:0,cy:0,text:"text"
	};
	let data = [[20,20,20,10],[20,20,40,20]];
	let container,paper, xAxis, yAxis, bars;
	function getContainer(){
		if(!dom){
			return;	
		}
		let width = window.getComputedStyle(dom).width;
		let height = window.getComputedStyle(dom).height;
		if(!width||!height){
			throw new Error("please set dom's width and height");	
		}
		let tmp = {
			width:parseInt(width),
			height:parseInt(height)
		};
		return tmp;
	}
	function makePaper(container){
		let paper = Raphael(0,0,container.width, container.height);	
		//paper.canvas.style.backgroundColor = "yellow";	
		return paper;
	}
	function makeBars(paper,data){
		let yBegin = 600;
		let barHeight = 500;
		for(let i=0;i<data.length;i++){
			let x = xSlots[i];
			let total = data[i].reduce((accumulator,current)=>accumulator + current);
			let y = yBegin;
			for(let k=0;k<data[i].length;k++){
				let current = data[i][k];
				let height = barHeight * (current/total);
				let path = `M${x} ${y}L${x} ${y - height}`;
				console.debug(path);
				path = paper.path(path);
				path.attr("stroke",getRandomColor());
				path.attr("stroke-width","50px");
				y = y - height;
			} 
		}

	}
	function getRandomColor() {
  		var letters = '0123456789ABCDEF';
  		var color = '#';
  		for (var i = 0; i < 6; i++) {
    		color += letters[Math.floor(Math.random() * 16)];
  		}
  		return color;
	}

	function makeXAxis(paper,data){
		let l = JSON.parse(JSON.stringify(line));
		let before = 100;
		let after = 100;
		let graduationCount = data.length;
		let lineLength = paper.width - before - after;
		let space = lineLength / (graduationCount + 1);
		l.head = {
			x:before,y:600
		};
		l.tail = {
			x:before + lineLength, y:600
		}
		let path = `M${l.head.x} ${l.head.y}L${l.tail.x} ${l.tail.y}`;
		paper.path(path);
		let current = before + space;
		for(let i=0;i<graduationCount;i++){
			let t = JSON.parse(JSON.stringify(text));
			t.x = current;
			t.y = 630;
			t.text = i + "";
			current = current + space;
			paper.text(t.x,t.y,t.text);
			xSlots.push(t.x);
		}
				
	}
	function makeYAxis(paper){
		let xAxisBefore = 100;
		let xAxisAfter = 100;
		let gridLineLength = paper.width - xAxisBefore - xAxisAfter;
		let yBegin = 600;
		let yAxisBefore = 100;
		let yAxisHeight = 500;
		let yAxisWidth = 100;
		let space = yAxisHeight / 10;
		let current = yBegin;
		for(let i=0;i<11;i++){
			let t = JSON.parse(JSON.stringify(text));
			t.x = yAxisWidth/2;
			t.y = current;
			current = current - space;
			paper.text(t.x,t.y,i*10 + "%");
			let p = paper.path(`M${xAxisBefore},${t.y}L${xAxisBefore+gridLineLength},${t.y}`);
			p.attr("stroke","red");	
		}
			
	}
	function makeCompareLine(){
			
	}		
		
			
	function init(){	
		container = getContainer();
		console.debug(container);
		paper = makePaper(container);
		console.debug(paper);
		makeXAxis(paper,data);
		console.debug(xSlots);
		makeYAxis(paper);
		makeBars(paper,data);
	}
	init();
}
module.exports = StackBar;

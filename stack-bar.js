const Raphael = require("Raphael");
function StackBar(dom){
	let options = {
		leagends:[],

	}
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
	let bars = [];
	let data = [[20,20,20,10],[20,20,40,20]];
	let container,paper, xAxis, yAxis;
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
		let paper = Raphael(dom);
		console.debug(container.width);
		console.debug(container.height);
		paper.setViewBox(0,0,container.width,container.height,true);
		// Setting preserveAspectRatio to 'none' lets you stretch the SVG
		paper.canvas.setAttribute('preserveAspectRatio', 'none');
		var svg = document.querySelector("svg");
		svg.removeAttribute("width");
		svg.removeAttribute("height");
		return paper;
	}
	function makeBars(paper,data){
		let yBegin = 600;
		let barHeight = 500;
		for(let i=0;i<data.length;i++){
			let x = xSlots[i];
			let total = data[i].reduce((accumulator,current)=>accumulator + current);
			let y = yBegin;
			let barParts = [];
			for(let k=0;k<data[i].length;k++){
				let current = data[i][k];
				let percentage = current/total;
				let height = barHeight * (percentage);
				let path = `M${x} ${y}L${x} ${y - height}`;
				console.debug(path);
				path = paper.path(path);
				path.data("percentage", percentage);
				barParts.push(path);
				path.attr("stroke",getRandomColor());
				path.attr("stroke-width","50px");
				y = y - height;
			}
			bars.push(barParts);	
		}
		console.debug(bars);

	}
	function makeComparison(paper){
		for(let i=0;i<bars.length;i++){
			if(i===0)
				continue;
			for(let x=0;x<bars[i].length;x++){
				let previous = bars[i-1][x];
				let current = bars[i][x];
				let v1 = previous.data("percentage");
				let v2 = current.data("percentage");
				let delta = Math.max(v1,v2)-Math.min(v1,v2);
				delta = Math.trunc(delta * 100);
				let cBox = current.getBBox();
				let pBox = previous.getBBox();
				let cWidth = parseInt(current.attr("stroke-width"));
				let pWidth = parseInt(previous.attr("stroke-width"));
				let head = {
					x:pBox.x + pWidth/2,y:pBox.y
				};
				let tail = {
					x:cBox.x - cWidth/2,y:cBox.y
				}
				let path = `M${head.x},${head.y}L${tail.x},${tail.y}`;
				path = paper.path(path);
				let pathBox = path.getBBox();
				let text = paper.text(pathBox.cx,pathBox.cy + 10,delta+"%");
				console.debug(text);
				console.debug(previous);
				console.debug(current);
				console.debug(delta);
				console.debug(cBox);
				console.debug(pBox);
				console.debug(cWidth);
				console.debug(pWidth);
				console.debug(path);
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
			
		
			
	function init(){	
		container = getContainer();
		console.debug(container);
		paper = makePaper(container);
		console.debug(paper);
		makeXAxis(paper,data);
		console.debug(xSlots);
		makeYAxis(paper);
		makeBars(paper,data);
		makeComparison(paper);
	}
	init();
}
module.exports = StackBar;

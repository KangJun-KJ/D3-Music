var width = 600,
	height = 600;
var pie = d3.layout.pie();
var arc = d3.svg.arc();
var svg = d3.select('body').append("svg")
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr('transform', "translate(" + width / 2 + "," + height / 2 + ")")
var innerRadius1 = 100, //内侧内半径
	innerRadius2 = width / 2 - 50, //外侧内半径
	outerRadius1 = width / 3, //内侧外半径
	outerRadius2 = width / 2 - 20; //外侧外半径
////--------------------------------------添加背景
var color=d3.scale.category20();
//var color = d3.scale.ordinal()
//	.range(["#333", "brown", "white", "green", "steelblue"]);
//var size=40,dataset = d3.merge(d3.range(0, width + size, size).map(function(x) {
//		return d3.range(0, height + size, size).map(function(y) {
//			return [x, y];
//		})
//	}));
//
//var rect = d3.select('svg').append('g').selectAll('rect')
//	.data(dataset)
//	.enter()
//	.append('rect')
//	.attr('transform', function(d) {
//		return "translate(" + d+ ")";
//	})
//	.attr('width', size)
//	.attr('height', size)
//	.style('stroke', '#000')
//	.style('stroke-width', "2px")
//	.style('fill', "#000")
//	.attr('opacity',.5)
//	
//	.on('click', pulse);
//------------------------------------------变化的背景墙
//rect.transition()
//	.duration(2000)
//	
//	.attr("opacity",'.5')
//	.each(pulse);

//function pulse() {
//	var rect = d3.select(this);
//	(function loop() {
//
//		rect = rect.transition()
//			.duration(1750)
//			.style("fill", color(Math.random() * 5 | 0))
//			.each("end", function() {
//				if(this.__transition__.count < 2) loop();
//			});
//	})();
//}
//------------------------------------------不变的背景墙
//rect.each(pluse);
//function pluse(){
//	d3.select(this).style("fill", color(Math.random() * 5 | 0))
//}

//-----------------------------------------添加圆弧的方法----------------------------------------------
var cnt = 0; //记录当前添加圆的编号。

//					参数意义：数据  开始角度结束角度  内则半径 外则半径 间隔距离 样式
function createCircle(data, startAngle, endAngle, innerRadius, outerRadius, padAngle, style) {

	var arcs = svg.selectAll('g .circle' + cnt)
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', "circle" + (cnt))
		.append('path')
		.attr('d', function(d) {

			return arc.innerRadius(innerRadius).outerRadius(outerRadius).padAngle(padAngle)(d);
		})
		.attr(style);
	if(cnt++ == 1) {
		arcs.on("mouseover", function() {

				d3.select(this)
					.attr({
						opacity: '.6',
						transform: "scale(1.01) rotate(45)"
					});
			})
			.on('mouseout', function() {
				d3.select(this).attr({
					opacity: '.3',

					transform: " rotate(45)"
				});
			})
			.on('click', function(d, i) {
				if(i == 3) {
					jianVolum();
				} else if(i == 0) {
					nextSong();
				} else if(i == 1) {
					addVolum();
				} else if(i == 2) {
					preSong();
				}
			})
	}
}
//---------------------------------------添加圆弧上的rect--------------------------------

var dataset = [];
//createRect();
//setInterval(function() {
//	createRect();
//}, 1000);

function createRect() {

	while(dataset.length) {
		dataset.pop();
	}

	for(var i = 0; i < 4; ++i) {
		var item = {}; //创建一个item的空对象
		item.value = 100; //添加一个value属性
		item.children = d3.range(0, 6).map(function() { //通过map返回一个长度为8的随机数组
			return Math.random() * 10;
		});
		dataset.push(item); //加了数据到dataset中。
	}

	var pie2 = d3.layout.pie().value(function(d) {
		return d.value;
	}).padAngle(.05);
	var rectHeightScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) {
			return d3.max(d.children);
		})])
		.range([10, innerRadius2 - outerRadius1]);

	var update = svg.selectAll('g .myRect')
		.data(pie2(dataset));

	update.attr("class", function(d, i) {

		var updateRect = d3.select(this).selectAll("rect")
			.data(d.data.children);

		updateRect
			.transition()
			.duration(200)
			.attr('height', 0)
			.transition()
			.duration(500)
			.delay(function() {
				return Math.random() * 500 | 0;
			})
			.attr("height", function(dd, i) {
				return rectHeightScale(dd);
			})

		return "myRect";
	});
	update.enter()
		.append('g')
		.attr('transform', 'rotate(45)')
		.attr("class", function(d, i) {

			var updateRect = d3.select(this).selectAll("rect")
				.data(d.data.children).enter()
				.append("rect")
				.attr("x", -10)
				.attr("y", 0)
				.attr("width", 20)
				.attr("height", function(dd, i) {
					return 0;
					return rectHeightScale(dd);
				})
				.attr("transform", function(dd, i) {

					var rotateAngle = d.startAngle + (d.endAngle - d.startAngle) / (d.data.children.length + 1) * (i + 1);

					return "rotate(" + ((rotateAngle * 180 / Math.PI) - 180) + ")translate(" + 0 + "," + outerRadius1 + ")"
				})
				.attr("fill", function(d, i) {
					return color(i);
				})
				.transition()
				.duration(500)
				.delay(function() {
					return Math.random() * 500 | 0;
				})
				.attr("height", function(dd, i) {
					return rectHeightScale(dd);
				})

			return "myRect";
		});
}

//----------------------------------------添加按钮文本------------------------
var textbtn = ["声音-", "下一首", "声音+", "上一首"];
svg.selectAll('g .caozuotext')
	.data(textbtn)
	.enter()
	.append('text')
	.attr('class', 'caozuotext')
	.attr("text-anchor", "middle")
	.attr("dy", ".3em")
	.attr("transform", function(d, i) {
		var midAngle = Math.PI * 2 / 4 * i;
		var midDistance = (width / 3 + 100) / 2;
		return "translate(" + midDistance * Math.cos(midAngle - Math.PI / 2) + "," + midDistance * Math.sin(midAngle - Math.PI / 2) +
			")";
	})
	.attr("fill", "white")
	.attr("font-weight", "bold")
	.text(function(d, i) {
		return textbtn[i];
	}).style('cursor', "pointer");

//---------------------------------添加中间的播放按钮和头像----------------------------------------

var play = d3.select('svg')
	.append("g")
	.attr('transform', 'translate(' + width / 2 + "," + height / 2 + ")")
	.attr("class", "play")
	.on('mouseover', function() {
		IsBofang=!audio.paused;
		if(IsBofang) {
			d3.select('.restartBtn1 ')
				.style('display', 'inline');
			d3.select('.restartBtn2 ')
				.style('display', 'inline');
		} else {
			d3.select('.startBtn')
				.style('display', 'inline');
		}

	})
	.on('mouseout', function() {
		d3.select('.restartBtn1 ')
			.style('display', 'none');
		d3.select('.restartBtn2 ')
			.style('display', 'none');
		d3.select('.startBtn')
			.style('display', 'none');
	})
	.on('click', function() {
		if(IsBofang) {
			IsBofang = !IsBofang;
			stopMusic();
		} else {
			playMusic();
			IsBofang = !IsBofang;
		}
	});
var IsBofang = false;
play.append("defs")
	.append('pattern')
	.attr({
		id: "avatar",
		width: "100%",
		height: "100%",
		patternContentUnits: "objectBoundingBox"
	})
	.append('image')
	.attr('class', 'myImage')
	.attr({
		width: "1",
		height: "1",
		"xlink:href": "media/1.png"
	});

play.append("circle")
	.attr("r", 90)
	.attr('fill', 'url(#avatar)')

play.append("path").attr('class', 'startBtn')
	.attr("d", "M-22,-30l60,30l-60,30z")
play
	.append("path").attr('class', 'restartBtn1')
	.attr('d', "M-30,-30L-30,30L-10,30L-10,-30Z");
play.append("path").attr('class', 'restartBtn2')
	.attr('d', "M10,-30L10,30L30,30L30,-30Z");

//-----------------------------------最外层圆的进度条-------------------------

var parc = d3.svg.arc();
svg.selectAll('g.circleProgress')
	.data(pie([1]))
	.enter()
	.append('g')
	.attr('class', "circleProgress")
	.append('path')
	.attr('fill', 'steelblue')
	.attr('d', function(d) {
		return parc.innerRadius(innerRadius2).outerRadius(outerRadius2).startAngle(0).endAngle(0)(d);
	});





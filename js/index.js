var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;

//pullDownAction方法用于模拟下拉刷新成功后，向顶端追加数据;
function pullDownAction () {
	setTimeout(function () {	
		var el, li, i;
		el = document.getElementById('thelist');

		for (i=0; i<3; i++) {
			console.log("generatedCount:"+generatedCount);
			li = document.createElement('li');
			li.innerText = 'Generated row ' + (++generatedCount);
			el.insertBefore(li, el.childNodes[0]);
		}
		myScroll.refresh();		//数据加载完成后，调用界面更新方法 
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

//pullDownAction方法用于模拟上拉刷新成功后，向底端追加数据;
function pullUpAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');

		for (i=0; i<3; i++) {
			li = document.createElement('li');
			li.innerText = 'Generated row ' + (++generatedCount);
			el.appendChild(li, el.childNodes[0]);
		}
		
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

/*初始化iScroll控件*/
function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;//表示获取元素自身的高度
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new iScroll('wrapper', {
		useTransition: true,   //表示是否使用css3中的过渡效果，默认为true;
		topOffset: pullDownOffset,//pullDown区间高度
		hScrollbar:false, //false隐藏水平方向上的滚动条
		vScrollbar:false，// false 隐藏垂直方向上的滚动条
		onRefresh: function () {  //刷新方法
			if (pullDownEl.className.match('loading')) {
				console.log(19);
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			} else if (pullUpEl.className.match('loading')) {
				console.log(18);
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		},
		//onScrollMove：主要表示根据用户下拉或上拉刷新的高度值,来显示不同的交互文字;
		onScrollMove: function () {  //手指触摸事件
			//this.y:表示手指下拉的高度
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				console.log(14);
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				console.log(15);
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				console.log(16);
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				console.log(17);
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				this.maxScrollY = pullUpOffset;
			}
		},
		//onScrollEnd:表示用户下拉刷新完,放开手指时所显示的不同的交互文字
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				console.log(12);
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				console.log(13);
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}
/*
  touchmove:表示手指在屏幕上滑动连续触发的事件
*/
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
/*
  load事件：仅在所有资源都完全加载后才被触发
  DOMContentLoaded：DOM加载之后及资源加载之前被触发.
*/	
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

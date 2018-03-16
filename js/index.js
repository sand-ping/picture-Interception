var region = document.getElementsByClassName('region')[0];
region.style.display='none';
var upload_file = document.getElementById('upload_file');//上传图片按钮
var imageType = /image.*/;

//鼠标按下时
var mainDiv = document.getElementById('img-main');//截取边框
var divmin = document.getElementsByClassName('img-Divmin');//拖动点
var imgclip = document.getElementById('cut-imgbg');//用clip截取的图片
var cut_imgcvs = document.getElementById('cut-imgcvs');//画布上的图片
var imgCvs = cut_imgcvs.getContext('2d');
var myImg = new Image();
var clip_top = 0;
var clip_right = 200;
var clip_bottom = 200;
var clip_left = 0;
var rect;
var isDraging = false; //是否正在被拖动
var contact = ""; //表示被按下的触点
var img_width;
var img_height;
var img_left; //原移动框的距离左边的位置
var img_top;  //原移动框的距离上边的位置

//上传图片按钮触发
upload_file.addEventListener("change", function(evt) {
 region.style.display='block';
// root.gen_base64();
 for (var i = 0, numFiles = this.files.length; i < numFiles; i++) {
   var file = this.files[i];
   if (!file.type.match(imageType)) {
     continue;
   }
   var reader = new FileReader();
   reader.onload = getOnloadFunc(imgclip);
   reader.readAsDataURL(file);
  }
  img_top=getPosition(mainDiv).top;
  img_left=getPosition(mainDiv).left;
}, false);
function getOnloadFunc(aImg) {
  var cut_imgcvs = document.getElementById('cut-imgcvs');//canvas上的图片
  var imgCvs = cut_imgcvs.getContext('2d');
  var mainDiv = document.getElementById('img-main')
  return function(evt) {
    var result=evt.target.result;
    myImg.onload = function() {
      // console.log(myImg,myImg.height);
      if(myImg.width>myImg.height){
          imgCvs.drawImage(myImg, 0, 0, 1140, 1140 * myImg.height / myImg.width);
      }else{
          imgCvs.drawImage(myImg, 0, 0, 1140 * myImg.width / myImg.height, 1140);
      }
      aImg.onload=function () {
        if(myImg.width>myImg.height){
          img_width=570;
          img_height=570 * myImg.height / myImg.width;
          aImg.height=img_height;
          aImg.width=img_width;
          aImg.style.clip = "rect(0px,570px,"+570 * myImg.height / myImg.width+"px,0px)";
          mainDiv.style.width='570px';
          mainDiv.style.height=570 * myImg.height / myImg.width+'px';
          clip_bottom= 570 * myImg.height / myImg.width;
          clip_right=570;
        }else{
          img_height=570;
          img_width=570 * myImg.width / myImg.height;
          aImg.height=img_height;
          aImg.width=img_width;
          aImg.style.clip = "rect(0px,"+570 * myImg.width / myImg.height+"px,570px,0px)";
          mainDiv.style.width=570 * myImg.width / myImg.height+'px';
          mainDiv.style.height='570px';
          clip_bottom= 570;
          clip_right=570 * myImg.width / myImg.height;
        }
      }
      aImg.src = result;
    }
    myImg.src = result;
  };
}
document.getElementsByClassName('img-up-left')[0].onmousedown = function() {
  isDraging = true;
  contact = "up-left";
}
document.getElementsByClassName('img-up-right')[0].onmousedown = function() {
  isDraging = true;
  contact = "up-right";
}
document.getElementsByClassName('img-left-down')[0].onmousedown = function() {
  isDraging = true;
  contact = "down-left";
}
document.getElementsByClassName('img-left')[0].onmousedown = function() {
  isDraging = true;
  contact = "left";
}
document.getElementsByClassName('img-up')[0].onmousedown = function() {
  isDraging = true;
  contact = "up";
}
document.getElementsByClassName('img-right-down')[0].onmousedown = function() {
  isDraging = true;
  contact = "down-right";
}
document.getElementsByClassName('img-right')[0].onmousedown = function() {
  isDraging = true;
  contact = "right";
}
document.getElementsByClassName('img-down')[0].onmousedown = function() {
  isDraging = true;
  contact = "down";
}
  //鼠标松开时
window.onmouseup = function() {
  isDraging = false;
}
  //鼠标移动时
window.onmousemove = function(e) {
  var e = e || window.event;
  if(isDraging == true) {
    switch(contact) {
      case "up":
        upMove(e);
        break;
      case "right":
        rightMove(e);
        break;
      case "down":
        downMove(e);
        break;
      case "left":
        leftMove(e);
        break;
      case "up-right":
        upMove(e);
        rightMove(e);
        break;
      case "down-right":
        downMove(e);
        rightMove(e);
        break;
      case "down-left":
        downMove(e);
        leftMove(e);
        break;
      case "up-left":
        upMove(e);
        leftMove(e);
        break;
      }
    }
  }
  //禁止图片被选中
document.onselectstart = new Function('event.returnValue = false;');
//up移动
function upMove(e) {
  var y = e.clientY; //鼠标位置的纵坐标
  var heightBefore = mainDiv.offsetHeight - 2; //选取框变化前的高度
  var addHeight = getPosition(mainDiv).top - y; //增加的高度
  if(clip_top - addHeight < clip_bottom&& img_top<=y) {
    mainDiv.style.height = heightBefore + addHeight + 'px'; //选取框变化后的宽度
    mainDiv.style.top = mainDiv.offsetTop - addHeight + 'px'; //相当于变化后左上角的纵坐标，鼠标向上移纵坐标减小，下移增大
    clip_top = clip_top - addHeight;
    rect = "rect(" + clip_top + 'px ' + clip_right + 'px ' + clip_bottom + 'px ' + clip_left + 'px ' + ')';
    imgclip.style.clip = rect;
  }
}
//right移动
function rightMove(e) {
  var x = e.clientX; //鼠标位置的横坐标
  var widthBefore = mainDiv.offsetWidth - 2; //选取框变化前的宽度
  //var widthBefore = mainDiv.clientWidth;
  var addWidth = x - getPosition(mainDiv).left - widthBefore; //鼠标移动后选取框增加的宽度
  if(clip_right + addWidth > clip_left&&img_left+img_width>=x) {
    mainDiv.style.width = widthBefore + addWidth + 'px'; //选取框变化后的宽度
    clip_right = clip_right + addWidth;
    rect = "rect(" + clip_top + 'px ' + clip_right + 'px ' + clip_bottom + 'px ' + clip_left + 'px ' + ')';
    imgclip.style.clip = rect;;
  }
}
//down移动
function downMove(e) {
  var y = e.clientY; //鼠标位置的纵坐标
  var heightBefore = mainDiv.offsetHeight - 2;
  var addHeight = y - getPosition(mainDiv).top - heightBefore;
  if(clip_bottom + addHeight > clip_top&&img_top+img_height>=y) {
    mainDiv.style.height = heightBefore + addHeight + 'px';
    clip_bottom = clip_bottom + addHeight;
    rect = "rect(" + clip_top + 'px ' + clip_right + 'px ' + clip_bottom + 'px ' + clip_left + 'px ' + ')';
    imgclip.style.clip = rect;
  }
}
//left移动
function leftMove(e) {
  var widthBefore = mainDiv.offsetWidth - 2;
  var addWidth = getPosition(mainDiv).left - e.clientX; //增加的宽度等于距离屏幕左边的距离减去鼠标位置横坐标
  if(clip_left - addWidth < clip_right&&img_left<=e.clientX) {
    mainDiv.style.width = widthBefore + addWidth + 'px';
    mainDiv.style.left = mainDiv.offsetLeft - addWidth + 'px'; //左边的距离（相当于左边位置横坐标）等于选取框距父级元素的距离减去增加的宽度
    clip_left = clip_left - addWidth;
    rect = "rect(" + clip_top + 'px ' + clip_right + 'px ' + clip_bottom + 'px ' + clip_left + 'px ' + ')'
    imgclip.style.clip = rect;
  }
}
//获取位置
function getPosition(el) {
  var left = el.offsetLeft;
  var top = el.offsetTop;
  var parent = el.offsetParent;
  while(parent != null) {
    left += parent.offsetLeft;
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  // console.log(left, top);
  return {
    "left": left,
    "top": top
  };
}
//截取
function cut(e) {
  var region = document.getElementsByClassName('region')[0];
  region.style.display='none';
  var cut_img = document.getElementById('cut-imgcvs');//背后的canvas
  var imgData = imgCvs.getImageData(0,0,400,400);
  imgCvs.clearRect(0,0,1140,1140);
  imgCvs.putImageData(imgData,0,0,0,0,(clip_right - clip_left)*2, (clip_bottom - clip_top)*2);
  var mainDiv = document.getElementById('img-main');
  var imageURL=cut_img.toDataURL("image/jpeg");
  //打印出base64位
  console.log(imageURL);
  window.alert('请在控制台查看截取出来图片的base64');
  //重置
  document.getElementById("upload_file").name='';
  document.getElementById("upload_file").value='';
  imgCvs.clearRect(0,0,1140,1140);
  isDraging=false;
  contact='';
  clip_top= 0;
  clip_right=200;
  clip_bottom=200;
  clip_left=0;
  img_width= 0;
  img_height= 0;
  rect='';
  mainDiv.style.height='200px';
  mainDiv.style.width='200px';
  mainDiv.style.top='0px';
  mainDiv.style.left='0px';
  imgclip.style.clip = "rect(0px,200px,200px,0px)";
}
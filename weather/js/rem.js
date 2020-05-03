let id="style";
    function setRem(){
      var width=375;
      var fs=innerWidth/width*100+"px";
      var style=document.createElement("style");
      style.innerHTML=`html{font-size:${fs}}`
      style.setAttribute("id",id)
      document.head.appendChild(style)
    }
setRem()
let timer=null;
window.onresize=function(){
  console.log(timer)
  if(timer!==null){
    clearTimeout(timer)
  }
  console.log(timer)
  timer=setTimeout(() => {
    var s=document.getElementById("style");
    if(s){
      s.remove();
    }
    setRem()
  }, 500);
}
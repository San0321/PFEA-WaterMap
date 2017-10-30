
function displayText(num) {
    if (num === 1) {
        hideBeach();
        $('#elfaro').show();
        currentBeach = 1; 
        
    } else if (num === 2) {
        hideBeach();
        $('#parque').show(); 
        currentBeach = 2;   
             
    } else if (num === 3) {
        hideBeach();
        $('#canada').show(); 
        currentBeach = 3;       
          
    } else if (num === 4) {
        hideBeach();
        $('#elvigia').show();  
        currentBeach = 4;     
           
    } else if (num === 5) {
        hideBeach();
        $('#sanantonio').show();    
        currentBeach = 5;   
           
    }
}

function hideBeach(){
    if(currentBeach == 0)
        $('#defaultpanel').hide();
    else if(currentBeach == 1){
        $('#elfaro').hide();
    }
    else if(currentBeach == 2)
        $('#parque').hide();
    else if(currentBeach == 3)
        $('#canada').hide();
    else if(currentBeach == 4)
        $('#elvigia').hide();
    else if(currentBeach == 5)
        $('#sanantonio').hide();
}


function loadListColor(el, num){
    var colors = ["#2ECC71", "#186A3B", "#F4D03F", "#D4AC0D", "#E67E22","#A04000"];
    console.log("id of box is " + el + "num is " +num);
    document.getElementById(el).style.background=findColor(num);
    console.log("changing color to" + findColor(num));
}

function changeColor(ef, pm, ca, ev, sa) {
    var colors = ["#2ECC71", "#186A3B", "#F4D03F", "#D4AC0D", "#E67E22","#A04000"];

    document.getElementById("area1").style.background = findColor(ef);
    document.getElementById("area2").style.background = findColor(pm);
    document.getElementById("area3").style.background = findColor(ca);
    document.getElementById("area4").style.background = findColor(ev);
    document.getElementById("area5").style.background = findColor(sa);
}


function findColor(index){
    if(index == -5)
        return "#FFFFFF";
    if(index>=0 && index<= 30)
        return "#66ffff";
    if(index>=31 && index<= 60)
        return "#66ff99";
    if(index>=61 && index<= 90)
        return "#00cc00";
    if(index>=91 && index<= 120)
        return "#ccff33";
    if(index>=121 && index<= 150)
        return "#ffcc00";
    if(index>=151 && index<= 180)
        return "#ff9933";
    if(index>=181 && index<= 210)
        return "#ff6600";
    if(index>=211 && index<= 240)
        return "#ff3300";
    if(index>=241 && index<= 270)
        return "#ff0000";
    if(index>=271 && index<= 300)
        return "#cc0000";
    if(index>=301 && index<= 330)
        return "#cc0066";
    if(index>=331 && index<= 360)
        return "#990099";
    if(index>=361 && index<= 390)
        return "#6600cc";
    if(index>=391 && index<= 420)
        return "#660066";
    if(index>421)
        return "#660033";
}


var currentBeach = 0; 


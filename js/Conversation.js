import(/* webpackChunkName: "od-survey" */ "./ol_od_survey.js").then(_ => selectors[0].current.click());
function loadXMLDoc() { 
    var xmlhttp = new XMLHttpRequest(); 
    xmlhttp.onreadystatechange = function () { 
        // Request finished and response  
        // is ready and Status is "OK" 
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { 
            empDetails(xmlhttp); 
        } 
    };
    title = "xml/" + conversation.replace(/\s/g, '') + "_2024.07.18.xml";
    xmlhttp.open("GET", title, true); 
    xmlhttp.send(); 
}
let volumeNum = 0;
let audioTagLength = 0;
let audio = new Audio("audio/"+conversation.replace(/\s/g, '')+".mp3");
audio.pause();
function empDetails(xml) { 
    var xmlDoc = xml.responseXML; 
    var annotation = xmlDoc.getElementsByTagName("annotation");
    var table = '';
    for(let i = 1; i < annotation.length; i++){
        table += `<div class = "annotations"> `;
        let tempMorph = annotation[i].getElementsByTagName("morph")[0].innerHTML.split(" ");
        let morphString="";
        let tempGloss = annotation[i].getElementsByTagName("gloss")[0].innerHTML.split(" ");
        let glossString="";
        let morphCount = 0;
        let glossCount = 0;
        for(let d = 0; d<tempMorph.length; d++){
            if(tempMorph[morphCount]=="[speaker"){
                morphCount++;
                tempMorph[morphCount]=tempMorph[morphCount-1]+" "+tempMorph[morphCount];
            }
            if(tempGloss[glossCount]=="[speaker"){
                glossCount++;
                tempGloss[glossCount]=tempGloss[glossCount-1]+" "+ tempGloss[glossCount];
            }
            morphString+='<span class="part segPart'+d+'">'+ tempMorph[morphCount]+'</span>';
            glossString+='<span class="part glossPart'+d+'">'+ tempGloss[glossCount]+'</span>';
            morphCount++;
            glossCount++;
        }
        let timestamp = annotation[i].getElementsByTagName("timestamp")[0].innerHTML;
        let iu = annotation[i].getElementsByTagName("iu")[0].innerHTML;
        let eng = annotation[i].getElementsByTagName("eng")[0].innerHTML;
        if(annotation[i].getAttribute("who")!=annotation[i-1].getAttribute("who")){
            table += '<div class = "speaker">'  + annotation[i].getAttribute("who") + '</div>';
        }
        table += '<div class = "timestamp transcriptElement"><span class="elementTitle"><button id="timeButton" onclick="setAudioTime(this)">Timestamp</button></span>' + timestamp + '</div>';
        table += '<div class = "iu transcriptElement"><span class="elementTitle">IU</span>' + iu + '</div>';
        table += '<div class = "seg transcriptElement"><span class="elementTitle">Morph</span>' + morphString + '</div>';
        table += '<div class = "gloss transcriptElement"><span class="elementTitle">Gloss</span>' + glossString + '</div>';
        table += '<div class = "eng transcriptElement"><span class="elementTitle">English</span>' + eng + '</div>';
        table += '</div>'
    }
    document.getElementById("table").innerHTML = table;
    let metadataString = "";
    let metadata = xmlDoc.getElementsByTagName("metadata")[0];
    metadataString += '<div class = "metadataSubtitle Document"> Document</div>';
    let j = 0;
    for(j = 1; j < metadata.childNodes.length-4; j+=2){
        metadataString += '<div class = metadataElement '+metadata.childNodes[j].tagName+'"><span class="metadataTitle">'+metadata.childNodes[j].tagName.substring(0, 1).toUpperCase()+metadata.childNodes[j].tagName.substring(1).replace(/_/g, " ")+'</span>' + metadata.childNodes[j].innerHTML.replace(/_/g, "-") + '</div>';
    }
    metadataString += '<div class = "metadataSubtitle '+metadata.childNodes[j].tagName+'"> '+metadata.childNodes[j].tagName.substring(0, 1).toUpperCase()+metadata.childNodes[j].tagName.substring(1).replace(/_/g, " ")+'</div>';
    //Speakers
    let speakerSize = metadata.childNodes[j].childNodes.length;
    let metadataSubString; 
    for(let s = 1; s < speakerSize; s+=2){
        metadataSubString = metadata.childNodes[j].childNodes[s];
        metadataString += '<div class = "metadataElement '+metadataSubString.tagName+'"><span class="metadataTitle">'+metadataSubString.tagName.substring(0, 1).toUpperCase()+metadataSubString.tagName.substring(1).replace(/_/g, " ")+'</span>' + '</div>';
        let size = metadataSubString.childNodes.length;
        for(let p = 1; p < size; p+=2){
            let metadataSubSubString = metadataSubString.childNodes[p];
            metadataString += '<div class = "'+metadataSubSubString.tagName+' metadataElement"><span class="metadataTitle">'+metadataSubSubString.tagName.substring(0, 1).toUpperCase()+metadataSubSubString.tagName.substring(1).replace(/_/g, " ")+'</span>' + metadataSubSubString.innerHTML + '</div>';
        }
    }
    j+=2;
    metadataString += '<div class = "metadataSubtitle '+metadata.childNodes[j].tagName+'"> '+metadata.childNodes[j].tagName.substring(0, 1).toUpperCase()+metadata.childNodes[j].tagName.substring(1).replace(/_/g, " ")+'</div>';
    let creatorSize = metadata.childNodes[j].childNodes.length;
    for(let p = 1; p < creatorSize; p+=2){
        metadataSubString = metadata.childNodes[j].childNodes[p];
        metadataString += '<div class = "'+metadataSubString.tagName+' metadataElement"><span class="metadataTitle">'+metadataSubString.tagName.substring(0, 1).toUpperCase()+metadataSubString.tagName.substring(1).replace(/_/g, " ")+'</span>' + metadataSubString.innerHTML + '</div>';
    }
    document.getElementById("metadata").innerHTML += metadataString;
}
document.addEventListener('DOMContentLoaded', function() {
    let conversationHeader = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Corpus of Conversationl Uyghur</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"><link rel="stylesheet" href="css/styles.css"><link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap" rel="stylesheet"><script src = "js/jquery-2.1.4.min.js"> </script></head><body><header><nav id="nav" class="navbar navbar-expand-sm navbar-light"><div id="nav-container" class="container"><a id="brand" class="navbar-brand align-middle" href="English-Home.html">Corpus of Conversational Uyghur</a><div class="lang-switcher"> <button class="lang-option selected" onclick="switchLanguage(\'en\', this)">English</button> <button class="lang-option" onclick="switchLanguage(\'uy\', this)">Uyghurche</button> <button class="lang-option" onclick="switchLanguage(\'ar\', this)">ئۇيغۇرچە</button> <button class="lang-option" onclick="switchLanguage(\'cy\', this)">уйғурчә</button> </div>'+
    '</ul></div></div></nav></header>';
    let conversationBody = '<div id="main-content" class="container"> <div id="container" class="container"> <div id="homepage-container" class="row"> <h1 id = "top" class="title text-center"> Conversation </h1> <div id="intro"> <ul id="toggle-collection"> <li style = "justify-content: center;" class="hold">Select Tiers to Display</li> <li class="hold form-check form-switch"> <div id="check-holder"> <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked></input> </div> <label class="form-check-label" for="flexSwitchCheckDefault">Intonation Unit </label> </li> <li class="hold form-check form-switch"> <div id="check-holder"> <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked> </div> <label class="form-check-label" for="flexSwitchCheckDefault">Morphemes </label> </li> <li class="hold form-check form-switch"> <div id="check-holder"> <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked> </div> <label class="form-check-label" for="flexSwitchCheckDefault">Gloss </label> </li> <li class="hold form-check form-switch"> <div id="check-holder"> <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked> </div> <label class="form-check-label" for="flexSwitchCheckDefault">English Translation </label> </li> </ul> <div id="rest-collection"> <div id="audio-container"><div class="recording"><button id="playButton" onclick="togglePlayback()"></button><p id=audiotime>'+
    '00:00/00:00</p><input type="range" id="playbar" name="playbar" min="0" max="1" value="0" step="0.01" class="playbar"><div id="volumediv"><label id="volumelbl" for="volume"><img class = "smallimage" src="images/VolumeOn.svg"</img></label><input type="range" id="volume" name="volume" min="0" max="1" step="0.01" value="0.5" class="volumebar"></input></div><div id="speeddiv"><label for="speed"><img class = "smallimage" src="images/gear.svg"</img></label><select id="speed" name="speed"><option>Playback Speed</option><option value="0.25"> 0.25</option><option value="0.5"> 0.5</option><option value="0.75"> 0.75</option><option value="1"selected>Normal</option><option value="1.25"> 1.25</option><option value="1.5"> 1.5</option><option value="1.75"> 1.75</option><option value="2"> 2</option></select></div></div></div><a class="scroll" href="#top"> Scroll to top </a>  <a class="scroll" href="#metadata"> Scroll to bottom for metadata </a> </div> </div> <div id="conversation-page-container" class="container"> <div id = "table"> </div> <a class="scroll" href="#top"> Scroll to top </a> <div id="metadata"> <div class="title text-center"> Metadata </div> </div> </div> </div> </div> </div>';
    let html = document.querySelector("html");
    html.innerHTML = conversationHeader + conversationBody + html.innerHTML;
    audioTagLength = audio.src.length;
    document.getElementsByClassName("title")[0].innerText= conversation;
    let conversationFooter = '<div class="container"> <div class="row"> <section id="contact" class="text-center"> <span>Contact: </span> <br> Email - <a class="footerLink" href="mfiddler@ucsb.edu">mfiddler@ucsb.edu</a> <br> Web design - Haibibullah Abdul-Kerim <p>*Project organized by Michael Fiddler, in collaboration with the <a class="footerLink" href="https://uyghursfoundation.org/en/">Uyghur Projects Foundation</a></p> <hr class="visible-xs text-center"> </section> </div> <div class="text-center">© Copyright Michael Fiddler 2022 </div> </div>';
    let footer = document.querySelector("footer");
    if(footer.innerHTML === ""){
        footer.innerHTML = conversationFooter;
    }
    
    loadXMLDoc();
    var selectors = document.getElementsByClassName("form-check-input");
var iu = document.getElementsByClassName("iu");
var morph = document.getElementsByClassName("seg");
var gloss = document.getElementsByClassName("gloss");
var eng = document.getElementsByClassName("eng");
    selectors[0].addEventListener('click', function(){
        change(iu);
    });
    selectors[1].addEventListener('click', function(){
        change(morph);
    });
    selectors[2].addEventListener('click', function(){
        change(gloss);
    });
    selectors[3].addEventListener('click', function(){
        change(eng);
    });
    const volumeControl = document.getElementById('volume');
    volumeControl.style.background = "linear-gradient(to right, #777 0%, #000 " + Math.round(volumeControl.value * 100).toString() +"%, #fff " + Math.round(volumeControl.value * 100).toString() +"%, #fff 100%)";
    const speedControl = document.getElementById('speed');
    const playbar = document.getElementById('playbar');
    const volumelbl = document.getElementById('volumelbl');
    audio.volume = volumeControl.value;
    volumeControl.addEventListener('input', function() {
        audio.volume = this.value;
        this.style.background = "linear-gradient(to right, #777 0%, #000 " + Math.round(this.value * 100).toString() +"%, #fff " + Math.round(this.value * 100).toString() +"%, #fff 100%)";
    });
    volumelbl.addEventListener('click', function(){
        volumeControl.style.background = "linear-gradient(to right, #777 0%, #000 " + Math.round(volumeNum * 100).toString() +"%, #fff " + Math.round(volumeNum * 100).toString() +"%, #fff 100%)";
        if(audio.volume !== 0){
            volumeNum = audio.volume;
            volumeControl.value = 0;
            volumelbl.firstChild.src="images/VolumeOff.svg";
            audio.volume = 0;
        }
        else{
            audio.volume = volumeNum;
            volumeControl.value = volumeNum;
            volumelbl.firstChild.src="images/VolumeOn.svg";
            volumeNum = 0;
        }
    });
    speedControl.addEventListener('input', function() {
        audio.playbackRate = this.value;
    });
    playbar.addEventListener('input', function() {
        audio.currentTime = this.value * audio.duration;
        updatePlaybar();
    });
});

function change(cur){
for(let i=0; i<cur.length; i++){
    if (cur[i].style.display === 'none'){
        cur[i].style.display = 'flex';
        window.setTimeout(function(){
            cur[i].style.opacity = 1;
            cur[i].style.transform = 'scale(1)';
        },0);
    }
    else{
        cur[i].style.opacity = 0;
        cur[i].style.transform = 'scale(0)';
        window.setTimeout(function(){
        cur[i].style.display = 'none';
        },700);
    }
}
}
function setAudioTime(elem){
    let time = elem.parentNode.parentNode.childNodes[1].nodeValue.split("-")[0].substring(3);
    const [m,s] = time.split(":");
    const seconds = (parseInt(m,10)*60+parseInt(s,10));
    audio.currentTime=seconds;
    audio.play();
    updatePlaybar();
}

window.addEventListener("load", function(e) { 
    setTimeout(() => {
        let max = 0;
        let morphParts = document.getElementsByClassName("seg");
        let glossParts = document.getElementsByClassName("gloss");
        for(let c = 0; c<Math.min(morphParts.length, glossParts.length); c++){
            let morphLine = morphParts[c].childNodes;
            let glossLine = glossParts[c].childNodes;
            for(let d = 1; d<Math.min(morphLine.length, glossLine.length); d++){
                max = Math.max(morphLine[d].offsetWidth, glossLine[d].offsetWidth)+10;
                morphLine[d].style.width=max+"px";
                glossLine[d].style.width=max+"px";
            }
        }
    }, 1);
    var r = document.querySelector(':root');
    r.style.setProperty("--height", (getComputedStyle(r)["height"]));
});
function togglePlayback() {
if (audio.paused) {
        audio.play();
        updatePlaybarInterval = setInterval(updatePlaybar, 100); // Update playbar every 100 milliseconds
    } else {
        audio.pause();
        clearInterval(updatePlaybarInterval); // Clear the interval
    }
}
function updatePlaybar() {
    playbar.value = audio.currentTime / audio.duration;
    const audtime= document.getElementById("audiotime");
    const current= new Date(parseInt(audio.currentTime,10)*1000).toISOString().slice(14,19);
    const dura= new Date(parseInt(audio.duration,10)*1000).toISOString().slice(14,19);
    audtime.innerText = current+'/'+dura;
    playbar.style.background = "linear-gradient(to right, #777 0%, #000 " + Math.round(playbar.value * 100).toString() +"%, #fff " + Math.round(playbar.value * 100).toString() +"%, #fff 100%)";
}
document.getElementById("playbar").oninput = function() {
    this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 '+this.value +'%, #fff ' + this.value + '%, white 100%)'
    console.log(this);
};


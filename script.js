let currentUser = null;

// login
function login(){
    let user = document.getElementById("username").value;
    if(!user) return alert("Enter username");

    localStorage.setItem("user", user);
    currentUser = user;
    startApp();
}

function guest(){
    currentUser = "guest";
    startApp();
}

function logout(){
    localStorage.removeItem("user");
    location.reload();
}

function startApp(){
    document.getElementById("auth").style.display="none";
    document.getElementById("app").style.display="block";

    if(currentUser !== "guest"){
        loadHistory();
    }
}

// QR generate
function generateQR(){
    let data = document.getElementById("data").value;
    let color = document.getElementById("color").value;

    if(!data){
        alert("Enter something");
        return;
    }

    document.getElementById("qrcode").innerHTML="";

    new QRCode(document.getElementById("qrcode"),{
        text:data,
        width:200,
        height:200,
        colorDark:color,
        colorLight:"#000"
    });

    if(currentUser !== "guest"){
        saveHistory(data);
    }
}

// download
function downloadQR(){
    let canvas = document.querySelector("#qrcode canvas");
    if(!canvas) return alert("Generate first!");

    let link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "qr.png";
    link.click();
}

// scanner
function startScanner(){
    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if(devices.length){
            html5QrCode.start(
                devices[0].id,
                { fps:10, qrbox:200 },
                msg=>{
                    alert("Scanned: " + msg);
                    html5QrCode.stop();
                }
            );
        }
    });
}

// history
function saveHistory(data){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(data);
    localStorage.setItem("history", JSON.stringify(history));
    loadHistory();
}

function loadHistory(){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let div = document.getElementById("history");

    div.innerHTML = "<b>History:</b><br>";
    history.slice(-5).reverse().forEach(item=>{
        div.innerHTML += "• " + item + "<br>";
    });
}

/* 🌌 PARTICLES (FIXED SAFE VERSION) */
window.addEventListener("load", () => {

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();

let particles = [];

class Particle {
    constructor(){
        this.reset();
    }

    reset(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x < 0 || this.x > canvas.width ||
           this.y < 0 || this.y > canvas.height){
            this.reset();
        }
    }

    draw(){
        ctx.fillStyle = "rgba(0,255,204,0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init(){
    particles = [];
    let count = Math.floor(window.innerWidth / 25);

    for(let i = 0; i < count; i++){
        particles.push(new Particle());
    }
}

function connect(){
    for(let i = 0; i < particles.length; i++){
        for(let j = i + 1; j < particles.length; j++){

            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;

            let dist = dx*dx + dy*dy;

            if(dist < 10000){
                ctx.strokeStyle = "rgba(0,255,204,0.12)";
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let p of particles){
        p.update();
        p.draw();
    }

    connect();
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
    resize();
    init();
});

});
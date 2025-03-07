function loadContent(page, event) {
 event.preventDefault();

 fetch(page)
     .then(response => response.text())
     .then(data => {
         const contentDiv = document.getElementById("content");
         contentDiv.innerHTML = data;

         if (page.includes("login.html")) {
             console.log("📢 login.html inserted, loading login.js...");
             setTimeout(() => {
                 loadScript("/js/login.js"); // Ensures script loads AFTER content
             }, 200);
         }
         else{
             
             if(page.includes("signup.html")){
                 console.log("📢 signup.html inserted, loading signup.js...");
             setTimeout(() => {
                 loadScript("/js/signup.js"); // Ensures script loads AFTER content
             }, 200);
          }
         }
     })
     .catch(error => console.error("❌ Error loading page:", error));
}


function loadScript(src) {
 let script = document.createElement("script");
 script.src = src;
 script.type = "text/javascript";
 script.defer = true;
 script.onload = () => console.log(`✅ Loaded script: ${src}`);
 script.onerror = () => console.error(` Failed to load script: ${src}`);
 document.body.appendChild(script);
}

// Load home content by default
window.onload = function() {
         loadContent('/html/internal-content.html', new Event('click'));
};

 
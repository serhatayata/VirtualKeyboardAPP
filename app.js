const Keyboard = {
    elements : {
        main:null,
        keysContainer:null,
        keys:[]
    },
    eventHandlers:{
        oninput:null,
        onclose:null
    },
    properties : {
        value:"",
        capsLock:false
    },
    init(){ // first loading, keyboard - ilk yüklemede klavye
      // Create main elements - Elementleri olusturma
      this.elements.main = document.createElement("div");
      this.elements.keysContainer = document.createElement("div");
      //Add main class - main class'ına ekleme
      this.elements.main.classList.add("keyboard","keyboard-hidden");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.keysContainer.appendChild(this._createKeys());
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
      // Add to DOM -- DOM'a ekleme
      this.elements.main.appendChild(this.elements.keysContainer);
      document.body.appendChild(this.elements.main);
      // Automatically use keyboard for elements with .use-keyboard-input 
       document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });

    },
    _createKeys(){
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1","2","3","4","5","6","7","8","9","0","backspace",
            "q","w","e","r","t","y","u","i","o","p",
            "caps","a","s","d","f","g","h","j","k","l","enter","done","z","x","c","v","b","n","m",",",".","?",
            "space"
        ];
        // Create HTML for an icon -- icon icin HTML oluşturma
        const createIconHTML = (icon_name) =>{
            return `<i class="material-icons">${icon_name}</i>`
        }
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace","p","enter","?"].indexOf(key) !== -1; // If key is equal to one of these - Eger key bunlardan biri ise;

            // Add attributes / classes 
            keyElement.setAttribute("type","button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                //BACKSPACE
                case "backspace" : 
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length -1);
                        this._triggerEvent("oninput");
                    });
                    break;
                // CAPSLOCK
                case "caps" : 
                    keyElement.classList.add("keyboard__key--wide","keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active",this.properties.capsLock); // if capsLock is true it will be forced to toggle the class
                    });
                    break;
                // ENTER
                case "enter" : 
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });
                    break;
                // SPACE
                case "space" : 
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });
                    break;
                case "done" : 
                    keyElement.classList.add("keyboard__key--wide","keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");
                    
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;
                //STANDART KEYS
                default : 
                    keyElement.textContent = key.toLowerCase();
                    
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase()  : key.toLowerCase();
                        this._triggerEvent("oninput");
                        console.log(this.properties.value);
                        document.getElementsByClassName("use-keyboard-input")[0].innerHTML = this.properties.value;
                    });
                    
                    break;
            }
            fragment.appendChild(keyElement);
            if(insertLineBreak){
                fragment.appendChild(document.createElement("br"));
            }
        })
        return fragment; 
    },
    _triggerEvent(handlerName){ //triggers oninput or onclose
        if(typeof this.eventHandlers[handlerName] == "function"){
            this.eventHandlers[handlerName](this.properties.value);
        }
    },
    _toggleCapsLock(){
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if(key.childElementCount === 0){ // if the code has specidied a function for the handler
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },
    open(initialValue,oninput,onclose){
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },
    openKeyboard(){
        this.elements.main.classList.remove("keyboard--hidden");
    },
    close(){
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded",function(){
    Keyboard.init();
});

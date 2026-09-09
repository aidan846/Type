//const app = document.getElementById("app");
//const words = document.getElementById("words");
export let currentIndex = 0;

export function input() {
    document.addEventListener("keydown", (event) => { 
        if (event.key.length === 1) {
            console.log("Typed:", event.key);
            currentIndex += 1;
        }
        if (event.key === "Backspace") {
            console.log("Backspace");
            if (currentIndex > 0) {
                currentIndex -= 1;
            }
        }
    });
}
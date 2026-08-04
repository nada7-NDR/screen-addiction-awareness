// Function to show a random tip
function showAdvice() {
    const tips = [
        "Turn off notifications for an hour.",
        "Read a chapter of a book instead of scrolling.",
        "Go for a 10-minute walk without your phone.",
        "Move social media apps to the last screen.",
        "Keep your phone away during meals."
    ];
    const index = Math.floor(Math.random() * tips.length);
    const adviceBox = document.getElementById("adviceBox");
    if (adviceBox) {
        adviceBox.innerText = tips[index];
    }
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}



// Initialize AOS animation
document.addEventListener("DOMContentLoaded", function () {
    AOS.init();
});

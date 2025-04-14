// Select all team member elements
const teamMembers = document.querySelectorAll('.team-member');

teamMembers.forEach(member => {
    let hoverTimeout;

    member.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            member.classList.add('hover-active'); // Glow effect
            expandBox(member); // Expand box and show extra info
        }, 150); // Small delay to prevent flickering
    });

    member.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            member.classList.remove('hover-active'); // Remove glow
            shrinkBox(member); // Shrink box and hide extra info
        }, 150);
    });
});

// Function to Expand Box and Show Extra Info
function expandBox(member) {
    member.classList.add('expand'); // Add expansion class

    // Adding extra info dynamically if not already added
    let info = member.querySelector(".info");
    if (!info.querySelector(".extra-info")) {
        let extraInfo = document.createElement("p");
        extraInfo.classList.add("extra-info");
        extraInfo.innerText = "Highly skilled in AI, NLP, and System Development.";
        info.appendChild(extraInfo);
    }
}

// Function to Shrink Box and Remove Extra Info
function shrinkBox(member) {
    member.classList.remove('expand'); // Remove expansion class

    // Remove extra info after transition delay to prevent flickering
    setTimeout(() => {
        let extraInfo = member.querySelector(".extra-info");
        if (extraInfo) {
            extraInfo.remove();
        }
    }, 200); // Delay to match transition
}

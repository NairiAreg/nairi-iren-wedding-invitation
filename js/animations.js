document.addEventListener("DOMContentLoaded", function () {
  console.log("Animation script loaded");

  // Select all elements with animation classes
  const animatedElements = document.querySelectorAll(".animated");
  console.log("Found", animatedElements.length, "animated elements");

  // Keep track of animated elements to prevent double animations
  const animatedMap = new Map();

  // Function to apply animations - now only used by the intersection observer
  function applyAnimation(element) {
    try {
      // Skip if already animated
      if (animatedMap.has(element)) {
        return;
      }

      // Special handling for the problem element
      if (element.classList.contains("elementor-element-9c267de")) {
        console.log("Complete animation reset for 9c267de element");

        // Clear ALL existing style properties that could affect animation
        element.style.cssText = "";

        // Remove any animation classes that might be affecting it
        element.classList.remove("fadeIn", "fadeInUp", "zoomIn");

        // Only add the fadeInDown class and mark as animated
        element.classList.add("fadeInDown");
        element.setAttribute("data-animated", "true");

        // Mark as handled in our map
        animatedMap.set(element, true);

        return; // Skip the rest of the function
      }

      // Get settings
      const settingsStr = element.getAttribute("data-settings");

      const settings = settingsStr ? JSON.parse(settingsStr) : {};

      // Get animation type (check both formats)
      const animation = settings._animation || settings.animation;

      // Get delay
      const delay = settings._animation_delay || settings.animation_delay || 0;

      if (animation) {
        console.log(
          "Applying animation:",
          animation,
          "to element:",
          element.className
        );

        // Force visibility
        element.style.opacity = "1";
        element.style.visibility = "visible";

        // Set delay
        element.style.animationDelay = `${delay}ms`;

        // Apply animation directly
        element.style.animationName = animation;
        element.style.animationDuration = "1.5s";
        element.style.animationFillMode = "both";

        // Also add class for CSS-based animation
        element.classList.add(animation);

        // Mark as animated
        animatedMap.set(element, true);
      }
    } catch (error) {
      console.error("Error applying animation:", error);
    }
  }

  // Set up intersection observer for scroll-based animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Apply animation when the element enters the viewport
          applyAnimation(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // Element is 15% visible before animation triggers
      rootMargin: "0px",
    }
  );

  // Observe all animated elements
  animatedElements.forEach((element) => {
    // Special handling for the problem element - it should be completely still until animated
    if (element.classList.contains("elementor-element-9c267de")) {
      // Make invisible but keep in place
      element.style.opacity = "0";
      element.style.visibility = "visible";
      element.style.transform = "none";
      element.style.transition = "none";

      // Reset any classes that might cause animation
      element.classList.remove("fadeInDown", "fadeInUp", "fadeIn");
    }
    // Reset the element to be invisible until it enters viewport
    else if (!element.classList.contains("animate-immediately")) {
      // Make sure the element is initially hidden
      element.style.opacity = "0";
      element.style.visibility = "visible"; // Keep visible to prevent layout shifts
    }

    // Begin observing the element
    observer.observe(element);
  });

  // Special handling for our three specific elements
  const targets = [
    { selector: ".elementor-element-9c267de", animation: "fadeInDown" },
    { selector: ".elementor-element-f3b5f69", animation: "fadeIn" },
    { selector: ".elementor-element-a63d242", animation: "fadeInUp" },
  ];

  // Register these elements with the observer and set initial state
  targets.forEach(function ({ selector, animation }) {
    const element = document.querySelector(selector);
    if (element) {
      console.log("Registering", selector, "for scroll animation");

      // Special handling for 9c267de element
      if (selector === ".elementor-element-9c267de") {
        // Make invisible but keep it in place
        element.style.opacity = "0";
        element.style.visibility = "visible";
        element.style.transform = "none";
        element.style.transition = "none";

        // Make sure image is prepared for animation
        const img = element.querySelector("img");
        if (img) {
          img.style.opacity = "0";
          img.style.visibility = "visible";
          img.style.transform = "none";
          img.style.transition = "none";
        }
      }
      // Standard handling for other elements
      else {
        // Make sure the image is prepared for animation
        const img = element.querySelector("img");
        if (img) {
          img.style.opacity = "0";
          img.style.visibility = "visible";
        }
      }

      // Only start observing if not already being observed
      if (!element.classList.contains("animated")) {
        element.classList.add("animated");
        observer.observe(element);
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with animation classes
  const animatedElements = document.querySelectorAll(".animated");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          // Parse settings and handle both formats (_animation and animation)
          const settings = JSON.parse(element.dataset.settings || "{}");
          const animation = settings._animation || settings.animation;
          const delay =
            settings._animation_delay || settings.animation_delay || 0;

          // Remove any existing animation classes
          element.classList.remove(
            "fadeIn",
            "fadeInUp",
            "fadeInLeft",
            "fadeInRight"
          );

          // Add animation delay
          element.style.animationDelay = `${delay}ms`;

          // Force a reflow to restart animation
          void element.offsetWidth;

          // Add animation class
          element.classList.add(animation);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  // Observe all animated elements
  animatedElements.forEach((element) => observer.observe(element));
});

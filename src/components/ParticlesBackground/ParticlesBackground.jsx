// import './ParticlesBackground.css';

// const ParticlesBackground = () => {
//   // Generate random particles
//   const particles = Array.from({ length: 80 }, (_, i) => ({
//     id: i,
//     left: Math.random() * 100,
//     top: Math.random() * 100,
//     size: Math.random() * 3 + 1,
//     duration: Math.random() * 20 + 10,
//     delay: Math.random() * 5,
//   }));

//   return (
//     <div className="particles-background">
//       {particles.map((particle) => (
//         <div
//           key={particle.id}
//           className="particle"
//           style={{
//             left: `${particle.left}%`,
//             top: `${particle.top}%`,
//             width: `${particle.size}px`,
//             height: `${particle.size}px`,
//             animation: `float ${particle.duration}s infinite linear`,
//             animationDelay: `${particle.delay}s`,
//           }}
//         />
//       ))}
//       <div className="particles-gradient-1" />
//       <div className="particles-gradient-2" />
//     </div>
//   );
// };

// export default ParticlesBackground;

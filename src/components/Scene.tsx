import { useEffect } from 'react';

export default function Scene({ scene }: { scene: string }) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    switch (scene) {
      case '00':
        import('../scenes/00-scene').then((module) => {
          const createScene = module.default;
          createScene();
        });
        break;
      case '01':
        import('../scenes/01-scene').then((module) => {
          const createScene = module.default;
          createScene();
        });
        break;
      case '02':
        import('../scenes/02-scene/script.js').then((module) => {
          const createScene = module.default;
          cleanup = createScene();
        });
        break;
      case 'about':
        import('../scenes/about').then((module) => {
          const createScene = module.default;
          createScene();
        });
        break;
      default:
        break;
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return (
    <canvas
      id="scene"
      className="w-full h-full"
    ></canvas>
  );
}

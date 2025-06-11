import { useEffect } from 'react';

export default function Scene({ scene }: { scene: string }) {
  useEffect(() => {
    console.log(scene);
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
      case 'about':
        import('../scenes/about').then((module) => {
          const createScene = module.default;
          createScene();
        });
        break;
      default:
        break;
    }
  }, []);

  return (
    <canvas
      id="scene"
      className="w-full h-full"
    ></canvas>
  );
}

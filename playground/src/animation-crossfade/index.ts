import { Engine } from "@alipay/o3-core";
import { ADefaultCamera } from "@alipay/o3-default-camera";
import { ResourceLoader, Resource } from "@alipay/o3-loader";
import "@alipay/o3-loader-gltf";
import { AAnimation } from "@alipay/o3-animation";

import "@alipay/o3-engine-stats";

import { ACrossFadeControl } from "./ACrossFadeControl";

//-- create engine object
let engine = new Engine();

let scene = engine.currentScene;
let rootNode = scene.root;

//-- create camera
let cameraNode = rootNode.createChild("camera_node");
let camera = cameraNode.createAbility(ADefaultCamera, {
  canvas: "o3-demo",
  position: [0, 1.35, 5.5],
  target: [0, 1.1, 0]
});

// load resource config
const animationRes = new Resource("pig_glb", {
  type: "gltf",
  url: "https://gw.alipayobjects.com/os/r3/43bf0cbe-17c8-4835-88ff-f28636dd2b14/pig.gltf"
});

const resourceLoader = new ResourceLoader(engine);

// resourceLoader.loadConfig
resourceLoader.load(animationRes, (err, gltf) => {
  const pigPrefab = gltf.asset.rootScene.nodes[0];

  const animations = gltf.asset.animations;

  const pig = pigPrefab.clone();

  pig.rotateByAngles(0, 180, 0);

  let node = rootNode.createChild("gltf_node");
  node.addChild(pig);

  let book = pig.findChildByName("book_one");
  book.isActive = false;

  const animator = pig.createAbility(AAnimation);

  let aniNames = [];
  animations.forEach(clip => {
    animator.addAnimationClip(clip, clip.name);
    // channels数量一致的情况才能crossfade
    if (clip.channels.length === 96) {
      aniNames.push(clip.name);
    }
  });

  animator.playAnimationClip("walk");

  pig.createAbility(ACrossFadeControl, { animator, aniNames });
});

//-- run
engine.run();

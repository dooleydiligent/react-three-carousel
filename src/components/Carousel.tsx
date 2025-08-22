// https://cydstumpel.nl/
// https://tympanus.net/codrops/2023/04/27/building-a-webgl-carousel-with-react-three-fiber-and-gsap/
import { Image, Text, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

export function Rig(props: any) {
  const ref = useRef();
  const scroll = useScroll();
  useFrame((state, delta) => {
    if (ref && ref.current) {
      (ref.current as any).rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
      (state.events as any).update(); // Raycasts every frame rather than on pointer-move
      easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta); // Move camera
      state.camera.lookAt(0, 0, 0); // Look at center
    }
  });
  return <group ref={ref} {...props} />;
}

function Card({ url,  ...props }: any) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const pointerOver = (e: any) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((_state, delta) => {
    if (ref && ref.current) {
      easing.damp3((ref.current as any).scale, hovered ? 2.15 : 1, 0.1, delta);
      easing.damp((ref.current as any).material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta);
      easing.damp((ref.current as any).material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
    }
  });
  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      {...props}
    >
      {/* <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} /> */}
    </Image>
  );
}

export function Banner(props: any) {
  const ref = useRef();
  const texture = useTexture('work_.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  const scroll = useScroll();
  useFrame((_state, delta) => {
    if (ref && ref.current && (ref.current as any).material && (ref.current as any).material.time) {
      (ref.current as any).material.time.value += Math.abs(scroll.delta) * 4;
      (ref.current as any).material.map.offset.x += delta / 2;
    }
  });
  return (
    <mesh ref={ref} {...props}>
      <Text fontSize={0.2} color="gold" anchorX="center" anchorY="top" position={[0, -0.75, 0]}>
        Customer Reports
      </Text>
      {/* <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} /> */}
      {/* <meshSineMaterial
                map={texture}
                map-anisotropy={16}
                map-repeat={[30, 1]}
                side={THREE.DoubleSide}
                toneMapped={false}
            /> */}
    </mesh>
  );
}

export const Carousel = ({ radius, items, onSelected, sceneRef }: any): React.JSX.Element[] => {
  // export function Carousel({ radius = 3.4, count = 8 }) {

  // const meshRef = useRef<THREE.Mesh>(null);
  const meshRef = Array.from({ length: items.length }, (_) => useRef<THREE.Mesh>(null));
  const { camera } = useThree();
  const [selected, setSelected] = useState(-1)
  useFrame((_state, delta) => {
    for (let i = 0; i < items.length; i++) {
      if (meshRef && meshRef[i] && meshRef[i].current) {
        // meshRef[i].current.rotation.x += 1 * delta; // Rotate around X-axis
        (meshRef[i].current as any).rotation.y -= 0.5 * delta; // Rotate around Y-axis
        // (meshRef[i].current as any).rotation.y += (Math.PI + (1 / 5) * Math.PI * -0.01) * delta;
      }
    }
    // if (sceneRef && sceneRef.current) {
    //   (sceneRef.current as any).rotation.y -= 0.5 * delta;
    // }
  });

  const cards: JSX.Element[] = [];
  items.forEach((item: any, i: number) => {
    const position = [
      Math.sin((i / items.length) * Math.PI * 2) * radius,
      0,
      Math.cos((i / items.length) * Math.PI * 2) * radius,
    ];
    const rotation = [0, Math.PI + (i / items.length) * Math.PI * 2, 0];

    cards.push(
      <Card
            onClick={() => {
            setSelected(i);
          onSelected({
            ...item,
            order: i,
            position,
            rotation,
            camera,
            sceneRef,
          });
        }}
        key={item.name}
        url={item.image}
        // url={`https://picsum.photos/600/350?v=${Math.floor(i % 10) + 1}`}
        position={position}
        rotation={rotation}
            
      >
        <Text ref={meshRef[i]} position={[0, 0.75, 0]} fontSize={0.2} color="gold" anchorX="center" anchorY="top">
          {items[i].name}
        </Text>
      </Card>
    );
  });
  return cards;
};

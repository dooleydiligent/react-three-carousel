// https://cydstumpel.nl/

import { Environment, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Object3DEventMap } from 'three';
import { Carousel, Rig } from './components/Carousel';
import { Loading } from './components/Loading';

export const Customers = ({ signout }: any): JSX.Element => {
  const [customers, setCustomers]: any = useState([]);
  const [access_token, setAccessToken] = useState('');

  const [fov] = useState(15);
  const sceneRef = useRef<Group<Object3DEventMap>>(null);
  const [, setSelected] = useState<number>(0);
  const navigate = useNavigate();
  const [straightZ, setStraightZ] = useState(0.15);
  const [previousOrder, setPreviousOrder] = useState(0);

  const onSelected = (item: any) => {
    if (item.name == 'Sign Out') {
      signout(access_token);
    } else {
      setStraightZ(0);
      // Rotate the scene

      if (sceneRef && sceneRef.current) {
        if (previousOrder) {
          gsap.to((sceneRef.current as any).rotation, {
            duration: 1, // Animation duration in seconds
            y: ((360 / customers.length) * Math.PI * -1 * previousOrder) / -180,
            ease: 'power2.inOut', // Choose an appropriate easing function
          });
        }
        const angle = (360 / customers.length) * item.order;
        setPreviousOrder(item.order);
        console.log(`Rotating by ${angle} degrees`);

        gsap.to((sceneRef.current as any).rotation, {
          duration: 1, // Animation duration in seconds
          y: (angle * Math.PI) / -180,
        });

        setSelected(item.order);
        navigate(`/${item.name}`);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      //   setAccessToken(user.access_token);
      try {
        const dta = ['one-customer', 'another-customer', 'best-customer', 'oldest-customer'];

        if (dta.length > 0) {
          dta.unshift('Sign Out');
        }
        setCustomers(
          dta.map((d: string, i: number) => {
            return {
              name: d,
              image: i == 0 ? `exit-img.png` : `img${Math.floor(i % 10) + 1}_.jpg`,
            };
          })
        );
      } catch (ex: any) {
        console.warn(ex.message);
      }
    };
    fetchData();
  }, []);

  if (!customers || customers.length == 0) {
    return <Loading />;
  }

  return (
    <Canvas camera={{ position: [0, -1000, 0], fov }}>
      <fog attach="fog" args={['#a79', 8.5, 12]} />
      <group ref={sceneRef}>
        <ScrollControls pages={4} infinite>
          <Rig rotation={[0, 0, straightZ]}>
            <Carousel
              radius={0.75 + customers.length / 7}
              items={customers}
              onSelected={onSelected}
              sceneRef={sceneRef}
            />
          </Rig>
          {/* <Banner position={[0, -0.15, 0]} /> */}
        </ScrollControls>
        <Environment preset="dawn" background blur={0.5} />
      </group>
    </Canvas>
  );
};

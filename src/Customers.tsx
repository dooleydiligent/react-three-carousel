const customerData = ["howell", "test"];
// https://cydstumpel.nl/
import { Container } from "@mantine/core";
import { Environment, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group } from "three";
import type {Object3DEventMap} from "three";
import { Carousel, Rig } from "./components/Carousel";
import { Loading } from "./components/Loading";
import classes from "./Customers.module.css";
import { Reports } from "./Reports";
export const Customers = ({ signout, user }: any): React.JSX.Element => {
	const [customers, setCustomers]: any = useState([]);
	const [access_token] = useState("");
	const customerRef = useRef(null);
	const sceneRef = useRef<Group<Object3DEventMap>>(null);
	const [selected, setSelected] = useState<number>(-1);
	const navigate = useNavigate();
	const [straightZ, setStraightZ] = useState(0.15);
	const [fov] = useState(15);
	const [previousOrder, setPreviousOrder] = useState(0);
	const [customer, setCustomer]: any = useState(null);
	const [reports, setReports]: any = useState(null);
	const onSelected = (item: any) => {
		setCustomer(item);
		// Narrow the field of view
		gsap.to(item.camera, {
			fov: 5,
			duration: 2,
			onUpdate: function () {
				item.camera.updateProjectionMatrix();
			},
		});
		setStraightZ(0);

		// Rotate the scene

		if (sceneRef && sceneRef.current) {
			if (previousOrder) {
				gsap.to((sceneRef.current as any).rotation, {
					duration: 1, // Animation duration in seconds
					y: ((360 / customers.length) * Math.PI * -1 * previousOrder) / -180,
					ease: "power2.inOut", // Choose an appropriate easing function
				});
			}
			const angle = (360 / customers.length) * item.order;
			setPreviousOrder(item.order);

			gsap.to((sceneRef.current as any).rotation, {
				duration: 1, // Animation duration in seconds
				y: (angle * Math.PI) / -180,
			});

			setSelected(item.order);
			if (item.name == "Sign Out") {
				signout(access_token);
			} else {
				gsap.to(".customer", {
					backgroundImage: `url(${item.image})`,
					backgroundSize: "100% 100%",
					height: `95vh`,
					width: `100vw`,
					delay: 0,
					duration: 1,
				});
				const dataReports = [
					{
						id: "0",
						name: "report 1",
					},
					{
						id: "1",
						name: "report 2",
					},
					{
						id: "2",
						name: "report 3",
					},
					{
						id: "3",
						name: "report 4",
					},
					{
						id: "4",
						name: "report 5",
					},
				];
				const data = dataReports;

				setReports(
					data.map((d: any) => {
						return {
							id: d.id,
							name: d.report_type,
							image: `_report.png`,
						};
					})
				);

				gsap.to(".customer", {
					opacity: 1,
					duration: 5,
					display: "block",
					delay: 0.0,
				});
				gsap.to(".carousel", {
					opacity: 0,
					duration: 5,
					display: "none",
					delay: 0.5,
				});
			}
		}
	};

	const resetScene = async () => {
		gsap.to(".carousel", {
			opacity: 1,
			duration: 5,
			display: "block",
			delay: 0.5,
		});
		gsap.to(".customer", {
			opacity: 0,
			duration: 5,
			display: "none",
			delay: 0.0,
		});

		gsap.to(".customer", {
			backgroundImage: ``,
			height: `0vh`,
			width: `0vw`,
			delay: 0.5,
			duration: 1,
		});
		setCustomer(null);
		setStraightZ(0.15);
		if (previousOrder) {
			console.log(`Reversing previous rotation`);
			gsap.to((sceneRef.current as any).rotation, {
				duration: 1,
				y: ((360 / customers.length) * Math.PI * -1 * previousOrder) / -180,
				ease: "power2.inOut",
			});
			setPreviousOrder(0);
		}
		if (customer && customer.camera) {
			gsap.to(customer.camera, {
				fov: 15,
				duration: 2,
				onUpdate: function () {
					customer.camera.updateProjectionMatrix();
				},
			});
		}
		setStraightZ(0.15);
		navigate("/");
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dta = customerData;
				if (!dta.find((f: string) => f == "Sign Out")) {
					dta.unshift("Sign Out");
				}
				const c = dta.map((d: string, i: number) => {
					return {
						name: d,
						image: i == 0 ? `exit-img.png` : "img" + i + ".jpg",
					};
				});
				setCustomers(c);
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
		<div className={classes.pagecontainer} style={{ height: "95vh" }}>
			<Canvas
				className="carousel"
				style={{ display: "block", position: "absolute" }}
				camera={{ position: [0, -1000, 0], fov: fov }}
			>
				<fog attach="fog" args={["#a79", 8.5, 12]} />
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
					</ScrollControls>
					<Environment preset="dawn" background blur={0.5} />
				</group>
			</Canvas>
			<Container
				ref={customerRef}
				className="customer"
				style={{ display: "none", position: "absolute" }}
			>
				{selected && (
					<Reports
						base={customer}
						reset={resetScene}
						reports={reports}
						user={user}
					/>
				)}
			</Container>
		</div>
	);
};

import { Container, Text } from "@mantine/core";
import { Environment, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as d3 from "d3";
// import DataFrame from 'dataframe-js';
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { Object3DEventMap } from "three";
import { Group } from "three";
import { Carousel, Rig } from "./components/Carousel";
import { Loading } from "./components/Loading";
export const Reports = ({ base, reports, reset }: any): React.JSX.Element => {
	const [report, setReport]: any = useState(null);

	const [previousOrder, setPreviousOrder] = useState(0);
	const [, setSelected] = useState<number>(-1);
	const sceneRef = useRef<Group<Object3DEventMap>>(null);
	const reportRef = useRef(null);
	const [reportLoading, setReportLoading] = useState(false);
	const [, setReportData] = useState();
	const deselect = () => {
		gsap.to(".report-carousel", {
			opacity: 1,
			duration: 5,
			display: "block",
			delay: 0.5,
		});
		gsap.to(".report", {
			opacity: 0,
			duration: 5,
			display: "none",
			delay: 0.0,
		});

		gsap.to(".report", {
			backgroundImage: ``,
			height: `0vh`,
			width: `0vw`,
			delay: 0.5,
			duration: 1,
		});
		setReport(null);

		if (previousOrder) {
			console.log(`Reversing previous rotation`);
			gsap.to((sceneRef.current as any).rotation, {
				duration: 1,
				y: ((360 / reports.length) * Math.PI * -1 * previousOrder) / -180,
				ease: "power2.inOut",
			});
			setPreviousOrder(0);
		}
		if (report && report.camera) {
			gsap.to(report.camera, {
				fov: 15,
				duration: 2,
				onUpdate: function () {
					report.camera.updateProjectionMatrix();
				},
			});
		}
	};

	const onSelected = (item: any) => {
		setReport(item);
		// Narrow the field of view
		gsap.to(item.camera, {
			fov: 5,
			duration: 2,
			onUpdate: function () {
				item.camera.updateProjectionMatrix();
			},
		});

		if (sceneRef && sceneRef.current) {
			if (previousOrder) {
				// Reverse previous rotation
				gsap.to((sceneRef.current as any).rotation, {
					duration: 1,
					y: ((360 / reports.length) * Math.PI * -1 * previousOrder) / -180,
					ease: "power2.inOut",
				});
			}
			const angle = (360 / reports.length) * item.order;
			setPreviousOrder(item.order);
			// rotate to the selected item

			gsap.to((sceneRef.current as any).rotation, {
				duration: 1,
				y: (angle * Math.PI) / -180,
			});

			setSelected(item.order);
			// Get the contents of the report
			// setReportLoading(true);
			// fetch(`/report/${item.report_id}`, {
			//     headers: {
			//         'content-type': 'application/json',
			//         Authorization: `Bearer ${user.refresh_token}`,
			//     },
			// }).then(async (data: any) => {
			// if (item.record_path.endsWith('.json"')) {
			//     console.log(`Found json`);
			// } else {
			//     console.log(`NOT json`);
			// }
			// const dta = item.record_path.endsWith('.json"') ? await data.json() : await data.text();
			// console.log(`Got ${item.record_path}`, dta);

			// d3.select('.report').append('div').text(dta);

			// const report_data = new DataFrame(csvToJson(dta, '\t'));
			const report_data = {};
			setReportData(report_data as any);
			// console.log(`Converted it to `, report_data);
			gsap.to(".report", {
				backgroundImage: `url(${item.image})`,
				backgroundSize: "100% 100%",
				height: `97vh`,
				width: `97vw`,
				delay: 0,
				duration: 1,
			});
			setReportLoading(false);
		}
	};

	useEffect(() => {
		const handleKeyDown = (event: any) => {
			if (event.key === "Escape") {
				deselect();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [deselect]);

	useEffect(() => {
		// Select a paragraph element and change its text content
		d3.select(".report").text("Hello, D3.js!");
	}, []);

	if (!base || !reports) {
		return <Loading />;
	}
	return (
		<div>
			<Text size="lg" onClick={() => reset()}>
				&lt;-- Back
			</Text>
			<Canvas
				className="report-carousel"
				style={{ display: "block", position: "absolute" }}
				camera={{ position: [0, -1000, 0], fov: 15 }}
			>
				{/* <fog attach="fog" args={['#a79', 8.5, 12]} /> */}
				<group ref={sceneRef}>
					<ScrollControls pages={4} infinite>
						<Rig rotation={[0, 0, 0]}>
							<Carousel
								radius={0.75 + reports.length / 7}
								items={reports}
								onSelected={onSelected}
								sceneRef={sceneRef}
							/>
						</Rig>
					</ScrollControls>
					<Environment preset="dawn" background blur={0.02} />
				</group>
			</Canvas>
			<Container
				ref={reportRef}
				className="report"
				style={{ display: "none", position: "absolute" }}
			>
				{reportLoading && <Loading />}
			</Container>
		</div>
	);
};

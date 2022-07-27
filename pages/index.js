import React, { useEffect, useMemo, useRef } from "react";
import * as SDV from "@shapediver/viewer";
import RangeSlider from "../public/components/rangeSlider";

const ShapediverPage = () => {
  const containerRef = useRef(null);

  const viewer = useMemo(async () => {
    if (!containerRef.current) return;

    console.log(viewer);

    return viewer;
  }, [containerRef]);
  

  useEffect(() => {
    const getSession = async () => {
      const session = await SDV.createSession({
        ticket:
          "f3d18b5cf645e16648978afaa0b3389ed03bb463eeaa5049f39a841a49fdbc40ff6a1f6a35c358525781ff58b48eb8bc766f9c5273704ffb7d9f1b3a644086705c3e6dbe2e4fc5101c2b3b26e82b34f75e4a9b808658acfeccb17325d2cad436de68aef83131fc-d0b39c5fb2eaaa5eb54c0f288f4fa44e",
        modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
        id: "mySession4"
      });

      return session;
    };
    console.log('running session');
    getSession();
  }, []);

  useEffect(() => {
    const getViewer = async () => {
      if (!containerRef.current) return;

      console.log(containerRef.current);

      const viewport = await SDV.createViewport({
        canvas: containerRef.current,
        id: "myViewport"
      });

      return viewport;
    };
    console.log(getViewer());
  }, [containerRef]);

  async function handleClick(){
    SDV.sessions['mySession4'].getParameterByName('Shelf Width')[0].value = "1200";    
    await SDV.sessions['mySession4'].customize();
  }

  async function handleChange(e){
    SDV.sessions['mySession4'].getParameterByName('Shelf Width')[0].value = e.target.value;    
    await SDV.sessions['mySession4'].customize();
  }

  return (
    <div style={{ height: 600, width: 600 }}>
      <RangeSlider handleChange={handleChange}></RangeSlider>
      <ShapeDiverV3 ref={containerRef} />
      <h1>Hello World</h1>
      <button onClick={handleClick}>UPDATE VIEW</button>
    </div>
  );
};

const ShapeDiverV3 = React.forwardRef((_, ref) => <canvas ref={ref} />);
ShapeDiverV3.displayName = "Shapediver";

export default ShapediverPage;

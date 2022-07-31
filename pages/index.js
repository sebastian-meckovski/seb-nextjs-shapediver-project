import React, { useEffect, useMemo, useRef, useState } from "react";
import * as SDV from "@shapediver/viewer";
import {InteractionEngine, SelectManager, InteractionData} from "@shapediver/viewer.features.interaction";
import RangeSlider from "../public/components/rangeSlider";
import { createClient } from "next-sanity";
import SideBar from "../public/components/sideBar";

const client = createClient({
  projectId: "mefzw5qp",
  dataset: "seb-test-dataset",
  apiVersion: "2022-03-25",
  useCdn: false
});

export async function getStaticProps() {
  const listOfThings = [
    {
      _createdAt: "2022-03-08T09:28:00Z",
      _id: "1f69c53d-418a-452f-849a-e92466bb9c75",
      _rev: "xnBg0xhUDzo561jnWODd5e",
      _type: "animal",
      _updatedAt: "2022-03-08T09:28:00Z",
      name: "Capybara"
    }
  ];

  return {
    props: {
      listOfThings
    }
  };
}

const listOfThings = await client.fetch(`*[_type == "Description"]`);

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

      session.node.data.push(new InteractionData({ select: true }));
      console.log(session.node.data)
      return session;
    };
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

    const interaction = new InteractionEngine(viewport)
    const selectManager = new SelectManager();
    selectManager.effectMaterial = new SDV.MaterialStandardData({ color: "#ffff00" });
    interaction.addInteractionManager(selectManager);

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
    <div className="mainPage" style={{ height: 500, width: 800 }}>
      <RangeSlider handleChange={handleChange}></RangeSlider>
      <ShapeDiverV3 ref={containerRef} />
      <button onClick={handleClick} className='testButton'>UPDATE VIEW</button>
      <SideBar listOfThings={listOfThings}></SideBar>
    </div>
  );
};

const ShapeDiverV3 = React.forwardRef((_, ref) => <canvas ref={ref} />);
ShapeDiverV3.displayName = "Shapediver";

export default ShapediverPage;

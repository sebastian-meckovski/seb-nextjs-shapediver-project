import { createSession, IParameterApi } from "@shapediver/viewer.session";
import { createViewport } from "@shapediver/viewer.viewport";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { getInputTypeFromParamType } from "./shared/helpers/getInputTypeFromParamType";
import { debounce } from "./shared/helpers/debounce";

export const ViewerFunctionalComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sessionRef = useRef<any>(null);
  const [displayParameters, setDisplayParamters] = useState<
    IParameterApi<unknown>[]
  >([]);

  // Initialization: create the viewport and session, then retrieve the parameter.
  useEffect(() => {
    const init = async () => {
      try {
        if (!canvasRef.current || sessionRef.current) return; // Skip if no canvas or already initialized.

        const canvasElement = canvasRef.current;

        // Create a viewport.
        await createViewport({
          canvas: canvasElement,
        });

        // Create a session.
        const session = await createSession({
          ticket:
            "ba390f092896eaf776e6259f607aeb8946ac1359671be86608452f0718ef7311da4b9ba9d6eff6c841415ca7927ef211a018ba90591a32b75a2d578bd9e613dc1d00e9387ba90e69c809ac6f7f7f923cea54ea061dba656144fd788b65173466f3a8a20fd9429a-2511deeda86828ddaa2386dca43e3bea",
          modelViewUrl: "https://sdr8euc1.eu-central-1.shapediver.com",
        });
        sessionRef.current = session;

        const displayParameters: IParameterApi<unknown>[] = [];
        Object.keys(session.parameters).forEach((key) => {
          const param = session.parameters[key];
          displayParameters.push(param);
        });
        console.log(displayParameters);
        setDisplayParamters(displayParameters);
      } catch (error) {
        console.error("Error initializing the session or viewport:", error);
      }
    };

    init();

    // Optional cleanup if you ever need to clean up session resources.
    return () => {
      sessionRef.current = null;
    };
  }, []);

  // Memoize the parameter update to avoid unnecessary re-renders
  const handleParameterChange = useCallback(
    debounce((e, id) => {
      console.log("helo", e, id);
      const session = sessionRef.current;
      if (!session) return;
      const parameter = session.getParameterById(id);
      if (!parameter) return;
      parameter.value =
        parameter.type === "Bool" ? e.target.checked : e.target.value;
      session.customize().catch((error: any) => {
        console.error("Error customizing session:", error);
      });
    }, 1000),
    []
  );

  const divStyle = {
    width: "800px",
    height: "800px",
  };

  return (
    <div style={divStyle}>
      <canvas ref={canvasRef} />
      {displayParameters.map((param) => {
        const type = getInputTypeFromParamType(param.type);
        return (
          <div key={param.id}>
            <label htmlFor={param.id}>{param.name}</label>
            <input
              type={type}
              id={param.id}
              value={
                displayParameters.find((p) => p.id === param.id)
                  ?.value as string
              }
              checked={
                displayParameters.find((p) => p.id === param.id)
                  ?.value as boolean
              }
              onChange={(e) => {
                setDisplayParamters((prev) => {
                  (prev.find((p) => p.id === param.id) as any).value =
                    param.type === "Bool" ? e.target.checked : e.target.value;
                  return [...prev];
                });
                handleParameterChange(e, param.id);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};


// TODO useEffect optimization for re-rendering
// Error handling
// Enforce min and max values and handle errors in case of invalid values
// re-using session ???
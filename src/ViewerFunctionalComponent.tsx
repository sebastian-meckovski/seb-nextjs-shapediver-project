import { createSession, IParameterApi, ISessionApi } from "@shapediver/viewer.session";
import { createViewport } from "@shapediver/viewer.viewport";
import React, { useEffect, useRef, useState, useCallback, ChangeEvent } from "react";
import { debounce } from "./shared/helpers/debounce";
import Slider from "@mui/material/Slider";
import { Button, Checkbox, TextField } from "@mui/material";
import "./App.css";

export const ViewerFunctionalComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sessionRef = useRef<ISessionApi>(null);
  const hasInitialized = useRef<boolean>(false);
  const [displayParameters, setDisplayParamters] = useState<IParameterApi<unknown>[]>([]);

  // Initialization: create the viewport and session, then retrieve the parameter.
  useEffect(() => {
    const init = async () => {
      try {
        if (!canvasRef.current || sessionRef.current) return; // Skip if no canvas or already initialized.

        const canvasElement = canvasRef.current;

        await createViewport({
          canvas: canvasElement,
        });

        const session = await createSession({
          ticket:
            "ba390f092896eaf776e6259f607aeb8946ac1359671be86608452f0718ef7311da4b9ba9d6eff6c841415ca7927ef211a018ba90591a32b75a2d578bd9e613dc1d00e9387ba90e69c809ac6f7f7f923cea54ea061dba656144fd788b65173466f3a8a20fd9429a-2511deeda86828ddaa2386dca43e3bea",
          modelViewUrl: "https://sdr8euc1.eu-central-1.shapediver.com",
          // modelStateId: 'q1FfKNnKtHlZrmGf'
        });
        sessionRef.current = session;

        const displayParameters: IParameterApi<unknown>[] = [];
        Object.keys(session.parameters).forEach((key) => {
          const param = session.parameters[key];
          displayParameters.push(param);
        });
        setDisplayParamters(displayParameters);
      } catch (error) {
        console.error("Error initializing the session or viewport:", error);
      }
    };
    !hasInitialized.current && init();
    hasInitialized.current = true;

    // Optional cleanup if you ever need to clean up session resources.
    return () => {
      sessionRef.current = null;
    };
  }, []);

  // Memoize the parameter update to avoid unnecessary re-renders
  const handleParameterChange = useCallback(
    debounce((e, id) => {
      const session = sessionRef.current;
      if (!session) return;
      const parameter = session.getParameterById(id);
      if (!parameter) return;
      parameter.value = parameter.type === "Bool" ? e.target.checked : e.target.value;
      session.customize().catch((error: any) => {
        console.error("Error customizing session:", error);
      });
    }, 1000),
    [],
  );

  return (
    <div className="main-container">
      <div className="canvas-container">
        <canvas id="viewer" ref={canvasRef} />
      </div>
      <div className="controls-container">
        {displayParameters.map((param) => {
          if (param.hidden) return null;
          switch (param.type) {
            case "Float":
            case "Int":
              return (
                <div key={param.id} className="parameter-container">
                  <label htmlFor={param.id}>{param.name}</label>
                  <Slider
                    aria-label={param.name}
                    valueLabelDisplay="auto"
                    step={Math.pow(10, param.decimalplaces ? -param.decimalplaces : 0)}
                    min={param.min}
                    max={param.max}
                    value={displayParameters.find((p) => p.id === param.id)?.value as number}
                    onChange={(e: Event, value: number | number[]) => {
                      setDisplayParamters((prev) => {
                        (prev.find((p) => p.id === param.id) as any).value = value;
                        return [...prev];
                      });
                      handleParameterChange(e, param.id);
                    }}
                  />
                </div>
              );
            case "Bool":
              return (
                <div key={param.id} className="parameter-container">
                  <label htmlFor={param.id}>{param.name}</label>
                  <Checkbox
                    aria-label={param.name}
                    checked={displayParameters.find((p) => p.id === param.id)?.value as boolean}
                    onChange={(e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
                      setDisplayParamters((prev) => {
                        (prev.find((p) => p.id === param.id) as any).value = checked;
                        return [...prev];
                      });
                      handleParameterChange(e, param.id);
                    }}
                  />
                </div>
              );
            case "String":
            case "Color":
            case "StringList":
              return (
                <div key={param.id} className="parameter-container">
                  <label htmlFor={param.id}>{param.name}</label>
                  <TextField
                    value={displayParameters.find((p) => p.id === param.id)?.value as string}
                    onChange={(e) => {
                      setDisplayParamters((prev) => {
                        (prev.find((p) => p.id === param.id) as any).value = e.target.value;
                        return [...prev];
                      });
                      handleParameterChange(e, param.id);
                    }}
                  />
                </div>
              );
            default:
              return <p>Parameter type not recognised</p>;
          }
        })}
        <Button
          onClick={async () => {
            const session = sessionRef.current;
            let modelStateId = await session?.createModelState();
            console.log("modelStateId", modelStateId);
            console.log("session?.exports", session?.exports);
          }}
        >
          Get Model State
        </Button>
        <Button
          onClick={async () => {
            const session = sessionRef.current;
            const exportObject = session?.getExportByName("Download 3MF")[0];
            const response = await exportObject?.request();

            if (response?.content && response.filename) {
              const downloadUrl: string = (response.content?.[0] as { href: string }).href;
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.download = response.filename;
              link.click();
            }
          }}
        >
          Download Export
        </Button>
      </div>
    </div>
  );
};

// TODO useEffect optimization for re-rendering
// color picker
// Error handling
// re-using session ???

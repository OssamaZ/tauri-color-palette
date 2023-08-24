import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { BlockPicker } from "react-color";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useClick,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";

type Color = {
  red: number;
  green: number;
  blue: number;
};

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<Color>({ red: 255, green: 200, blue: 0 });
  const [palette, setPalette] = useState<[Color, string][]>([]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(0),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  useEffect(() => {
    (async function load() {
      const palette: [Color, string][] = await invoke("generate_palette", {
        color,
      });
      setPalette(palette);
    })();
  }, [color]);

  return (
    <div className="bg-white flex flex-col min-h-screen relative">
      <button
        className="bg-indigo-700 text-white font-medium text-center py-3 px-4"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <span>Pick a color 🎨</span>
      </button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="Popover"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <BlockPicker
              // colors={["red", "green", "blue", "yellow"]}
              styles={{
                default: {
                  head: {
                    border: "2px solid white",
                  },
                  triangle: {
                    borderColor: "transparent transparent white",
                  },
                  // head: {
                  // },
                },
              }}
              color={{
                r: color.red,
                g: color.green,
                b: color.blue,
              }}
              onChange={(color) => {
                console.log(color);
                const { r: red, g: green, b: blue } = color.rgb;
                setColor({ red, green, blue });
              }}
            />
          </div>
        </FloatingFocusManager>
      )}

      <div className="flex flex-col flex-1">
        {palette?.map(([, c]) => (
          <div
            className="flex-1 flex items-center justify-center"
            style={{
              backgroundColor: c,
            }}
          >
            <p>Color: {c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

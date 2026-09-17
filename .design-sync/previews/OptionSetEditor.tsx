import { useState } from "react";
import { OptionSetEditor } from "@bluesigns/ui";

type OptionSet = React.ComponentProps<typeof OptionSetEditor>["value"][number];

const values = (...labels: string[]) => labels.map((label) => ({ id: label.toLowerCase(), label }));

function Editor({ initial, ...props }: { initial: OptionSet[] } & Omit<React.ComponentProps<typeof OptionSetEditor>, "value" | "onValueChange">) {
  const [sets, setSets] = useState(initial);
  return <OptionSetEditor value={sets} onValueChange={setSets} {...props} />;
}

export const SizeAndColour = () => (
  <div style={{ maxWidth: 720 }}>
    <Editor
      initial={[
        { id: "set-size", name: "Size", values: values("S", "M", "L") },
        { id: "set-colour", name: "Colour", values: values("Black", "Sand") },
      ]}
    />
  </div>
);

export const SingleSet = () => (
  <div style={{ maxWidth: 720 }}>
    <Editor initial={[{ id: "set-storage", name: "Storage", values: values("128 GB", "256 GB", "512 GB") }]} />
  </div>
);

export const ManyCombinations = () => (
  <div style={{ maxWidth: 720 }}>
    <Editor
      warnAbove={20}
      initial={[
        { id: "set-size", name: "Size", values: values("UK 6", "UK 7", "UK 8", "UK 9", "UK 10") },
        { id: "set-colour", name: "Colour", values: values("Black", "White", "Navy") },
        { id: "set-width", name: "Width", values: values("Regular", "Wide") },
      ]}
    />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 720 }}>
    <Editor initial={[]} />
  </div>
);

import { ActiveDevicesList, sampleData } from "@bluesigns/ui";

const { devices } = sampleData;
const wait = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

export const ThreeDevices = () => (
  <div style={{ maxWidth: 640 }}>
    <ActiveDevicesList devices={devices} onSignOut={() => wait()} onSignOutOthers={() => wait(800)} />
  </div>
);

export const OnlyThisDevice = () => (
  <div style={{ maxWidth: 640 }}>
    <ActiveDevicesList devices={devices.slice(0, 1)} onSignOut={() => wait()} onSignOutOthers={() => wait(800)} />
  </div>
);

export const PhoneAndTablet = () => (
  <div style={{ maxWidth: 640 }}>
    <ActiveDevicesList
      devices={[
        { id: "p1", kind: "phone", name: "BlueSigns app on iPhone", location: "Pune, Maharashtra", lastActive: "2026-09-15T08:40:00Z", current: true },
        { id: "p2", kind: "tablet", name: "Chrome on Galaxy Tab", location: "Hyderabad, Telangana", lastActive: "2026-09-10T15:12:00Z" },
      ]}
      onSignOut={() => wait()}
      onSignOutOthers={() => wait(800)}
    />
  </div>
);

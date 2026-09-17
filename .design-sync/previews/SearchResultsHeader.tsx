import { SearchResultsHeader } from "@bluesigns/ui";

export const Results = () => (
  <div style={{ maxWidth: 820 }}>
    <SearchResultsHeader query="headphones" count={24} related={["Noise cancelling headphones", "Wireless earbuds", "Bluetooth speakers"]} />
  </div>
);

export const AutoCorrected = () => (
  <div style={{ maxWidth: 820 }}>
    <SearchResultsHeader query="hedphones" correction="headphones" autoCorrected count={24} />
  </div>
);

export const DidYouMean = () => (
  <div style={{ maxWidth: 820 }}>
    <SearchResultsHeader query="kurta sett" correction="kurta set" count={3} />
  </div>
);

export const SingleResult = () => (
  <div style={{ maxWidth: 820 }}>
    <SearchResultsHeader query="orbit lamp" count={1} />
  </div>
);

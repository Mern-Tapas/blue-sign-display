import { Table, TableBody, TableCaption, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@bluesigns/ui";

const chart = [
  ["UK 6", "US 7", "EU 40", "25.4"],
  ["UK 7", "US 8", "EU 41", "26.2"],
  ["UK 8", "US 9", "EU 42", "27.1"],
  ["UK 9", "US 10", "EU 43", "27.9"],
];

export const SizeChart = () => (
  <div style={{ width: 520 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>UK / India</TableHead>
            <TableHead>US</TableHead>
            <TableHead>EU</TableHead>
            <TableHead className="text-right">Foot length (cm)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chart.map(([uk, us, eu, cm]) => (
            <TableRow key={uk}>
              <TableCell className="font-medium">{uk}</TableCell>
              <TableCell>{us}</TableCell>
              <TableCell>{eu}</TableCell>
              <TableCell className="text-right figures">{cm}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Velocity Runner size chart · measure your foot heel to toe</TableCaption>
      </Table>
    </TableContainer>
  </div>
);

export const DemoDataNote = () => (
  <div style={{ width: 520 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>City</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Bengaluru", "1,284", "₹18.4L"],
            ["Mumbai", "1,102", "₹16.9L"],
            ["Delhi", "968", "₹14.2L"],
            ["Hyderabad", "742", "₹10.1L"],
          ].map(([city, orders, rev]) => (
            <TableRow key={city}>
              <TableCell className="font-medium">{city}</TableCell>
              <TableCell className="text-right figures">{orders}</TableCell>
              <TableCell className="text-right figures">{rev}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Top cities, last 30 days. Demo data — illustrative figures.</TableCaption>
      </Table>
    </TableContainer>
  </div>
);

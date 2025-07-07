import * as React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { createComponent } from '@toolpad/studio/browser';

// Soft pastel color palette
const COLORS = [
  '#FFB6C1', // Light Pink
  '#FFDAB9', // Peach Puff
  '#B0E0E6', // Powder Blue
  '#C1E1C1', // Pastel Green
  '#FADADD', // Misty Rose
  '#E6E6FA', // Lavender
  '#FFDDC1', // Light Apricot
  '#D8BFD8', // Thistle
  '#D3D3D3', // Light Grey
];

export interface PieChartProps {
  data: { name: string; value: number }[];
  loading: boolean;
}

const height = 420;
const width = 420;

function AestheticPieChart({ data, loading }: PieChartProps) {
  if (loading) {
    return <Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</Box>;
  }

  return (
    <Stack direction="row" spacing={4} sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }}>
      <PieChart
        series={[
          {
            data: data.map((entry, index) => ({
              id: index,
              label: entry.name,
              color: COLORS[index % COLORS.length],
              value: entry.value,
            })),
            arcLabel: (item) => item.label!,
            arcLabelMinAngle: 20,
            valueFormatter: ({ value }) =>
              Intl.NumberFormat('en', { notation: 'compact' }).format(value),
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
          },
        }}
        width={width}
        height={height}
        slotProps={{ legend: { hidden: true } }}
      />
      
      {/* Legend */}
      <Stack spacing={2}>
        {data.map((entry, index) => (
          <Stack key={entry.name} direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 14, height: 14, 
              backgroundColor: COLORS[index % COLORS.length], 
              borderRadius: '50%' 
              }} />
            <Typography variant="body2">{entry.name}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default createComponent(AestheticPieChart, {
  argTypes: {
    data: {
      type: 'array',
      default: [
        { name: 'Category A', value: 400 },
        { name: 'Category B', value: 300 },
        { name: 'Category C', value: 300 },
        { name: 'Category D', value: 200 },
      ],
    },
  },
  loadingPropSource: ['data'],
  loadingProp: 'loading',
});
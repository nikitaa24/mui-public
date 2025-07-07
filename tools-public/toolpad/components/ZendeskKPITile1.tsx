import * as React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { createComponent } from '@toolpad/studio/browser';

// Define the component props interface
export interface KpiTileProps {
  title: string; // KPI Title
  value: number; // Current KPIdv value
  prevValue: number; // Previous KPI value
  kpiTarget: number; // Target KPI threshold
  unit: string; // Unit of measurement
  loading?: boolean; // Loading state
}

function KpiTile({ title, value, prevValue, kpiTarget, unit, loading }: KpiTileProps) {
  // Determine color based on percentage change
  let percentageColor = 'text.secondary';
  let valueColor = 'text.primary';
  
  if (!loading && prevValue !== 0) {
    const percentageChange = ((value - prevValue) / prevValue) * 100;
    if (percentageChange > 0) {
      percentageColor = 'error.main'; // Red for increase (worse performance)
    } else if (percentageChange < 0) {
      percentageColor = 'success.main'; // Green for decrease (better performance)
    }
  }

  // Determine color based on KPI target
  if (!loading) {
    if (value > kpiTarget) {
      valueColor = 'error.main'; // Red if above KPI target (worse)
    } else if (value >= kpiTarget * 0.9) {
      valueColor = 'warning.main'; // Amber if close to KPI target (needs attention)
    } else {
      valueColor = 'success.main'; // Green if below KPI target (good)
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white', // Base background
        borderRadius: '8px', // Rounded corners
        boxShadow: 1, // Subtle shadow
        padding: '32px', // Spacing inside the tile
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Stack elements vertically
        alignItems: 'center', // Center align text
        textAlign: 'center', // Align text to the center
        justifyContent: 'center', // Center align content within the container
        width: '100%', // Ensure it takes full width of the parent
        height: '100%', // Ensure it takes full height of the parent
      }}
    >
      {/* Title */}
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>

      {/* Main KPI Value */}
      <Typography variant="h4" fontWeight={700} sx={{ color: valueColor }}>
        {loading ? <Skeleton variant="text" width={60} /> : `${value} ${unit}`}
      </Typography>

      {/* Percentage Change */}
      <Typography variant="body2" sx={{ color: percentageColor, fontWeight: 500 }}>
        {loading ? <Skeleton variant="text" width={40} /> : prevValue !== 0 ? `${(((value - prevValue) / prevValue) * 100).toFixed(1)}%` : '—%'}
      </Typography>

    </Box>
  );
}

export default createComponent(KpiTile, {
  loadingProp: 'loading', // Specify the prop that controls loading state
  loadingPropSource: ['value', 'prevValue', 'kpiTarget', 'unit'], // Loading depends on these props
  argTypes: {
    title: {
      type: 'string',
      default: 'First Reply Time L7D (Business Hours)', // Editable title
    },
    value: {
      type: 'number',
      default: 0, // Default current value
    },
    prevValue: {
      type: 'number',
      default: 0, // Default previous value
    },
    kpiTarget: {
      type: 'number',
      default: 0, // Default KPI target
    },
    unit: {
      type: 'string',
      default: 'hrs', // Default unit of measurement
    }
  },
});



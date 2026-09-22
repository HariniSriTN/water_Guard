import { ZoneData } from '../types/water';

export function parseWaterCsv(csvText: string): { zones: ZoneData[]; errors: string[] } {
  const lines = csvText.trim().split(/\r?\n/);
  const errors: string[] = [];
  
  if (lines.length < 2) {
    return { zones: [], errors: ['CSV must contain a header row and at least one data row.'] };
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"_\s]/g, ''));
  
  // Find column indexes
  const zoneIndex = headers.findIndex(h => h.includes('zone') || h.includes('area') || h.includes('name') || h.includes('district'));
  const supplyIndex = headers.findIndex(h => h.includes('suppl') || h.includes('input') || h.includes('inflow'));
  const consumedIndex = headers.findIndex(h => h.includes('consum') || h.includes('used') || h.includes('billed') || h.includes('meter'));
  const lossIndex = headers.findIndex(h => h.includes('loss') || h.includes('lost') || h.includes('unaccounted'));
  const lossPctIndex = headers.findIndex(h => h.includes('pct') || h.includes('%') || h.includes('percent') || h.includes('lossratio'));
  const pressureIndex = headers.findIndex(h => h.includes('press') || h.includes('bar') || h.includes('psi'));
  const nightFlowIndex = headers.findIndex(h => h.includes('night') || h.includes('mnf') || h.includes('flow'));

  if (zoneIndex === -1) {
    errors.push('Could not find Zone column (e.g., "Zone", "District", "Area").');
  }
  if (supplyIndex === -1 && (consumedIndex === -1 || lossIndex === -1)) {
    errors.push('CSV must include at least Supply and Consumed columns.');
  }

  if (errors.length > 0) {
    return { zones: [], errors };
  }

  const zones: ZoneData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;
    
    // Split by comma ignoring commas inside quotes
    const values = rawLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
    
    const name = values[zoneIndex] || `Zone ${i}`;
    const cleanNum = (val: string | undefined, defaultVal: number = 0) => {
      if (!val) return defaultVal;
      const parsed = parseFloat(val.replace(/[^0-9.-]/g, ''));
      return isNaN(parsed) ? defaultVal : parsed;
    };

    let supply = supplyIndex !== -1 ? cleanNum(values[supplyIndex]) : 20000;
    let consumed = consumedIndex !== -1 ? cleanNum(values[consumedIndex]) : 15000;
    let loss = lossIndex !== -1 ? cleanNum(values[lossIndex]) : Math.max(0, supply - consumed);
    
    if (loss === 0 && supply > consumed) {
      loss = supply - consumed;
    }
    
    let lossPercentage = lossPctIndex !== -1 ? cleanNum(values[lossPctIndex]) : (supply > 0 ? (loss / supply) * 100 : 0);
    if (lossPercentage > 100) lossPercentage = 100;

    let pressure = pressureIndex !== -1 ? cleanNum(values[pressureIndex], 3.4) : 3.4;
    let nightFlow = nightFlowIndex !== -1 ? cleanNum(values[nightFlowIndex], 150) : (loss * 0.15);

    let status: 'normal' | 'warning' | 'abnormal' = 'normal';
    if (lossPercentage >= 30) status = 'abnormal';
    else if (lossPercentage >= 15) status = 'warning';

    const id = `zone-custom-${i}`;

    zones.push({
      id,
      name,
      type: 'Residential',
      populationServed: 10000 + i * 2500,
      pipeLengthKm: 12 + i * 3,
      avgPipeAgeYears: 10 + i * 2,
      currentSupply: Math.round(supply),
      currentConsumed: Math.round(consumed),
      currentLoss: Math.round(loss),
      lossPercentage: parseFloat(lossPercentage.toFixed(1)),
      currentPressure: parseFloat(pressure.toFixed(1)),
      standardPressure: 3.5,
      minNightFlow: Math.round(nightFlow),
      status,
      anomalyScore: Math.round(lossPercentage * 2.2),
      sensorHealth: 'Good',
      coordinates: { x: 150 + (i * 90) % 500, y: 100 + (i * 60) % 300 },
      history: [
        { date: 'Day 1', dayNumber: 1, supplyLiters: supply, consumedLiters: Math.round(supply * 0.9), lossLiters: Math.round(supply * 0.1), lossPercentage: 10.0, pressureBar: 3.5, isAnomaly: false },
        { date: 'Day 2', dayNumber: 2, supplyLiters: supply, consumedLiters: Math.round(supply * 0.88), lossLiters: Math.round(supply * 0.12), lossPercentage: 12.0, pressureBar: 3.4, isAnomaly: false },
        { date: 'Day 3', dayNumber: 3, supplyLiters: supply, consumedLiters: Math.round(supply * 0.85), lossLiters: Math.round(supply * 0.15), lossPercentage: 15.0, pressureBar: 3.3, isAnomaly: false },
        { date: 'Day 4', dayNumber: 4, supplyLiters: supply, consumedLiters: consumed, lossLiters: loss, lossPercentage: lossPercentage, pressureBar: pressure, isAnomaly: status === 'abnormal' }
      ]
    });
  }

  return { zones, errors: [] };
}

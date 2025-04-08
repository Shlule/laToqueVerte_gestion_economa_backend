
export function convertUnit(quantity: number, fromUnit:string, toUnit: string): number{
    const conversionRates = {
        kg: { g: 1000, kg: 1 },
        g: { g: 1, kg: 0.001 },
        unit: { unit: 1 },
      };

      const from = conversionRates[fromUnit];
      const rate = from?.[toUnit]

      if(!rate){
        console.warn(
            `invalid convertion: ${fromUnit} to ${toUnit}`
        );
        return null;
      }
      
    
      return quantity * conversionRates[fromUnit][toUnit];
}
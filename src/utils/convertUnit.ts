export function grammetokg(number: number){
    return number / 1000;
}

export function kgtogramme(number: number){
    return number * 1000
}

export function convertUnit(quantity: number, fromUnit:string, toUnit: string): number{
    const conversionRates = {
        kg: { g: 1000, kg: 1 },
        g: { g: 1, kg: 0.001 },
        l: { ml: 1000, l: 1 },
        ml: { ml: 1, l: 0.001 },
        unit: { unit: 1 },
      };
    
      return quantity * conversionRates[fromUnit][toUnit];
}
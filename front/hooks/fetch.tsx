export async function FecthData(url :string) {
    const data = await fetch(url);
    const result = await data.json();
    
    return result;
}
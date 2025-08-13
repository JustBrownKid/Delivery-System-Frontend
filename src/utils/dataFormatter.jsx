export const formatter = (rawData) =>{
    if(!rawData || rawData.length< 2){
        return [];
    }
    const headers = rawData[0];
    const rows = rawData.slice(1);

    return rows.map(row => {
    const newObject = {};
    headers.forEach((header, index) => {
      newObject[header] = row[index];
    });
    return newObject;
  });
}

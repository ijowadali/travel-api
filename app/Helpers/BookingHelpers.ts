import Bed from "App/Models/hotels/Bed";
export const updateBedStatus = async (id: number,status = 'available') => {
  console.log(id);
  const data = {status:status};
    const bed = await Bed.findOrFail(id);
    console.log(bed);// This will throw an exception if the user is not found
  bed.merge(data);  // Merge the new data
  await bed.save();
}

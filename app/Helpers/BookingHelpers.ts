import Bed from "App/Models/hotels/Bed";
export const updateBedStatus = async (id: number,status = 'available') => {
  const data = {status:status};
    const bed = await Bed.findOrFail(id);
  bed.merge(data);  // Merge the new data
  await bed.save();
}

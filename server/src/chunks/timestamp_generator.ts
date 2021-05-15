const timestamp_generator = () => {
  let date = new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" });
  let arrDate = date.split(" ");
  let s1 = arrDate[0].split("/");
  s1[0] = s1[0].length < 2 ? "0" + s1[0] : s1[0];
  s1[1] = s1[1].length < 2 ? "0" + s1[1] : s1[1];
  let dateFormat = s1.reverse().join("-");
  let s2 = arrDate[1].split(":");
  s2[0] = s2[0].length < 2 ? "0" + s2[0] : s2[0];
  s2[1] = s2[1].length < 2 ? "0" + s2[1] : s2[1];
  s2[2] = s2[2].length < 2 ? "0" + s2[2] : s2[2];
  let hour = s2.join(":");

  let timestamp = dateFormat + " " + hour;
  return timestamp;
};

export default timestamp_generator;

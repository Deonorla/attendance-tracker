export const getIPLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: 5000, // 5km accuracy (typical for IP-based)
      method: "ip",
    };
  } catch (error) {
    throw new Error("Failed to get approximate location");
  }
};

export const getLocation = async () => {
  try {
    // First try precise GPS
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      }
    );

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      method: "gps",
    };
  } catch (gpsError) {
    console.warn("GPS location failed, falling back to IP:", gpsError);
    return await getIPLocation();
  }
};

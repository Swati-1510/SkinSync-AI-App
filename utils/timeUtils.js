// Function to get the appropriate greeting and active routine tab
export const getTimeOfDay = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return { greeting: "Good Morning", tab: "AM" }; // 5:00 AM to 11:59 AM
    } else if (hour >= 12 && hour < 17) {
        return { greeting: "Good Afternoon", tab: "AM" }; // 12:00 PM to 4:59 PM (Keep AM routine active for daytime application)
    } else {
        return { greeting: "Good Evening", tab: "PM" }; // 5:00 PM to 4:59 AM
    }
};
export const adminAuth = (req, res, next) => {
    console.log("Admin authentication middleware triggered");
    const token = "xyz"
    const isAdminAutherised = token === "xyz"; // Simulating admin token check
    if(isAdminAutherised){
        next();
    } else {
        res.status(401).json({ message: "Forbidden: Admins only" });
    }
}
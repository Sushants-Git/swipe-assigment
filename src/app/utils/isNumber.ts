const isNumber = (value?: string | number | null) => {
    if (typeof value === "number") return true;
    if (typeof value === "boolean" || value === null || value === undefined || value === "")
        return false;
    return !isNaN(Number(value));
};

export default isNumber;

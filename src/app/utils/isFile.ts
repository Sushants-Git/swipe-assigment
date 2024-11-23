function isExcelFile(file: File) {
    const excelMimeTypes = [
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
    ];

    const isMimeTypeValid = excelMimeTypes.includes(file.type);

    const fileName = file.name.toLowerCase();
    const hasExcelExtension =
        fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".ods");

    return isMimeTypeValid || hasExcelExtension;
}

function isPdfFile(file: File) {
    const pdfMimeType = "application/pdf"; // PDF MIME type

    const isMimeTypeValid = file.type === pdfMimeType;

    const fileName = file.name.toLowerCase();
    const hasPdfExtension = fileName.endsWith(".pdf");

    return isMimeTypeValid || hasPdfExtension;
}

function isImageFile(file: File) {
    const imageMimeTypes = [
        "image/jpeg", // .jpg, .jpeg
        "image/png", // .png
        "image/bmp", // .bmp
        "image/tiff", // .tiff
    ];

    const isMimeTypeValid = imageMimeTypes.includes(file.type);

    const fileName = file.name.toLowerCase();
    const hasImageExtension =
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png") ||
        fileName.endsWith(".bmp") ||
        fileName.endsWith(".tiff");

    return isMimeTypeValid || hasImageExtension;
}

export { isExcelFile, isPdfFile, isImageFile };

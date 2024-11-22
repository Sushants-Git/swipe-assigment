export default function isExcelFile(file: File) {
    const excelMimeTypes = [
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
    ];

    const isMimeTypeValid = excelMimeTypes.includes(file.type);

    const fileName = file.name.toLowerCase();
    const hasExcelExtension =
        fileName.endsWith(".xlsx") ||
        fileName.endsWith(".xls") ||
        fileName.endsWith(".ods");

    return isMimeTypeValid || hasExcelExtension;
}

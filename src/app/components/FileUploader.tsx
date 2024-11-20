import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FileUp, File, AlertCircle } from "lucide-react";

export const FileUploader = ({
    handleFileUpload,
    fileName,
    fileUploadStatus,
}: {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileName: string | null;
    fileUploadStatus: "idle" | "success" | "error";
}) => {
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Upload Invoice File</CardTitle>
                <CardDescription>
                    Accept Excel files (.xlsx, .xls, .csv) with transaction
                    details or PDF/Images (.pdf, .png, .jpg, .jpeg) of invoices.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file-upload" className="sr-only">
                            Choose file
                        </Label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="file-upload"
                                type="file"
                                accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button
                                onClick={() =>
                                    document
                                        .getElementById("file-upload")
                                        ?.click()
                                }
                                variant="outline"
                                className="w-full"
                            >
                                <FileUp className="mr-2 h-4 w-4" />
                                Choose File
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" className="flex-shrink-0">
                            Extract Data
                        </Button>
                        {fileName && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <File className="h-4 w-4" />
                                {fileName}
                            </div>
                        )}
                    </div>
                </div>
                <FileUploadStatus status={fileUploadStatus} />
            </CardContent>
        </Card>
    );
};

const FileUploadStatus = ({
    status,
}: {
    status: "idle" | "success" | "error";
}) => {
    if (!status || status === "idle") return null;

    const statusConfig = {
        success: {
            className: "bg-green-100 border-green-500 text-green-800",
            title: "Success",
            description: "File uploaded successfully.",
        },
        error: {
            className: "bg-red-100 border-red-500 text-red-800",
            title: "Error",
            description:
                "There was an error uploading the file. Please try again.",
        },
    };

    const config = statusConfig[status];

    if (!config) return null;

    return (
        <Alert className={`mt-4 ${config.className}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{config.title}</AlertTitle>
            <AlertDescription>{config.description}</AlertDescription>
        </Alert>
    );
};

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp } from "lucide-react";

interface FileUploaderProps {
    children: React.ReactNode;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileName?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ children, handleFileUpload, fileName }) => {
    const handleButtonClick = () => {
        document.getElementById("file-upload")?.click();
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Upload Invoice File</CardTitle>
                <CardDescription>
                    Accept Excel files (.xlsx, .xls, .csv) with transaction details or PDF/Images (.pdf,
                    .png, .jpg, .jpeg) of invoices.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="grid w-full max-w-sm gap-1.5">
                        <Label htmlFor="file-upload" className="sr-only">
                            Choose file
                        </Label>
                        <Input
                            id="file-upload"
                            type="file"
                            accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <Button onClick={handleButtonClick} variant="outline" className="w-full">
                            <span className="flex items-center gap-2">
                                <FileUp className="h-4 w-4" />
                                {fileName ? (
                                    <span className="truncate block w-20 sm:w-32 md:w-48 lg:w-64 text-sm text-muted-foreground">
                                        {fileName}
                                    </span>
                                ) : (
                                    "Choose File"
                                )}
                            </span>
                        </Button>
                    </div>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};

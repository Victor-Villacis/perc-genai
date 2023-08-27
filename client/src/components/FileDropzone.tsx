import React from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import { Backdrop, CircularProgress, TextField, Button, LinearProgress } from '@mui/material';


interface FileDropzoneProps {
    open: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}


export default function FileDropzone({ open, handleOpen, handleClose }: FileDropzoneProps) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [showEmailModal, setShowEmailModal] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const handleSave = (newFiles: File[]) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('uploadedFile', newFiles[0]);

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject("Failed to upload file");
                }
                return response.json();
            })
            .then(data => {
                console.log("Server response:", data);
                setLoading(false);
                setShowEmailModal(true);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                setLoading(false);
            });

        setFiles(newFiles);
        handleClose();
    };

    const handleEmailSubmit = () => {
        // Handle email submission logic here
        console.log("Email submitted:", email);
        setShowEmailModal(false);
    };

    return (
        <>
            <DropzoneDialog
                open={open}
                onSave={handleSave}
                acceptedFiles={['application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                showPreviews={true}
                maxFileSize={5000000}
                onClose={handleClose}
                dialogTitle={<p style={{ textAlign: 'center' }}>Upload File and Run Summary</p>}
                dropzoneText="Drag and drop a file here or click"
                submitButtonText={"Run Summary"}
                filesLimit={1}
                // remove the horizontal scroll bar after uploading a file
                previewGridProps={{ container: { spacing: 2, style: { width: '100%', margin: 0 } } }}

            />

            <Backdrop open={loading} style={{ color: '#fff', zIndex: 1500, flexDirection: 'column', alignItems: 'center' }}>
                <LinearProgress color="primary" style={{ width: '80%', marginBottom: '20px' }} />

                <div style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
                    maxWidth: '400px',
                    width: '100%',
                }}>
                    <h3 style={{ color: "black", textAlign: 'center', margin: '0 0 10px 0' }}>Enter email to get notified when done</h3>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                        onClick={handleEmailSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </Backdrop>
        </>
    );


}

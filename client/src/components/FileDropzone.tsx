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
    const [email, setEmail] = React.useState('');
    const [emailSubmitted, setEmailSubmitted] = React.useState(false);
    const [validationMessage, setValidationMessage] = React.useState<string | null>(null);


    const handleSave = (newFiles: File[]) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('uploadedFile', newFiles[0]);
        formData.append('email', email);


        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,

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
                setFiles([]);
                setEmail('');
                setEmailSubmitted(false);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                setLoading(false);
            });

        setFiles(newFiles);
        handleClose();
    };
    const handleEmailSubmit = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailPattern.test(email)) {
            console.log("Email submitted:", email);
            setEmailSubmitted(true);
            setValidationMessage(null);
        } else {
            setValidationMessage("Please enter a valid email address.");
        }
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
                dialogTitle={
                    <p style={{ textAlign: 'center' }}>
                        <span style={{ color: 'lightblue', fontWeight: 'bold' }}>Upload File and Run Summary</span>
                        <br />
                        <span style={{ color: "yellowgreen", fontWeight: 'bold' }}>One File at a Time</span>
                    </p>
                }
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
                    <h3 style={{ color: "black", textAlign: 'center', margin: '0 0 10px 0' }}>Enter email and get notified when summary is ready.</h3>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            readOnly: emailSubmitted,
                        }}
                    />
                    {validationMessage && (
                        <div style={{ color: "red", marginTop: "5px" }}>
                            {validationMessage}
                        </div>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                        onClick={handleEmailSubmit}
                        disabled={emailSubmitted}
                    >
                        Submit
                    </Button>
                    {emailSubmitted && (
                        <Button
                            onClick={() => setEmailSubmitted(false)}
                        >
                            Edit Email
                        </Button>
                    )}


                </div>

            </Backdrop>
        </>
    );


}

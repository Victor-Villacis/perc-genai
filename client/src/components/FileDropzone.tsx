import React from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import { Backdrop, TextField, Button, LinearProgress } from '@mui/material';
import styled from 'styled-components';

interface FileDropzoneProps {
    open: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}

const DropzoneText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #004387;
  margin-bottom: 5px;
`;

const SubText = styled.span`
  font-size: 1rem;
  color: #a8a8a8;
  font-weight: 500;
`;

const LoaderBackdrop = styled(Backdrop)`
  color: #fff;
  z-index: 1500;
  flex-direction: column;
  align-items: center;
`;

const EmailBox = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
`;

const ValidationMessage = styled.div`
  color: red;
  margin-top: 5px;
`;

const StyledLinearProgress = styled(LinearProgress)`
  width: 80%;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
`;

export default function FileDropzone({ open, handleOpen, handleClose }: FileDropzoneProps) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [emailSubmitted, setEmailSubmitted] = React.useState(false);
    const [validationMessage, setValidationMessage] = React.useState<string | null>(null);


    const handleSave = (newFiles: File[]) => {
        setLoading(true);

        console.log("Uploading file:", newFiles[0]);
        console.log("Uploading with email:", email);

        const formData = new FormData();
        formData.append('uploadedFile', newFiles[0]);
        formData.append('email', email);

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    response.text().then(text => {
                        console.error("Server Response:", text);
                    });
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
                    <DropzoneText>
                        <SubText>Currently supporting single file upload. Multi-file support coming soon!</SubText>
                    </DropzoneText>
                }
                dropzoneText="Drag and Drop to Generate Summary"
                submitButtonText={"Run Summary"}
                filesLimit={1}
                // remove the horizontal scroll bar after uploading a file
                previewGridProps={{ container: { spacing: 2, style: { width: '100%', margin: 0 } } }}

            />

            <LoaderBackdrop open={loading}>
                <StyledLinearProgress color="primary" />
                <EmailBox>
                    <h3 style={{ color: "black", textAlign: 'center', margin: '0 0 10px 0' }}>
                        Enter email and get notified when summary is ready.
                    </h3>
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
                    {validationMessage && <ValidationMessage>{validationMessage}</ValidationMessage>}
                    <StyledButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleEmailSubmit}
                        disabled={emailSubmitted}
                    >
                        Submit
                    </StyledButton>
                    {emailSubmitted && <Button onClick={() => setEmailSubmitted(false)}>Edit Email</Button>}
                </EmailBox>
            </LoaderBackdrop>
        </>
    );


}

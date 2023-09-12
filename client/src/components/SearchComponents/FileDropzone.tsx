import React from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import { Backdrop, CircularProgress, TextField, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
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


    const handleSave = async (newFiles: File[]) => {
        handleClose();
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('uploadedFile', newFiles[0]);
            formData.append('email', email);

             const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            })
            if (response.status !== 200) {
                throw new Error("Failed to upload file");
            }

            console.log("Server response from /upload:", response.data);
            setLoading(false);
            setFiles([]);
            setEmail('');
            setEmailSubmitted(false);
        } catch (error) {
            console.error('Error uploading file:', error);
            setLoading(false);
        }

        setFiles(newFiles);
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
                dropzoneText="Drag and drop a file here or click"
                submitButtonText={"Run Summary"}
                filesLimit={1}
                previewGridProps={{ container: { spacing: 2, style: { width: '100%', margin: 0 } } }}

            />

            <LoaderBackdrop open={loading} style={{ color: '#fff', zIndex: 1500, flexDirection: 'column', alignItems: 'center' }}>
                <StyledLinearProgress color="primary" />


                <EmailBox>
                    <h3 style={{ color: "#313638", textAlign: 'center', margin: '0 0 10px 0' }}>
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
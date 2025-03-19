"use client";

import { useState } from "react";
import Link from "next/link";
import { Paper, Typography, Button, Dialog, DialogContent, DialogActions } from "@mui/material";

interface LoginCTAProps {
  message?: string;
  onClose?: () => void;
  isDialog?: boolean;
}

export default function LoginCTA({ 
  message = "Sign up or log in to save your focus sessions and track your productivity over time.", 
  onClose,
  isDialog = false
}: LoginCTAProps) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const content = (
    <>
      <Typography variant="h5" component="h3" gutterBottom>
        Want to save your progress?
      </Typography>
      <Typography variant="body1" paragraph>
        {message}
      </Typography>
      <div className="flex flex-row gap-4 justify-center mt-4">
        <Link href="/auth/signup">
          <Button 
            variant="contained" 
            color="primary"
            className="bg-[var(--accent)]"
          >
            Sign Up
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button 
            variant="outlined" 
            color="primary"
          >
            Log In
          </Button>
        </Link>
        {onClose && (
          <Button 
            variant="text" 
            onClick={handleClose}
          >
            Continue without saving
          </Button>
        )}
      </div>
    </>
  );

  if (isDialog) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {content}
        </DialogContent>
        {onClose && (
          <DialogActions>
            <Button onClick={handleClose}>Continue without saving</Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }

  return (
    <Paper className="p-6 max-w-md mx-auto my-8 text-center">
      {content}
    </Paper>
  );
}

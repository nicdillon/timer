"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Box
} from "@mui/material";
import { signUp } from './actions'

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setSuccess("");
    
    // Validate form
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      // Use the AuthContext's signUp method
      await signUp(email, password);
      
      setSuccess("Account created successfully! Please check your email for verification.");
      
      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        
        // If user already exists, we can redirect to login
        if (err.message.includes("already registered")) {
          setSuccess("Email already registered. Redirecting to login...");
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--background)] md:rounded p-4">
      <Paper className="p-8 max-w-md w-full">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create an Account
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" className="mb-4">
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // disabled={isLoading}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // disabled={isLoading}
            required
          />
          
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // disabled={isLoading}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            // disabled={isLoading}
            className="bg-[var(--accent)]"
          >
            {/* {isLoading ? <CircularProgress size={24} /> : "Sign Up"} */}
          </Button>
        </form>
        
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--accent)]">
              Log in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}

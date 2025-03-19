"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  Box,
  Divider
} from "@mui/material";
import { useAuth } from "../../AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    
    // Validate form
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    try {
      // Use the AuthContext's signIn method
      await signIn(email, password);
      
      // Redirect to timer page on successful login
      router.push("/timer");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--background)] md:rounded p-4">
      <Paper className="p-8 max-w-md w-full">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Log In
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            className="bg-[var(--accent)]"
          >
            {isLoading ? <CircularProgress size={24} /> : "Log In"}
          </Button>
        </form>
        
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[var(--accent)]">
              Sign up
            </Link>
          </Typography>
        </Box>
        
        <Divider className="my-4">
          <Typography variant="body2" color="textSecondary">
            OR
          </Typography>
        </Divider>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mt-2"
        >
          Continue with Google
        </Button>
      </Paper>
    </div>
  );
}

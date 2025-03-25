"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Eye, EyeOff, LogIn } from "react-feather";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!username || !password) {
      setFormError("Please enter both username and password");
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>RPS Tours Dashboard</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        {(error || formError) && (
          <Alert severity="error" className="login-alert">
            {formError || error}
          </Alert>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
            disabled={loading}
            startIcon={<LogIn />}
            className="login-button"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="login-footer">
          <p>
            &copy; {new Date().getFullYear()} RPS Tours. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

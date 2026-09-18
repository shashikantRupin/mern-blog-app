import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/forgotPassword.css";
import { NavLink, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const ForgotPassword = () => {
  // Current active step: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form State
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Timer for OTP Resend
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef([]);
  const navigate = useNavigate();

  // Handle countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Password validation criteria
  const criteria = {
    minLength: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasDigit: /[0-9]/.test(newPassword),
    hasSpecial: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?~`]/.test(newPassword),
  };

  const validCount = Object.values(criteria).filter(Boolean).length;
  const isStrongPassword = validCount === 5;

  const getStrengthMeta = () => {
    if (!newPassword) return { label: "", percent: 0, className: "" };
    if (validCount <= 2) return { label: "Weak", percent: 30, className: "weak" };
    if (validCount <= 4) return { label: "Moderate", percent: 70, className: "medium" };
    return { label: "Strong & Secure", percent: 100, className: "strong" };
  };

  const strengthMeta = getStrengthMeta();

  // ==========================================
  // STEP 1: REQUEST OTP
  // ==========================================
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(`${baseURL}/forgot-password/send-otp`, {
        email: email.trim(),
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.msg || "Verification code sent to your email. Please check your inbox.");
        setStep(2);
        setTimer(60);
        setCanResend(false);
        // Focus first OTP box
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 150);
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      const serverMsg = error.response?.data?.msg || error.response?.data?.message;
      setErrorMessage(serverMsg || "Failed to send verification code. Please check your email.");
    } finally {
      setLoader(false);
    }
  };

  // ==========================================
  // STEP 2: HANDLE OTP INPUT & VERIFICATION
  // ==========================================
  const handleOtpChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);
      return;
    }

    // Handle single character
    const char = cleaned.slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = char;
    setOtpValues(newOtp);

    // Auto focus next box
    if (index < 5 && char) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otpValues];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtpValues(newOtp);

    const focusIndex = Math.min(digits.length, 5);
    otpInputsRef.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const fullOtp = otpValues.join("");
    if (fullOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(`${baseURL}/forgot-password/verify-otp`, {
        email: email.trim(),
        otp: fullOtp,
      });

      if (response.status === 200 && response.data.verified) {
        setSuccessMessage("Code verified! Set your new password.");
        setStep(3);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const serverMsg = error.response?.data?.msg || error.response?.data?.message;
      setErrorMessage(serverMsg || "Invalid or expired verification code.");
    } finally {
      setLoader(false);
    }
  };

  // ==========================================
  // STEP 3: RESET PASSWORD
  // ==========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isStrongPassword) {
      setErrorMessage(
        "Please meet all password complexity requirements before proceeding."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    const fullOtp = otpValues.join("");

    try {
      setLoader(true);
      const response = await axios.post(`${baseURL}/forgot-password/reset-password`, {
        email: email.trim(),
        otp: fullOtp,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        setStep(4);
        // Automatically redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3200);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      const serverMsg = error.response?.data?.msg || error.response?.data?.message;
      setErrorMessage(serverMsg || "Failed to reset password. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  // Calculate progress line width
  const progressPercent =
    step === 1 ? "0%" : step === 2 ? "50%" : step === 3 ? "100%" : "100%";

  return (
    <div className="auth-page-container">
      <div className="auth-ambient-glow"></div>

      <div className="auth-card forgot-card">
        {/* Step Indicator Header (Steps 1 to 3) */}
        {step <= 3 && (
          <div className="wizard-steps-container">
            <div
              className="wizard-progress-line"
              style={{ width: `calc(${progressPercent} * 0.85)` }}
            ></div>

            <div className={`wizard-step-item ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
              <div className="wizard-step-circle">
                {step > 1 ? <CheckIcon fontSize="inherit" /> : "1"}
              </div>
              <span className="wizard-step-label">Email</span>
            </div>

            <div className={`wizard-step-item ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
              <div className="wizard-step-circle">
                {step > 2 ? <CheckIcon fontSize="inherit" /> : "2"}
              </div>
              <span className="wizard-step-label">Verify Code</span>
            </div>

            <div className={`wizard-step-item ${step === 3 ? "active" : step > 3 ? "completed" : ""}`}>
              <div className="wizard-step-circle">
                {step > 3 ? <CheckIcon fontSize="inherit" /> : "3"}
              </div>
              <span className="wizard-step-label">New Password</span>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="auth-alert error">
            <ErrorOutlineIcon fontSize="small" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && step < 4 && (
          <div className="auth-alert success">
            <CheckCircleOutlineIcon fontSize="small" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* =========================================================
            STEP 1: ENTER REGISTERED EMAIL
           ========================================================= */}
        {step === 1 && (
          <div>
            <div className="auth-header">
              <div className="auth-logo-badge">
                <KeyOutlinedIcon fontSize="inherit" />
              </div>
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">
                Enter your registered email address and we'll send you a 6-digit verification code.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Registered Email</label>
                <div className="auth-input-wrapper">
                  <EmailOutlinedIcon className="auth-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    autoFocus
                    className="auth-input"
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loader}>
                {loader ? (
                  <CircularProgress size={22} style={{ color: "#ffffff" }} />
                ) : (
                  "Send Verification Code"
                )}
              </button>

              <div className="auth-switch-prompt">
                <NavLink to="/login" className="auth-switch-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <ArrowBackIcon fontSize="small" />
                  <span>Back to Sign In</span>
                </NavLink>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================
            STEP 2: ENTER & VERIFY 6-DIGIT OTP
           ========================================================= */}
        {step === 2 && (
          <div>
            <div className="auth-header">
              <div className="auth-logo-badge">✦</div>
              <h1 className="auth-title">Verify Code</h1>
              <p className="auth-subtitle">
                Enter the 6-digit security code sent to your email address.
              </p>
            </div>

            <div className="target-email-strip">
              <span className="target-email-text">
                Sent to: <span className="target-email-highlight">{email}</span>
              </span>
              <button
                type="button"
                className="change-email-btn"
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                Change
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="otp-input-container" onPaste={handleOtpPaste}>
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`otp-box-input ${digit ? "filled" : ""}`}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <div className="otp-helper-row">
                <div className="otp-timer-badge">
                  <TimerOutlinedIcon fontSize="small" />
                  <span>
                    {timer > 0 ? `Code expires in 0:${timer < 10 ? `0${timer}` : timer}` : "Code expired"}
                  </span>
                </div>

                <button
                  type="button"
                  className="otp-resend-btn"
                  disabled={!canResend || loader}
                  onClick={() => handleSendOtp()}
                >
                  {loader ? "Sending..." : "Resend Code"}
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loader || otpValues.join("").length !== 6}
              >
                {loader ? (
                  <CircularProgress size={22} style={{ color: "#ffffff" }} />
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <div className="auth-switch-prompt">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="change-email-btn"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <ArrowBackIcon fontSize="small" />
                  <span>Back to email entry</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================
            STEP 3: SET NEW PASSWORD
           ========================================================= */}
        {step === 3 && (
          <div>
            <div className="auth-header">
              <div className="auth-logo-badge">🔒</div>
              <h1 className="auth-title">Create New Password</h1>
              <p className="auth-subtitle">
                Choose a strong, unique password to secure your account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="auth-form">
              {/* New Password */}
              <div className="auth-field">
                <label className="auth-label">New Password</label>
                <div className="auth-input-wrapper">
                  <LockOutlinedIcon className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    placeholder="Enter new password"
                    required
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="strength-meter-container">
                    <div className="strength-meter-header">
                      <span className="strength-text">Password Security:</span>
                      <span className={`strength-badge ${strengthMeta.className}`}>
                        {strengthMeta.label}
                      </span>
                    </div>
                    <div className="strength-meter-track">
                      <div
                        className={`strength-meter-fill ${strengthMeta.className}`}
                        style={{ width: `${strengthMeta.percent}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements Checklist */}
                {isPasswordFocused && (
                  <div className="password-checklist-box">
                    <span className="checklist-title">Password must contain:</span>
                    <ul className="checklist-items">
                      <li className={`checklist-item ${criteria.minLength ? "met" : ""}`}>
                        {criteria.minLength ? (
                          <CheckIcon className="check-icon" fontSize="inherit" />
                        ) : (
                          <CloseIcon className="close-icon" fontSize="inherit" />
                        )}
                        <span>At least 8 characters</span>
                      </li>
                      <li className={`checklist-item ${criteria.hasUpper ? "met" : ""}`}>
                        {criteria.hasUpper ? (
                          <CheckIcon className="check-icon" fontSize="inherit" />
                        ) : (
                          <CloseIcon className="close-icon" fontSize="inherit" />
                        )}
                        <span>At least 1 uppercase letter (A-Z)</span>
                      </li>
                      <li className={`checklist-item ${criteria.hasLower ? "met" : ""}`}>
                        {criteria.hasLower ? (
                          <CheckIcon className="check-icon" fontSize="inherit" />
                        ) : (
                          <CloseIcon className="close-icon" fontSize="inherit" />
                        )}
                        <span>At least 1 lowercase letter (a-z)</span>
                      </li>
                      <li className={`checklist-item ${criteria.hasDigit ? "met" : ""}`}>
                        {criteria.hasDigit ? (
                          <CheckIcon className="check-icon" fontSize="inherit" />
                        ) : (
                          <CloseIcon className="close-icon" fontSize="inherit" />
                        )}
                        <span>At least 1 number (0-9)</span>
                      </li>
                      <li className={`checklist-item ${criteria.hasSpecial ? "met" : ""}`}>
                        {criteria.hasSpecial ? (
                          <CheckIcon className="check-icon" fontSize="inherit" />
                        ) : (
                          <CloseIcon className="close-icon" fontSize="inherit" />
                        )}
                        <span>At least 1 special character (@$!%*?&#)</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="auth-field">
                <label className="auth-label">Confirm New Password</label>
                <div className="auth-input-wrapper">
                  <LockOutlinedIcon className="auth-input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <span style={{ fontSize: "12px", color: "var(--error)", marginTop: "4px", display: "block" }}>
                    Passwords do not match
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loader || !isStrongPassword || newPassword !== confirmPassword}
              >
                {loader ? (
                  <CircularProgress size={22} style={{ color: "#ffffff" }} />
                ) : (
                  "Reset Password & Sign In"
                )}
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
            STEP 4: SUCCESS CONFIRMATION
           ========================================================= */}
        {step === 4 && (
          <div className="success-card-content">
            <div className="success-icon-badge">
              <CheckCircleOutlineIcon fontSize="inherit" />
            </div>

            <h2 className="success-title">Password Reset Successful!</h2>
            <p className="success-desc">
              Your password has been successfully updated. You can now use your new password to sign in.
            </p>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={() => navigate("/login")}
              style={{ width: "100%" }}
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

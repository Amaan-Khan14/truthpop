import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
} from "@react-email/components";

// Interface for the email props
interface VerifyEmailProps {
  username: string;
  otp: string;
}

// Function to generate the email template
export const VerifyEmail: React.FC<VerifyEmailProps> = ({ username, otp }) => {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={headingStyle}>One-Time Password (OTP)</Text>
          <Text style={paragraphStyle}>Hello {username},</Text>
          <Text style={paragraphStyle}>Your OTP for authentication is:</Text>
          <Text style={otpStyle}>{otp}</Text>
          <Button
            style={buttonStyle}
            href={`https://truthpop.amaanis.live/verify-email/${username}`}
          >
            Verify OTP
          </Button>
          <Text style={footerStyle}>
            If you did not request this OTP, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center",
  margin: "30px 0",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const otpStyle: React.CSSProperties = {
  fontSize: "48px",
  fontWeight: "bold",
  textAlign: "center",
  margin: "30px 0",
  color: "#007bff",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "18px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "200px",
  padding: "14px 7px",
  margin: "30px auto",
};

const footerStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#9ca299",
  textAlign: "center",
  marginTop: "20px",
};

export default VerifyEmail;

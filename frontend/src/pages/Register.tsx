import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { register } from "../services/authService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await register(name, email, password);
      loginUser(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="font-h2 text-h2 text-on-surface mb-6 text-center">
        Create Account
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="register-name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon="person"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="register-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="register-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon="lock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && (
          <div className="bg-error-container text-on-error-container text-label-sm p-3 rounded-lg">
            {error}
          </div>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <p className="text-body-sm text-on-surface-variant text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default Register;
